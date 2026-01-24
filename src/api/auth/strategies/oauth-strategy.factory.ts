import { Injectable, BadRequestException } from '@nestjs/common';
import { UserProvider } from 'src/db/types/db.types';
import { IOAuthStrategy } from './oauth-strategy.interface';
import { GoogleOAuthStrategy } from './google.strategy';
// import { LinkedInOAuthStrategy } from './linkedin.strategy';
// import { AppleOAuthStrategy } from './apple.strategy';

@Injectable()
export class OAuthStrategyFactory {
  private strategies: Record<UserProvider, IOAuthStrategy>;

  constructor(
    private googleStrategy: GoogleOAuthStrategy,
    // private linkedInStrategy: LinkedInOAuthStrategy,
    // private appleStrategy: AppleOAuthStrategy,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.strategies = {
      [UserProvider.GOOGLE]: this.googleStrategy,
      // [UserProvider.LINKEDIN]: this.linkedInStrategy,
      // [UserProvider.APPLE]: this.appleStrategy,
    };
  }

  getStrategy(provider: UserProvider): IOAuthStrategy {
    const strategy = this.strategies[provider];

    if (!strategy) {
      throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
    }

    return strategy;
  }
}
