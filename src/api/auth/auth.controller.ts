import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserProvider } from 'src/db/types/db.types';
import { SignUpDto, SingInDto } from './dto/auth.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { AuthCookieService } from './auth-cookie.service';
import { OAuthStateService } from './oauth-state.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { GoogleOAuthStrategy } from './strategies/google.strategy';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppConfigService } from 'src/shared/services/config-service/config.service';
import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: AppConfigService,
    private cookieService: AuthCookieService,
    private googleStrategy: GoogleOAuthStrategy,
    private oAuthStateService: OAuthStateService,
  ) {}

  @ApiOperation({ summary: 'Log in into the system' })
  @Post('/sign-in')
  async signIn(@Body() data: SingInDto, @Res({ passthrough: true }) res: Response): Promise<MessageDto> {
    const authResult = await this.authService.signIn(data);
    this.cookieService.setAuthCookies(res, authResult.access_token, authResult.refresh_token);

    return { message: 'Successfully signed in' };
  }

  @ApiOperation({ summary: 'Sign up for a new account' })
  @Post('/sign-up')
  async signUp(@Body() data: SignUpDto, @Res({ passthrough: true }) res: Response): Promise<MessageDto> {
    const authResult = await this.authService.signUp(data);
    this.cookieService.setAuthCookies(res, authResult.access_token, authResult.refresh_token);

    return { message: 'Successfully signed up' };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<MessageDto> {
    const accessToken = this.cookieService.getAccessTokenFromRequest(req);
    const refreshToken = this.cookieService.getRefreshTokenFromRequest(req);

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('JWT tokens are required for refresh');
    }

    const authResult = await this.authService.refreshAccessToken(accessToken, refreshToken);
    this.cookieService.setAuthCookies(res, authResult.access_token, authResult.refresh_token);

    return { message: 'Successfully refreshed tokens' };
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

    if (!refreshToken) {
      throw new UnauthorizedException('JWT tokens are required for refresh');
    }

    await this.authService.logout(userId, refreshToken);
    this.cookieService.clearAuthCookies(res);

    return { message: 'Successfully logged out' };
  }

  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @Get('/google')
  async initiateGoogleOAuth(@Res() res: Response): Promise<void> {
    const state = await this.oAuthStateService.generateState();
    const authUrl = this.googleStrategy.getAuthorizationUrl(state);

    res.redirect(authUrl);
  }

  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @Get('/callback/google')
  async handleGoogleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ): Promise<void> {
    const frontendUrl = this.config.get('FRONTEND_URL');

    if (error) {
      res.redirect(`${frontendUrl}/auth/error?error=${encodeURIComponent(error)}`);

      return;
    }

    try {
      await this.oAuthStateService.validateAndConsumeState(state);

      const authResult = await this.authService.signInWithOAuth({
        code,
        provider: UserProvider.GOOGLE,
      });

      this.cookieService.setAuthCookies(res, authResult.access_token, authResult.refresh_token);

      res.redirect(`${frontendUrl}/auth/callback`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      res.redirect(`${frontendUrl}/auth/error?error=${encodeURIComponent(errorMessage)}`);
    }
  }
}
