import type { InterviewOutcome } from 'src/db/types/db.types';

export type InterviewWithJobRow = {
  id: string;
  type: string;
  job_id: string;
  created_at: Date;
  updated_at: Date;
  job_title: string;
  scheduled_at: Date;
  notes: string | null;
  duration_mins: number;
  location: string | null;
  job_company_name: string;
  outcome: InterviewOutcome;
  meeting_url: string | null;
};
