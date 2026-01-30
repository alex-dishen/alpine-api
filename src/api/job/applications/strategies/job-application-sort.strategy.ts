import type { SortOrderEnum } from 'src/shared/enums/sort-order';
import { JobApplicationSortByEnum } from '../registry/job-application-sort.enum';
import type { CursorPaginationOptionsOrderBy } from 'src/shared/dtos/pagination.dto';
import type { TableFieldReference } from './resolvers/job-application-query-builder.types';
import type { JobApplicationWithStageRow } from '../types/applications.repository.types';

type SortStrategy = (order: SortOrderEnum) => CursorPaginationOptionsOrderBy<TableFieldReference, JobApplicationWithStageRow>[];

export const sortStrategies: Record<JobApplicationSortByEnum, SortStrategy> = {
  [JobApplicationSortByEnum.Category]: order => [
    { column: 'js.category', selectColumn: 'stage_category', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  [JobApplicationSortByEnum.Stage]: order => [
    { column: 'js.position', selectColumn: 'stage_position', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  [JobApplicationSortByEnum.IsArchived]: order => [
    { column: 'ja.is_archived', selectColumn: 'is_archived', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],
};

export const defaultSort: CursorPaginationOptionsOrderBy<TableFieldReference, JobApplicationWithStageRow>[] = [
  { column: 'ja.created_at', selectColumn: 'created_at', direction: 'desc' },
  { column: 'ja.id', selectColumn: 'id', direction: 'desc' },
];
