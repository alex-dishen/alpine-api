import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { AuthCookieService } from './auth-cookie.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AccessTokenDto, OAuthSignInDto, SignUpDto, SingInDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: AuthCookieService,
  ) {}

  @ApiOperation({ summary: 'Log in into the system' })
  @Post('/sign-in')
  async signIn(@Body() data: SingInDto, @Res({ passthrough: true }) res: Response): Promise<AccessTokenDto> {
    const authResult = await this.authService.signIn(data);
    this.cookieService.setRefreshTokenCookie(res, authResult.refresh_token);

    return { access_token: authResult.access_token };
  }

  @ApiOperation({ summary: 'Log in into the system' })
  @Post('/sign-up')
  async signUp(@Body() data: SignUpDto, @Res({ passthrough: true }) res: Response): Promise<AccessTokenDto> {
    const authResult = await this.authService.signUp(data);
    this.cookieService.setRefreshTokenCookie(res, authResult.refresh_token);

    return { access_token: authResult.access_token };
  }

  @ApiOperation({ summary: 'Sign in with OAuth provider (Google, LinkedIn, Apple)' })
  @Post('/sign-in/oauth')
  async oauthSignIn(@Body() data: OAuthSignInDto, @Res({ passthrough: true }) res: Response): Promise<AccessTokenDto> {
    const authResult = await this.authService.signInWithOAuth(data);
    this.cookieService.setRefreshTokenCookie(res, authResult.refresh_token);

    return { access_token: authResult.access_token };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AccessTokenDto> {
    const refreshToken = this.cookieService.getRefreshTokenFromRequest(req);
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    const expiredAccessToken = type === 'Bearer' ? token : undefined;

    if (!expiredAccessToken || !refreshToken) {
      throw new UnauthorizedException('JWT token is required for refresh');
    }

    const authResult = await this.authService.refreshAccessToken(expiredAccessToken, refreshToken);

    this.cookieService.setRefreshTokenCookie(res, authResult.refresh_token);

    return { access_token: authResult.access_token };
  }

  @ApiOperation({ summary: 'Logout a user from the system' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetUser('sub') userId: string,
  ): Promise<MessageDto> {
    const refreshToken = this.cookieService.getRefreshTokenFromRequest(req);

    await this.authService.logout(userId, refreshToken);

    this.cookieService.clearRefreshTokenCookie(res);

    return { message: 'Successfully logged out the user' };
  }
}
