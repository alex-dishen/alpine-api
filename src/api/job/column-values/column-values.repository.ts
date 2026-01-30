import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type { JobColumnValueCreateInput } from 'src/db/types/db.types';
import { ColumnValueWithOptionRow } from './types/column-values.repository.types';

@Injectable()
export class ColumnValuesRepository {
  constructor(private kysely: DatabaseService) {}

  async findColumnValuesByJobId(jobId: string): Promise<ColumnValueWithOptionRow[]> {
    return this.kysely.db
      .selectFrom('job_column_values as jcv')
      .leftJoin('job_column_options as jco', 'jco.id', 'jcv.option_id')
      .where('jcv.job_id', '=', jobId)
      .select([
        'jcv.id',
        'jcv.job_id',
        'jcv.column_id',
        'jcv.option_id',
        'jcv.value',
        'jcv.created_at',
        'jcv.updated_at',

        'jco.id as option_id_nested',
        'jco.column_id as option_column_id',
        'jco.label as option_label',
        'jco.color as option_color',
        'jco.position as option_position',
        'jco.created_at as option_created_at',
        'jco.updated_at as option_updated_at',
      ])
      .execute();
  }

  async deleteByJobAndColumn(jobId: string, columnId: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_column_values').where('job_id', '=', jobId).where('column_id', '=', columnId).execute();
  }

  async deleteByColumnId(columnId: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_column_values').where('column_id', '=', columnId).execute();
  }

  async deleteByOptionId(optionId: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_column_values').where('option_id', '=', optionId).execute();
  }

  async deleteByJobId(jobId: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_column_values').where('job_id', '=', jobId).execute();
  }

  async create(data: JobColumnValueCreateInput | JobColumnValueCreateInput[]): Promise<void> {
    if (Array.isArray(data) && data.length === 0) return;

    await this.kysely.db.insertInto('job_column_values').values(data).execute();
  }

  async upsertTextValue(jobId: string, columnId: string, textValue: string | null): Promise<void> {
    await this.deleteByJobAndColumn(jobId, columnId);

    if (textValue === null) {
      return;
    }

    await this.create({
      job_id: jobId,
      column_id: columnId,
      value: textValue,
    });
  }

  async upsertSelectValue(jobId: string, columnId: string, optionId: string | null): Promise<void> {
    await this.deleteByJobAndColumn(jobId, columnId);

    if (optionId === null) {
      return;
    }

    await this.create({
      job_id: jobId,
      column_id: columnId,
      option_id: optionId,
    });
  }

  async upsertMultiSelectValues(jobId: string, columnId: string, optionIds: string[]): Promise<void> {
    await this.deleteByJobAndColumn(jobId, columnId);

    if (optionIds.length === 0) {
      return;
    }

    const values = optionIds.map(optionId => ({
      job_id: jobId,
      column_id: columnId,
      option_id: optionId,
    }));

    await this.create(values);
  }
}
