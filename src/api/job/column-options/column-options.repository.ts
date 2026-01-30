import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type { JobColumnOptionGetOutput, JobColumnOptionCreateInput, JobColumnOptionUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class ColumnOptionsRepository {
  constructor(private kysely: DatabaseService) {}

  async findByColumnIds(columnIds: string[]): Promise<JobColumnOptionGetOutput[]> {
    if (columnIds.length === 0) return [];

    return this.kysely.db
      .selectFrom('job_column_options')
      .where('column_id', 'in', columnIds)
      .selectAll()
      .orderBy('position', 'asc')
      .execute();
  }

  async findById(id: string): Promise<JobColumnOptionGetOutput | undefined> {
    return this.kysely.db.selectFrom('job_column_options').where('id', '=', id).selectAll().executeTakeFirst();
  }

  async findByLabel(columnId: string, label: string): Promise<JobColumnOptionGetOutput | undefined> {
    return this.kysely.db
      .selectFrom('job_column_options')
      .where('column_id', '=', columnId)
      .where('label', '=', label)
      .selectAll()
      .executeTakeFirst();
  }

  async create(data: JobColumnOptionCreateInput): Promise<void> {
    await this.kysely.db.insertInto('job_column_options').values(data).execute();
  }

  async update(id: string, data: JobColumnOptionUpdateInput): Promise<void> {
    await this.kysely.db
      .updateTable('job_column_options')
      .set({ ...data, updated_at: new Date().toISOString() })
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_column_options').where('id', '=', id).execute();
  }

  async deleteByColumnId(columnId: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_column_options').where('column_id', '=', columnId).execute();
  }
}
