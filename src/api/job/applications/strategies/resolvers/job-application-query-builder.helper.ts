import { sortStrategies, defaultSort } from '../job-application-sort.strategy';
import { coreFilterStrategies } from '../core-filter.strategy';
import { customFilterStrategies } from '../custom-filter.strategy';
import { isCoreFilterField } from '../helpers/filter.helpers';
import type { JobSortDto } from '../../dto/application.dto';
import type { ColumnFilterDto } from '../../dto/column-filter.dto';
import type { ExpressionBuilder, ExpressionWrapper, TableFieldReference } from './job-application-query-builder.types';
import type { CursorPaginationOptionsOrderBy } from 'src/shared/dtos/pagination.dto';
import type { JobApplicationWithStageRow } from '../../types/applications.repository.types';

type ApplyFiltersInput = {
  search: string | undefined;
  isArchived: boolean | undefined;
  filters: ColumnFilterDto[] | undefined;
};

export class JobApplicationQueryBuilder {
  static createOrderBy(
    sort: JobSortDto | undefined,
  ): CursorPaginationOptionsOrderBy<TableFieldReference, JobApplicationWithStageRow>[] {
    if (!sort) {
      return defaultSort;
    }

    const strategy = sortStrategies[sort.sort_by];

    return strategy ? strategy(sort.order) : defaultSort;
  }

  static applyFilters(eb: ExpressionBuilder, input: ApplyFiltersInput): ExpressionWrapper[] {
    const { search, isArchived, filters } = input;
    const expressions: ExpressionWrapper[] = [];

    // Apply is_archived filter (defaults to false)
    expressions.push(eb('ja.is_archived', '=', isArchived ?? false));

    // Apply search filter
    if (search) {
      expressions.push(eb.or([eb('ja.company_name', 'ilike', `%${search}%`), eb('ja.job_title', 'ilike', `%${search}%`)]));
    }

    // Apply column filters
    if (filters && filters.length > 0) {
      for (const filter of filters) {
        const expression = this.buildColumnFilterExpression(eb, filter);

        if (expression) {
          expressions.push(expression);
        }
      }
    }

    return expressions;
  }

  private static buildColumnFilterExpression(eb: ExpressionBuilder, filter: ColumnFilterDto): ExpressionWrapper | null {
    const { column_id, operator, value, column_type } = filter;

    // Handle core fields (field_key like 'company_name')
    if (isCoreFilterField(column_id)) {
      const field: TableFieldReference = `ja.${column_id}`;
      const strategy = coreFilterStrategies[operator];

      return strategy ? strategy(eb, field, value, column_type) : null;
    }

    // Handle custom columns (UUID) via subquery on job_column_values
    const strategy = customFilterStrategies[operator];

    return strategy ? strategy(eb, column_id, value, column_type) : null;
  }
}
