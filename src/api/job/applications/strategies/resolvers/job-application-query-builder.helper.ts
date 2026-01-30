import type { JobApplicationFilterEnum } from '../../registry/job-application-filter.enum';
import { jobApplicationFilterHandler } from '../job-application-filter.strategy';
import { sortStrategies, defaultSort } from '../job-application-sort.strategy';
import type { JobFiltersBaseDto, JobSortDto } from '../../dto/application.dto';
import type { ExpressionBuilder, ExpressionWrapper, TableFieldReference } from './job-application-query-builder.types';
import type { CursorPaginationOptionsOrderBy } from 'src/shared/dtos/pagination.dto';
import type { JobApplicationWithStageRow } from '../../types/applications.repository.types';

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
}
