import type { JobApplicationFilterEnum } from '../../registry/job-application-filter.enum';
import { jobApplicationFilterHandler } from '../job-application-filter.strategy';
import { sortStrategies, defaultSort } from '../job-application-sort.strategy';
import type { JobFiltersBaseDto, JobSortDto } from '../../dto/application.dto';
import { type ColumnFilterDto, FilterOperator, ColumnType } from '../../dto/column-filter.dto';
import type { ExpressionBuilder, ExpressionWrapper, TableFieldReference } from './job-application-query-builder.types';
import type { CursorPaginationOptionsOrderBy } from 'src/shared/dtos/pagination.dto';
import type { JobApplicationWithStageRow } from '../../types/applications.repository.types';

// Core fields that can be filtered directly on the job_application table
const CORE_FIELDS = new Set([
  'company_name',
  'job_title',
  'stage_id',
  'salary_min',
  'salary_max',
  'job_description',
  'notes',
  'applied_at',
  'is_archived',
  'created_at',
  'updated_at',
]);

export class JobApplicationQueryBuilder {
  static applyFilters(eb: ExpressionBuilder, filters: JobFiltersBaseDto | undefined): ExpressionWrapper[] {
    if (!filters) {
      return [];
    }

    const expressions: ExpressionWrapper[] = [];

    // Default is_archived to false if not specified
    if (filters.is_archived === undefined) {
      expressions.push(eb('ja.is_archived', '=', false));
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined) continue;

      const handler = jobApplicationFilterHandler[key as JobApplicationFilterEnum];

      if (handler) {
        const result = handler(eb, value);

        if (result) {
          expressions.push(result);
        }
      }
    }

