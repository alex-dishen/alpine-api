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

  [JobApplicationSortByEnum.CompanyName]: order => [
    { column: 'ja.company_name', selectColumn: 'company_name', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  [JobApplicationSortByEnum.JobTitle]: order => [
    { column: 'ja.job_title', selectColumn: 'job_title', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  [JobApplicationSortByEnum.AppliedAt]: order => [
    { column: 'ja.applied_at', selectColumn: 'applied_at', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  [JobApplicationSortByEnum.SalaryMin]: order => [
    { column: 'ja.salary_min', selectColumn: 'salary_min', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  [JobApplicationSortByEnum.SalaryMax]: order => [
    { column: 'ja.salary_max', selectColumn: 'salary_max', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  [JobApplicationSortByEnum.CreatedAt]: order => [
    { column: 'ja.created_at', selectColumn: 'created_at', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],

  // Custom column sorting requires special repository handling (LEFT JOIN job_column_values)
  // For now, fall back to created_at sort. Full implementation requires repository changes.
  [JobApplicationSortByEnum.CustomColumn]: order => [
    { column: 'ja.created_at', selectColumn: 'created_at', direction: order },
    { column: 'ja.id', selectColumn: 'id', direction: 'asc' },
  ],
};

export const defaultSort: CursorPaginationOptionsOrderBy<TableFieldReference, JobApplicationWithStageRow>[] = [
  { column: 'ja.created_at', selectColumn: 'created_at', direction: 'desc' },
  { column: 'ja.id', selectColumn: 'id', direction: 'desc' },
];
