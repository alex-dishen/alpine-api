import type { InterviewWithJobResponseDto } from '../dto/interview.dto';
import type { InterviewWithJobRow } from '../types/interviews.repository.types';

export class InterviewsMapper {
  static toInterviewWithJob(rows: InterviewWithJobRow[]): InterviewWithJobResponseDto[] {
    return rows.map(row => ({
      id: row.id,
      job_id: row.job_id,
      type: row.type,
      scheduled_at: row.scheduled_at,
      duration_mins: row.duration_mins,
      location: row.location,
      meeting_url: row.meeting_url,
      notes: row.notes,
      outcome: row.outcome,
      created_at: row.created_at,
      updated_at: row.updated_at,
      job: {
        id: row.job_id,
        company_name: row.job_company_name,
        job_title: row.job_title,
      },
    }));
  }
}
