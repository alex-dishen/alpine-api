import { randomUUID } from 'crypto';
import { verify, hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JwtTokenDecode } from './types/types';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { OAuthStrategyFactory } from './strategies/oauth-strategy.factory';
import { OAuthSignInInput, SignInInput, SignUpInput, TokensOutput } from './types/auth.service.types';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    private oAuthStrategyFactory: OAuthStrategyFactory,
  ) {}

  private async createTokenAndHandleUserSession(userId: string): Promise<TokensOutput> {
    const sessionsId = randomUUID();

    const { accessToken, refreshToken, refreshExpiresIn, refreshTokenKey, hashedRefreshToken } =
      await this.tokenService.createTokens(userId, sessionsId);

    await this.authRepository.createOrUpdateUserSession(refreshTokenKey, hashedRefreshToken, refreshExpiresIn);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async signIn(data: SignInInput): Promise<TokensOutput> {
    const user = await this.userRepository.getUserBy({ email: data.email });

    if (!user) throw new UnauthorizedException('Credentials incorrect');

    if (!user.password)
      throw new UnauthorizedException({
        message:
          'This email is already registered with Google. Would you like to link your email/password login to your Google account?',
        code: 'EMAIL_LINK_GOOGLE_REQUIRED',
      });

    const passwordsMatch = await verify(user.password, data.password);

    if (!passwordsMatch) throw new UnauthorizedException('Credentials incorrect');

    return this.createTokenAndHandleUserSession(user.id);
  }

  async signUp(data: SignUpInput): Promise<TokensOutput> {
    const existingUser = await this.userRepository.getUserBy({ email: data.email });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(data.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmation_password, ...updatedData } = { ...data, password: hashedPassword };

    const user = await this.userRepository.createUser(updatedData);

    return this.createTokenAndHandleUserSession(user.id);
  }

  async signInWithOAuth(data: OAuthSignInInput): Promise<TokensOutput> {
    const { code, provider } = data;

    const strategy = this.oAuthStrategyFactory.getStrategy(provider);
    const userData = await strategy.authenticate(code);

    let dbUser = await this.userRepository.getUserBy({ email: userData.email });

    if (!dbUser) {
      dbUser = await this.userRepository.createUser({
        email: userData.email,
        provider_id: userData.providerId,
        last_name: userData.lastName,
        first_name: userData.firstName,
        provider: userData.provider,
      });
    }

    return this.createTokenAndHandleUserSession(dbUser.id);
  }

  async refreshAccessToken(expiredAccessToken: string, refreshToken: string): Promise<TokensOutput> {
    const decodedRefresh = await this.tokenService.decodeToken(refreshToken);
    const decodeAccess = await this.tokenService.decodeToken(expiredAccessToken);
    const sessionId = decodedRefresh['sub'];
    const userId = decodeAccess['sub'];

    try {
      await this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          const refreshTokenKey = this.tokenService.getRefreshTokenKey(userId, sessionId);
          await this.authRepository.deleteUserSession(refreshTokenKey);

          throw new UnauthorizedException({
            message: 'JWT token is no longer valid',
          });
        }

        throw new UnauthorizedException({
          message: error.message,
        });
      } else {
        throw new InternalServerErrorException({ message: 'Unknown Error' });
      }
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshExpiresIn,
      refreshTokenKey,
      hashedRefreshToken,
    } = await this.tokenService.createTokens(userId, sessionId);

    const userRefreshToken = await this.authRepository.getUserSessionById(refreshTokenKey);

    if (!userRefreshToken) throw new ForbiddenException('Access denied');

    const refreshTokenMatch = await verify(userRefreshToken, refreshToken);

    if (!refreshTokenMatch) throw new ForbiddenException('Access denied');

    await this.authRepository.createOrUpdateUserSession(refreshTokenKey, hashedRefreshToken, refreshExpiresIn);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const decoded = await this.jwtService.decode<Promise<JwtTokenDecode>>(refreshToken);
    const sessionId = decoded['sub'];

    const refreshTokenKey = this.tokenService.getRefreshTokenKey(userId, sessionId);

    await this.authRepository.deleteUserSession(refreshTokenKey);
  }
}
