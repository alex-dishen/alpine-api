import type { JobApplicationTable } from 'src/db/types/db.types';
import { JobColumnType } from 'src/db/types/db.types';

// Core fields that can be filtered directly on the job_applications table
const CORE_FILTER_FIELDS = new Set<keyof JobApplicationTable>([
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

export const isCoreFilterField = (field: string): field is keyof JobApplicationTable => {
  return CORE_FILTER_FIELDS.has(field as keyof JobApplicationTable);
};

export const isNullOnlyType = (columnType?: JobColumnType): boolean => {
  return (
    columnType === JobColumnType.SELECT ||
    columnType === JobColumnType.MULTI_SELECT ||
    columnType === JobColumnType.DATE ||
    columnType === JobColumnType.NUMBER
  );
};

export const isSelectType = (columnType?: JobColumnType): boolean => {
  return columnType === JobColumnType.SELECT || columnType === JobColumnType.MULTI_SELECT;
};
