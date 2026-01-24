import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/shared/services/config-service/env-variables/env-schema';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] {
    return this.configService.getOrThrow(key, { infer: true });
  }

  set<K extends keyof EnvironmentVariables>(key: K, value: EnvironmentVariables[K]): void {
    this.configService.set(key, value);
  }
}
