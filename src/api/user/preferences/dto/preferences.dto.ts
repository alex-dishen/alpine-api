import { IsObject } from 'class-validator';

export class UserPreferencesDto {
  preferences: Record<string, unknown>;
}

export class UpdatePreferencesDto {
  @IsObject()
  preferences: Record<string, unknown>;
}
