import { google } from 'googleapis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UserProvider } from 'src/db/types/db.types';
import { AppConfigService } from 'src/shared/services/config-service/config.service';
import { IOAuthStrategy, OAuthUserData } from './oauth-strategy.interface';

@Injectable()
export class GoogleOAuthStrategy implements IOAuthStrategy {
  readonly provider = UserProvider.GOOGLE;

  constructor(private config: AppConfigService) {}

  async authenticate(code: string): Promise<OAuthUserData> {
    const oAuthClient = new OAuth2Client(
      this.config.get('GOOGLE_CLIENT_ID'),
      this.config.get('GOOGLE_CLIENT_SECRET'),
      'postmessage',
    );

    const { tokens } = await oAuthClient.getToken(code);
    oAuthClient.setCredentials(tokens);

    const googleService = google.oauth2({
      auth: oAuthClient,
      version: 'v2',
    });

    const { data: userData } = await googleService.userinfo.get();

    if (!userData.email) {
      throw new UnauthorizedException('Unable to retrieve email from Google');
    }

    return {
      email: userData.email,
      firstName: userData.given_name || '',
      lastName: userData.family_name || '',
      providerId: userData.id || '',
      provider: this.provider,
    };
  }
}
