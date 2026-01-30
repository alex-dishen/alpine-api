import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type { JobInterviewGetOutput, JobInterviewCreateInput, JobInterviewUpdateInput } from 'src/db/types/db.types';
import type { InterviewWithJobRow } from './types/interviews.repository.types';

@Injectable()
export class InterviewsRepository {
  constructor(private kysely: DatabaseService) {}

  async findByJobId(jobId: string): Promise<JobInterviewGetOutput[]> {
    return this.kysely.db
      .selectFrom('job_interviews')
      .where('job_id', '=', jobId)
      .selectAll()
      .orderBy('scheduled_at', 'asc')
      .execute();
  }

  async findById(id: string): Promise<JobInterviewGetOutput | undefined> {
    return this.kysely.db.selectFrom('job_interviews').where('id', '=', id).selectAll().executeTakeFirst();
  }

  async findByIdWithJob(id: string): Promise<InterviewWithJobRow | undefined> {
    return this.kysely.db
      .selectFrom('job_interviews as i')
      .innerJoin('job_applications as ja', 'ja.id', 'i.job_id')
      .where('i.id', '=', id)
      .select([
        'i.id',
        'i.job_id',
        'i.type',
        'i.scheduled_at',
        'i.duration_mins',
        'i.location',
        'i.meeting_url',
        'i.notes',
        'i.outcome',
        'i.created_at',
        'i.updated_at',
        'ja.company_name as job_company_name',
        'ja.job_title as job_title',
      ])
      .executeTakeFirst();
  }

  async findByUserForCalendar(userId: string, startDate: string, endDate: string): Promise<InterviewWithJobRow[]> {
    return this.kysely.db
      .selectFrom('job_interviews as i')
      .innerJoin('job_applications as ja', 'ja.id', 'i.job_id')
      .where('ja.user_id', '=', userId)
      .where('ja.is_archived', '=', false)
      .where('i.scheduled_at', '>=', new Date(startDate))
      .where('i.scheduled_at', '<=', new Date(endDate))
      .select([
        'i.id',
        'i.job_id',
        'i.type',
        'i.scheduled_at',
        'i.duration_mins',
        'i.location',
        'i.meeting_url',
        'i.notes',
        'i.outcome',
        'i.created_at',
        'i.updated_at',
        'ja.company_name as job_company_name',
        'ja.job_title as job_title',
      ])
      .orderBy('i.scheduled_at', 'asc')
      .execute();
  }

  async create(data: JobInterviewCreateInput): Promise<void> {
    await this.kysely.db.insertInto('job_interviews').values(data).execute();
  }

  async update(id: string, data: JobInterviewUpdateInput): Promise<void> {
    await this.kysely.db
      .updateTable('job_interviews')
      .set({ ...data, updated_at: new Date().toISOString() })
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_interviews').where('id', '=', id).execute();
  }

  async deleteByJobId(jobId: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_interviews').where('job_id', '=', jobId).execute();
  }
}
