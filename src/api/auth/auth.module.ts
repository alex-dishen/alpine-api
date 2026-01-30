import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { UserModule } from 'src/api/user/user.module';
import { JobModule } from 'src/api/job/job.module';
import { AuthCookieService } from './auth-cookie.service';
import { OAuthStateService } from './oauth-state.service';
import { GoogleOAuthStrategy } from './strategies/google.strategy';
// import { LinkedInOAuthStrategy } from './strategies/linkedin.strategy';
// import { AppleOAuthStrategy } from './strategies/apple.strategy';
import { OAuthStrategyFactory } from './strategies/oauth-strategy.factory';

@Module({
  imports: [UserModule, JobModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    AuthCookieService,
    OAuthStateService,
    TokenService,
    GoogleOAuthStrategy,
    // LinkedInOAuthStrategy,
    // AppleOAuthStrategy,
    OAuthStrategyFactory,
  ],
})
export class AuthModule {}
