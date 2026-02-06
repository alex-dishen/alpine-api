import type { JobColumnType } from 'src/db/types/db.types';
import type { ExpressionBuilder, ExpressionWrapper, TableFieldReference } from '../resolvers/job-application-query-builder.types';

export type FilterValue = string | number | boolean | string[] | undefined;

export type CoreFilterStrategy = (
  eb: ExpressionBuilder,
  field: TableFieldReference,
  value: FilterValue,
  columnType?: JobColumnType,
) => ExpressionWrapper | null;

export type CustomFilterStrategy = (
  eb: ExpressionBuilder,
  columnId: string,
  value: FilterValue,
  columnType?: JobColumnType,
) => ExpressionWrapper | null;

// ============================================================================
// Type Guards
// ============================================================================

export const isString = (value: FilterValue): value is string => typeof value === 'string';

export const isNumber = (value: FilterValue): value is number => typeof value === 'number';

export const isBoolean = (value: FilterValue): value is boolean => typeof value === 'boolean';

export const isStringArray = (value: FilterValue): value is string[] =>
  Array.isArray(value) && value.every(v => typeof v === 'string');

export const isStringOrNumber = (value: FilterValue): value is string | number => isString(value) || isNumber(value);

export const isStringOrBoolean = (value: FilterValue): value is string | boolean => isString(value) || isBoolean(value);

export const isPrimitive = (value: FilterValue): value is string | number | boolean =>
  isString(value) || isNumber(value) || isBoolean(value);
