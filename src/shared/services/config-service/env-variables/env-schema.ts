import { IsEnum, IsNumber, IsString, IsNotEmpty, Max, Min, Matches } from 'class-validator';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvironmentVariables {}
  }
}

export enum NodeEnvironment {
  Local = 'local',
  Staging = 'stage',
  Development = 'dev',
  Production = 'prod',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  GEMINI_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^https?:\/\/[^,\s]+(,\s*https?:\/\/[^,\s]+)*$/, {
    message: 'CORS_ORIGIN must be a valid URL or comma-separated URLs starting with http:// or https://',
  })
  CORS_ORIGIN: string;

  @IsString()
  @IsNotEmpty()
  COOKIE_SECRET: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+[smhd]$/, {
    message: 'ACCESS_TOKEN_EXPIRY_TIME must be in format like "1h", "30m", "7d"',
  })
  ACCESS_TOKEN_EXPIRY_TIME: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+[smhd]$/, {
    message: 'REFRESH_TOKEN_EXPIRY_TIME must be in format like "10d", "7d", "24h"',
  })
  REFRESH_TOKEN_EXPIRY_TIME: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  REDISHOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  REDISPORT: number;

  @IsString()
  @IsNotEmpty()
  REDISPASSWORD: string;

  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  AWS_S3_BUCKET: string;
}