    return expressions;
  }

  static createOrderBy(
    sort: JobSortDto | undefined,
  ): CursorPaginationOptionsOrderBy<TableFieldReference, JobApplicationWithStageRow>[] {
    if (!sort) {
      return defaultSort;
    }

    const strategy = sortStrategies[sort.sort_by];

    return strategy ? strategy(sort.order) : defaultSort;
  }

  static applyColumnFilters(eb: ExpressionBuilder, columnFilters: ColumnFilterDto[] | undefined): ExpressionWrapper[] {
    if (!columnFilters || columnFilters.length === 0) {
      return [];
    }

    const expressions: ExpressionWrapper[] = [];

    for (const filter of columnFilters) {
      const expression = this.buildColumnFilterExpression(eb, filter);

      if (expression) {
        expressions.push(expression);
      }
    }

    return expressions;
  }

  private static buildColumnFilterExpression(eb: ExpressionBuilder, filter: ColumnFilterDto): ExpressionWrapper | null {
    const { column_id, operator, value, column_type } = filter;

    // Handle core fields (field_key like 'company_name')
    if (CORE_FIELDS.has(column_id)) {
      return this.buildCoreFieldExpression(eb, column_id, operator, value, column_type);
    }

    // Handle custom columns (UUID) via subquery on job_column_values
    return this.buildCustomColumnExpression(eb, column_id, operator, value, column_type);
  }

  private static buildCustomColumnExpression(
    eb: ExpressionBuilder,
    columnId: string,
    operator: FilterOperator,
    value: string | number | boolean | string[] | undefined,
    columnType?: ColumnType,
  ): ExpressionWrapper | null {
    const isSelectType = columnType === ColumnType.Select || columnType === ColumnType.MultiSelect;
    // Build subquery to check job_column_values
    // For select columns: filter by option_id
    // For text columns: filter by value

    switch (operator) {
      // Select/MultiSelect - filter by option_id
      case FilterOperator.IsAnyOf:
        if (Array.isArray(value) && value.length > 0) {
          return eb.exists(
            eb
              .selectFrom('job_column_values as jcv')
              .select('jcv.id')
              .whereRef('jcv.job_id', '=', 'ja.id')
              .where('jcv.column_id', '=', columnId)
              .where('jcv.option_id', 'in', value),
          );
        }

        return null;

      case FilterOperator.IsNoneOf:
        if (Array.isArray(value) && value.length > 0) {
          return eb.not(
            eb.exists(
              eb
                .selectFrom('job_column_values as jcv')
                .select('jcv.id')
                .whereRef('jcv.job_id', '=', 'ja.id')
                .where('jcv.column_id', '=', columnId)
                .where('jcv.option_id', 'in', value),
            ),
          );
        }

        return null;

      // Text operators - filter by value column
      case FilterOperator.Contains:
        return eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId)
            .where('jcv.value', 'ilike', `%${value}%`),
        );

      case FilterOperator.NotContains:
        return eb.or([
          // Either no value exists for this column
          eb.not(
            eb.exists(
              eb
                .selectFrom('job_column_values as jcv')
                .select('jcv.id')
                .whereRef('jcv.job_id', '=', 'ja.id')
                .where('jcv.column_id', '=', columnId),
            ),
          ),
          // Or value doesn't contain the search term
          eb.exists(
            eb
              .selectFrom('job_column_values as jcv')
              .select('jcv.id')
              .whereRef('jcv.job_id', '=', 'ja.id')
              .where('jcv.column_id', '=', columnId)
              .where('jcv.value', 'not ilike', `%${value}%`),
          ),
        ]);

      case FilterOperator.StartsWith:
        return eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId)
            .where('jcv.value', 'ilike', `${value}%`),
        );

      case FilterOperator.EndsWith:
        return eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId)
            .where('jcv.value', 'ilike', `%${value}`),
        );

      case FilterOperator.Equals: {
        // Convert boolean to string for checkbox columns (stored as 'true'/'false')
        const compareValue = typeof value === 'boolean' ? String(value) : (value as string);

        return eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId)
            .where('jcv.value', '=', compareValue),
        );
      }

      case FilterOperator.NotEquals: {
        // Convert boolean to string for checkbox columns (stored as 'true'/'false')
        const compareValue = typeof value === 'boolean' ? String(value) : (value as string);

        return eb.or([
          eb.not(
            eb.exists(
              eb
                .selectFrom('job_column_values as jcv')
                .select('jcv.id')
                .whereRef('jcv.job_id', '=', 'ja.id')
                .where('jcv.column_id', '=', columnId),
            ),
          ),
          eb.exists(
            eb
              .selectFrom('job_column_values as jcv')
              .select('jcv.id')
              .whereRef('jcv.job_id', '=', 'ja.id')
              .where('jcv.column_id', '=', columnId)
              .where('jcv.value', '!=', compareValue),
          ),
        ]);
      }

      case FilterOperator.IsEmpty:
        // For select/multi-select: check if no option_id exists
        // For other types: check if no value exists OR value is null/empty
        if (isSelectType) {
          return eb.not(
            eb.exists(
              eb
                .selectFrom('job_column_values as jcv')
                .select('jcv.id')
                .whereRef('jcv.job_id', '=', 'ja.id')
                .where('jcv.column_id', '=', columnId)
                .where('jcv.option_id', 'is not', null),
            ),
          );
        }

        return eb.or([
          eb.not(
            eb.exists(
              eb
                .selectFrom('job_column_values as jcv')
                .select('jcv.id')
                .whereRef('jcv.job_id', '=', 'ja.id')
                .where('jcv.column_id', '=', columnId),
            ),
          ),
          eb.exists(
            eb
              .selectFrom('job_column_values as jcv')
              .select('jcv.id')
              .whereRef('jcv.job_id', '=', 'ja.id')
              .where('jcv.column_id', '=', columnId)
              .where(innerEb => innerEb.or([innerEb('jcv.value', 'is', null), innerEb('jcv.value', '=', '')])),
          ),
        ]);

      case FilterOperator.IsNotEmpty:
        // For select/multi-select: check if at least one option_id exists
        // For other types: check if value exists and is not empty
        if (isSelectType) {
          return eb.exists(
            eb
              .selectFrom('job_column_values as jcv')
              .select('jcv.id')
              .whereRef('jcv.job_id', '=', 'ja.id')
              .where('jcv.column_id', '=', columnId)
              .where('jcv.option_id', 'is not', null),
          );
        }

        return eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId)
            .where('jcv.value', 'is not', null)
            .where('jcv.value', '!=', ''),
        );

      default:
        return null;
    }
  }

  private static buildCoreFieldExpression(
    eb: ExpressionBuilder,
    fieldName: string,
    operator: FilterOperator,
    value: string | number | boolean | string[] | undefined,
    columnType?: ColumnType,
  ): ExpressionWrapper | null {
    // Cast to TableFieldReference since we've validated fieldName is in CORE_FIELDS
    const field = `ja.${fieldName}` as TableFieldReference;

    const isSelectType = columnType === ColumnType.Select || columnType === ColumnType.MultiSelect;
    const isDateType = columnType === ColumnType.Date;
    const isNumberType = columnType === ColumnType.Number;
    // Types that can only be NULL, not empty string (UUIDs, timestamps, integers, etc.)
    const isNullOnlyType = isSelectType || isDateType || isNumberType;

    switch (operator) {
      // Text operators
      case FilterOperator.Contains:
        return eb(field, 'ilike', `%${value}%`);

      case FilterOperator.NotContains:
        // Include NULL values since they also "don't contain" the search term
        return eb.or([eb(field, 'not ilike', `%${value}%`), eb(field, 'is', null)]);

      case FilterOperator.Equals:
        return eb(field, '=', value as string | number | boolean);

      case FilterOperator.NotEquals:
        // Include NULL values since they are also "not equal" to the provided value
        return eb.or([eb(field, '!=', value as string | number | boolean), eb(field, 'is', null)]);

      case FilterOperator.StartsWith:
        return eb(field, 'ilike', `${value}%`);

      case FilterOperator.EndsWith:
        return eb(field, 'ilike', `%${value}`);

      case FilterOperator.IsEmpty:
        // Select/Date fields can only be NULL, not empty string
        if (isNullOnlyType) {
          return eb(field, 'is', null);
        }

        return eb.or([eb(field, 'is', null), eb(field, '=', '')]);

      case FilterOperator.IsNotEmpty:
        // Select/Date fields can only be NULL, not empty string
        if (isNullOnlyType) {
          return eb(field, 'is not', null);
        }

        return eb.and([eb(field, 'is not', null), eb(field, '!=', '')]);

      // Number/Date operators
      case FilterOperator.GreaterThan:
        return eb(field, '>', value as number);

      case FilterOperator.LessThan:
        return eb(field, '<', value as number);

      case FilterOperator.GreaterThanOrEqual:
        return eb(field, '>=', value as number);

      case FilterOperator.LessThanOrEqual:
        return eb(field, '<=', value as number);

      case FilterOperator.Between:
        if (Array.isArray(value) && value.length === 2) {
          return eb.and([eb(field, '>=', value[0]), eb(field, '<=', value[1])]);
        }

        return null;

      // Boolean operators
      case FilterOperator.IsTrue:
        return eb(field, '=', true);

      case FilterOperator.IsFalse:
        return eb(field, '=', false);

      // Select/MultiSelect operators
      case FilterOperator.IsAnyOf:
        if (Array.isArray(value) && value.length > 0) {
          return eb(field, 'in', value);
        }

        return null;

      case FilterOperator.IsNoneOf:
        if (Array.isArray(value) && value.length > 0) {
          // Include NULL values since they are also "none of" the provided values
          return eb.or([eb(field, 'not in', value), eb(field, 'is', null)]);
        }

        return null;

      default:
        return null;
    }
  }
}
