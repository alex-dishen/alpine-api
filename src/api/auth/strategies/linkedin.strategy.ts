// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UserProvider } from 'src/db/types/db.types';
// import { AppConfigService } from 'src/shared/services/config-service/config.service';
// import { IOAuthStrategy, OAuthUserData } from './oauth-strategy.interface';

// type LinkedInTokenResponse = {
//   access_token: string;
//   expires_in: number;
// };

// type LinkedInUserInfo = {
//   sub: string;
//   email: string;
//   given_name: string;
//   family_name: string;
//   picture?: string;
// };

// @Injectable()
// export class LinkedInOAuthStrategy implements IOAuthStrategy {
//   readonly provider = UserProvider.LINKEDIN;

//   constructor(private config: AppConfigService) {}

//   async authenticate(code: string): Promise<OAuthUserData> {
//     const tokenResponse = await this.exchangeCodeForToken(code);
//     const userInfo = await this.getUserInfo(tokenResponse.access_token);

//     if (!userInfo.email) {
//       throw new UnauthorizedException('Unable to retrieve email from LinkedIn');
//     }

//     return {
//       email: userInfo.email,
//       firstName: userInfo.given_name || '',
//       lastName: userInfo.family_name || '',
//       providerId: userInfo.sub,
//       provider: this.provider,
//     };
//   }

//   private async exchangeCodeForToken(code: string): Promise<LinkedInTokenResponse> {
//     const params = new URLSearchParams({
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: this.config.get('LINKEDIN_REDIRECT_URI'),
//       client_id: this.config.get('LINKEDIN_CLIENT_ID'),
//       client_secret: this.config.get('LINKEDIN_CLIENT_SECRET'),
//     });

//     const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params.toString(),
//     });

//     if (!response.ok) {
//       throw new UnauthorizedException('Failed to exchange LinkedIn authorization code');
//     }

//     return response.json();
//   }

//   private async getUserInfo(accessToken: string): Promise<LinkedInUserInfo> {
//     const response = await fetch('https://api.linkedin.com/v2/userinfo', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new UnauthorizedException('Failed to fetch LinkedIn user info');
//     }

//     return response.json();
//   }
// }
