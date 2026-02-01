import type { JobApplicationTable } from 'src/db/types/db.types';
import { JobColumnType } from 'src/db/types/db.types';
import type { JobColumnWithOptionsResponseDto } from '../dto/column.dto';

type JobFieldKey = keyof JobApplicationTable;

export const STAGE_COLUMN_ID = 'system-stage-id';

export const CORE_COLUMNS: JobColumnWithOptionsResponseDto[] = [
  {
    id: 'system-company-name',
    name: 'Company',
    column_type: JobColumnType.TEXT,
    options: [],
    is_core: true,
    field_key: 'company_name' satisfies JobFieldKey,
  },
  {
    id: 'system-job-title',
    name: 'Position',
    column_type: JobColumnType.TEXT,
    options: [],
    is_core: true,
    field_key: 'job_title' satisfies JobFieldKey,
  },
  {
    id: STAGE_COLUMN_ID,
    name: 'Stage',
    column_type: JobColumnType.SELECT,
    options: [], // Options are provided by /api/jobs/stages endpoint
    is_core: true,
    field_key: 'stage_id' satisfies JobFieldKey,
  },
  {
    id: 'system-applied-at',
    name: 'Applied',
    column_type: JobColumnType.DATE,
    options: [],
    is_core: true,
    field_key: 'applied_at' satisfies JobFieldKey,
  },
  {
    id: 'system-salary-min',
    name: 'Salary Min',
    column_type: JobColumnType.NUMBER,
    options: [],
    is_core: true,
    field_key: 'salary_min' satisfies JobFieldKey,
  },
  {
    id: 'system-salary-max',
    name: 'Salary Max',
    column_type: JobColumnType.NUMBER,
    options: [],
    is_core: true,
    field_key: 'salary_max' satisfies JobFieldKey,
  },
];
