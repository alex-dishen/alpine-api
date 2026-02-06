import type { JobStageCategory } from 'src/db/types/db.types';
import type { JobSortDto } from '../dto/application.dto';
import type { ColumnFilterDto } from '../dto/column-filter.dto';
import type { CursorPaginationInput } from 'src/shared/dtos/pagination.dto';

// Flat row type for job application with stage (from join)
export type JobApplicationWithStageRow = {
  id: string;
  user_id: string;
  stage_id: string;
  applied_at: Date;
  created_at: Date;
  updated_at: Date;
  job_title: string;
  archived_at: Date;
  company_name: string;
  notes: string | null;
  is_archived: boolean;
  salary_min: number | null;
  salary_max: number | null;
  job_description: string | null;
  // Joined stage fields
  stage_name: string;
  stage_color: string;
  stage_user_id: string;
  stage_position: number;
  stage_created_at: Date;
  stage_updated_at: Date;
  stage_category: JobStageCategory;
  // Joined custom column value (only present when sorting by custom column)
  custom_column_value?: string | null;
};

export type FindWithPaginationInput = {
  userId: string;
  search: string | undefined;
  sort: JobSortDto | undefined;
  isArchived: boolean | undefined;
  pagination: CursorPaginationInput;
  filters: ColumnFilterDto[] | undefined;
};

export type CountByFiltersInput = {
  userId: string;
  search: string | undefined;
  isArchived: boolean | undefined;
  filters: ColumnFilterDto[] | undefined;
};
