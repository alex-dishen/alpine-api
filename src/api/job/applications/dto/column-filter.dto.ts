import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobColumnType } from 'src/db/types/db.types';

export enum FilterOperator {
  // Text operators
  Contains = 'contains',
  NotContains = 'not_contains',
  Equals = 'equals',
  NotEquals = 'not_equals',
  StartsWith = 'starts_with',
  EndsWith = 'ends_with',
  IsEmpty = 'is_empty',
  IsNotEmpty = 'is_not_empty',
  // Number/Date operators
  GreaterThan = 'gt',
  LessThan = 'lt',
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',
  Between = 'between',
  // Boolean
  IsTrue = 'is_true',
  IsFalse = 'is_false',
  // Select/MultiSelect
  IsAnyOf = 'is_any_of',
  IsNoneOf = 'is_none_of',
}

export class ColumnFilterDto {
  @IsString()
  column_id: string; // Can be core field name or custom column UUID

  @IsEnum(FilterOperator)
  operator: FilterOperator;

  @IsOptional()
  value?: string | number | boolean | string[];

  @IsOptional()
  @IsEnum(JobColumnType)
  column_type?: JobColumnType;
}
