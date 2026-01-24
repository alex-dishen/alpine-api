// import * as jwt from 'jsonwebtoken';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UserProvider } from 'src/db/types/db.types';
// import { AppConfigService } from 'src/shared/services/config-service/config.service';
// import { IOAuthStrategy, OAuthUserData } from './oauth-strategy.interface';

// type AppleTokenResponse = {
//   access_token: string;
//   token_type: string;
//   expires_in: number;
//   refresh_token: string;
//   id_token: string;
// };

// type AppleIdTokenPayload = {
//   iss: string;
//   aud: string;
//   exp: number;
//   iat: number;
//   sub: string;
//   email?: string;
//   email_verified?: string;
// };

// @Injectable()
// export class AppleOAuthStrategy implements IOAuthStrategy {
//   readonly provider = UserProvider.APPLE;

//   constructor(private config: AppConfigService) {}

//   async authenticate(code: string): Promise<OAuthUserData> {
//     const tokenResponse = await this.exchangeCodeForToken(code);
//     const idTokenPayload = this.decodeIdToken(tokenResponse.id_token);

//     if (!idTokenPayload.email) {
//       throw new UnauthorizedException('Unable to retrieve email from Apple');
//     }

//     return {
//       email: idTokenPayload.email,
//       firstName: '',
//       lastName: '',
//       providerId: idTokenPayload.sub,
//       provider: this.provider,
//     };
//   }

//   private async exchangeCodeForToken(code: string): Promise<AppleTokenResponse> {
//     const clientSecret = this.generateClientSecret();

//     const params = new URLSearchParams({
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: this.config.get('APPLE_REDIRECT_URI'),
//       client_id: this.config.get('APPLE_CLIENT_ID'),
//       client_secret: clientSecret,
//     });

//     const response = await fetch('https://appleid.apple.com/auth/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params.toString(),
//     });

//     if (!response.ok) {
//       throw new UnauthorizedException('Failed to exchange Apple authorization code');
//     }

//     return response.json();
//   }

//   private generateClientSecret(): string {
//     const privateKey = this.config.get('APPLE_PRIVATE_KEY');
//     const keyId = this.config.get('APPLE_KEY_ID');
//     const teamId = this.config.get('APPLE_TEAM_ID');
//     const clientId = this.config.get('APPLE_CLIENT_ID');

//     const now = Math.floor(Date.now() / 1000);

//     const payload = {
//       iss: teamId,
//       iat: now,
//       exp: now + 15777000,
//       aud: 'https://appleid.apple.com',
//       sub: clientId,
//     };

//     return jwt.sign(payload, privateKey, {
//       algorithm: 'ES256',
//       header: {
//         alg: 'ES256',
//         kid: keyId,
//       },
//     });
//   }

//   private decodeIdToken(idToken: string): AppleIdTokenPayload {
//     const decoded = jwt.decode(idToken) as AppleIdTokenPayload;

//     if (!decoded) {
//       throw new UnauthorizedException('Invalid Apple ID token');
//     }

//     return decoded;
//   }
// }
