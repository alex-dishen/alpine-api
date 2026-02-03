import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// Theme type
export type Theme = 'light' | 'dark' | 'system';

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Filter operator enum (matches column-filter.dto.ts)
export enum PreferencesFilterOperator {
  Contains = 'contains',
  NotContains = 'not_contains',
  Equals = 'equals',
  NotEquals = 'not_equals',
  StartsWith = 'starts_with',
  EndsWith = 'ends_with',
  IsEmpty = 'is_empty',
  IsNotEmpty = 'is_not_empty',
  GreaterThan = 'gt',
  LessThan = 'lt',
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',
  Between = 'between',
  IsTrue = 'is_true',
  IsFalse = 'is_false',
  IsAnyOf = 'is_any_of',
  IsNoneOf = 'is_none_of',
}

// Column filter for preferences
export class PreferencesColumnFilterDto {
  @ApiProperty({ description: 'Column ID (core field name or custom column UUID)' })
  @IsString()
  columnId: string;

  @ApiProperty({ enum: PreferencesFilterOperator })
  @IsEnum(PreferencesFilterOperator)
  operator: PreferencesFilterOperator;

  @ApiPropertyOptional({ description: 'Filter value' })
  @IsOptional()
  value?: string | number | boolean | string[];
}

// Sort for preferences
export class PreferencesSortDto {
  @ApiProperty({ description: 'Column ID to sort by' })
  @IsString()
  columnId: string;

  @ApiProperty({ enum: ['asc', 'desc'] })
  @IsEnum(['asc', 'desc'])
  direction: SortDirection;
}

// Jobs page preferences
export class JobsPreferencesDto {
  @ApiPropertyOptional({ description: 'Global search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ type: [PreferencesColumnFilterDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreferencesColumnFilterDto)
  columnFilters?: PreferencesColumnFilterDto[];

  @ApiPropertyOptional({ type: [PreferencesSortDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreferencesSortDto)
  sorts?: PreferencesSortDto[];
}

// Main preferences data structure
export class PreferencesDataDto {
  @ApiPropertyOptional({ enum: ['light', 'dark', 'system'] })
  @IsOptional()
  @IsEnum(['light', 'dark', 'system'])
  theme?: Theme;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sidebarOpen?: boolean;

  @ApiPropertyOptional({ type: JobsPreferencesDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => JobsPreferencesDto)
  jobs?: JobsPreferencesDto;
}

// Response DTO
export class UserPreferencesDto {
  @ApiProperty({ type: PreferencesDataDto })
  preferences: PreferencesDataDto;
}

// Update DTO
export class UpdatePreferencesDto {
  @ApiProperty({ type: PreferencesDataDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PreferencesDataDto)
  preferences: PreferencesDataDto;
}
