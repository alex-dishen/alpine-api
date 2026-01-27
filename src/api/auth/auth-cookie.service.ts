import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { parseDuration } from 'src/shared/utils/parse-duration/parse-duration';
import { AppConfigService } from 'src/shared/services/config-service/config.service';
import { NodeEnvironment } from 'src/shared/services/config-service/env-variables/env-schema';

@Injectable()
export class AuthCookieService {
  private readonly ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
  private readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

  constructor(private config: AppConfigService) {}

  private getCookieOptions(expiresIn: number) {
    const isLocal = this.config.get('NODE_ENV') === NodeEnvironment.Local;

    return {
      httpOnly: true,
      expires: new Date(Date.now() + expiresIn),
      signed: true,
      secure: !isLocal,
      sameSite: 'lax' as const,
    };
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const accessTokenExpiryMs = parseDuration(this.config.get('REFRESH_TOKEN_EXPIRY_TIME'), 'ms');
    const refreshTokenExpiresAt = parseDuration(this.config.get('REFRESH_TOKEN_EXPIRY_TIME'), 'ms');

    res.cookie(this.ACCESS_TOKEN_COOKIE_NAME, accessToken, this.getCookieOptions(accessTokenExpiryMs));
    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.getCookieOptions(refreshTokenExpiresAt));
  }

  getAccessTokenFromRequest(req: Request): string | undefined {
    return req.signedCookies[this.ACCESS_TOKEN_COOKIE_NAME];
  }

  getRefreshTokenFromRequest(req: Request): string | undefined {
    return req.signedCookies[this.REFRESH_TOKEN_COOKIE_NAME];
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie(this.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME);
  }
}
