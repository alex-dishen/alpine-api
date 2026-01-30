import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { LLMModule } from 'src/llm/llm.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/db/db.module';
import { RedisModule } from 'src/redis/redis.module';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserModule } from 'src/api/user/user.module';
import { JobModule } from 'src/api/job/job.module';
import { AppConfigModule } from 'src/shared/services/config-service/config.module';
import { validateEnv } from 'src/shared/services/config-service/env-variables/validate-env';
import { AwsModule } from './shared/services/aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv, cache: true }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDISHOST,
        port: Number(process.env.REDISPORT),
        password: process.env.REDISPASSWORD,
      },
    }),
    AwsModule,
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    JobModule,
    LLMModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
