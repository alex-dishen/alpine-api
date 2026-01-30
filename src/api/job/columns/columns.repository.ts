import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type {
  JobColumnDefinitionGetOutput,
  JobColumnDefinitionCreateInput,
  JobColumnDefinitionUpdateInput,
} from 'src/db/types/db.types';

@Injectable()
export class ColumnsRepository {
  constructor(private kysely: DatabaseService) {}

  async findByUserId(userId: string): Promise<JobColumnDefinitionGetOutput[]> {
    return this.kysely.db.selectFrom('job_column_definitions').where('user_id', '=', userId).selectAll().execute();
  }

  async findById(id: string): Promise<JobColumnDefinitionGetOutput | undefined> {
    return this.kysely.db.selectFrom('job_column_definitions').where('id', '=', id).selectAll().executeTakeFirst();
  }

  async findByName(name: string, userId: string): Promise<JobColumnDefinitionGetOutput | undefined> {
    return this.kysely.db
      .selectFrom('job_column_definitions')
      .where('name', '=', name)
      .where('user_id', '=', userId)
      .selectAll()
      .executeTakeFirst();
  }

  async create(data: JobColumnDefinitionCreateInput): Promise<void> {
    await this.kysely.db.insertInto('job_column_definitions').values(data).execute();
  }

  async update(id: string, data: JobColumnDefinitionUpdateInput): Promise<void> {
    await this.kysely.db
      .updateTable('job_column_definitions')
      .set({ ...data, updated_at: new Date().toISOString() })
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_column_definitions').where('id', '=', id).execute();
  }
}
