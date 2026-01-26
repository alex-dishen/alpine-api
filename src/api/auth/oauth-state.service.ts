import { randomBytes } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class OAuthStateService {
  private readonly STATE_PREFIX = 'oauth:state:';
  private readonly STATE_TTL_SECONDS = 300; // 5 minutes

  constructor(private redisService: RedisService) {}

  private getStateKey(state: string): string {
    return `${this.STATE_PREFIX}${state}`;
  }

  async generateState(): Promise<string> {
    const state = randomBytes(32).toString('hex');
    const key = this.getStateKey(state);

    await this.redisService.set(key, '1', this.STATE_TTL_SECONDS);

    return state;
  }

  async validateAndConsumeState(state: string): Promise<void> {
    const key = this.getStateKey(state);
    const exists = await this.redisService.get(key);

    if (!exists) {
      throw new UnauthorizedException('Invalid or expired OAuth state');
    }

    await this.redisService.del(key);
  }
}
