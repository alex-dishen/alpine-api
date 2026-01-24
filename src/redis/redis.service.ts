import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AppConfigService } from 'src/shared/services/config-service/config.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private config: AppConfigService) {}

  onModuleInit(): void {
    // ! family=0 is needed for railway hosting provider to use both IPv4 and IPv6 addresses
    // https://docs.railway.com/reference/errors/enotfound-redis-railway-internal
    this.client = new Redis({
      family: 0,
      host: this.config.get('REDISHOST'),
      port: this.config.get('REDISPORT'),
      password: this.config.get('REDISPASSWORD'),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  async set(key: string, value: string, expiresInSeconds: number): Promise<void> {
    await this.client.set(key, value, 'EX', expiresInSeconds);
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
