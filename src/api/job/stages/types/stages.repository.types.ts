import type { JobStageCategory } from 'src/db/types/db.types';

export type StageWithCountRow = {
  id: string;
  name: string;
  color: string;
  user_id: string;
  position: number;
  created_at: Date;
  updated_at: Date;
  job_count: number;
  category: JobStageCategory;
};
