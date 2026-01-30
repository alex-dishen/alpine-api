import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type { JobStageGetOutput, JobStageCreateInput, JobStageUpdateInput } from 'src/db/types/db.types';
import type { StageWithCountRow } from './types/stages.repository.types';

@Injectable()
export class StagesRepository {
  constructor(private kysely: DatabaseService) {}

  async findByUserId(userId: string): Promise<StageWithCountRow[]> {
    return this.kysely.db
      .selectFrom('job_stages as s')
      .leftJoin('job_applications as ja', join => join.onRef('ja.stage_id', '=', 's.id').on('ja.is_archived', '=', false))
      .where('s.user_id', '=', userId)
      .groupBy('s.id')
      .select(['s.id', 's.user_id', 's.name', 's.color', 's.category', 's.position', 's.created_at', 's.updated_at'])
      .select(eb => eb.fn.count<number>('ja.id').as('job_count'))
      .orderBy('s.category', 'asc')
      .orderBy('s.position', 'asc')
      .execute();
  }

  async findById(id: string): Promise<JobStageGetOutput | undefined> {
    return this.kysely.db.selectFrom('job_stages').where('id', '=', id).selectAll().executeTakeFirst();
  }

  async findByName(name: string, userId: string): Promise<JobStageGetOutput | undefined> {
    return this.kysely.db
      .selectFrom('job_stages')
      .where('name', '=', name)
      .where('user_id', '=', userId)
      .selectAll()
      .executeTakeFirst();
  }

  async create(data: JobStageCreateInput | JobStageCreateInput[]): Promise<void> {
    if (Array.isArray(data) && data.length === 0) return;

    await this.kysely.db.insertInto('job_stages').values(data).execute();
  }

  async update(id: string, data: JobStageUpdateInput): Promise<void> {
    await this.kysely.db
      .updateTable('job_stages')
      .set({ ...data, updated_at: new Date().toISOString() })
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_stages').where('id', '=', id).execute();
  }

  async hasApplications(stageId: string): Promise<boolean> {
    const result = await this.kysely.db
      .selectFrom('job_applications')
      .where('stage_id', '=', stageId)
      .select(eb => eb.fn.count<number>('id').as('count'))
      .executeTakeFirst();

    return Number(result?.count ?? 0) > 0;
  }

  async findStagesByUserId(userId: string): Promise<JobStageGetOutput[]> {
    return this.kysely.db
      .selectFrom('job_stages')
      .where('user_id', '=', userId)
      .selectAll()
      .orderBy('category', 'asc')
      .orderBy('position', 'asc')
      .execute();
  }
}
