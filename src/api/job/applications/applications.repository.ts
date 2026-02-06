import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { Pagination } from 'src/db/helpers/pagination.helper';
import { JobApplicationQueryBuilder } from './strategies/resolvers/job-application-query-builder.helper';
import type { JobApplicationGetOutput, JobApplicationCreateInput, JobApplicationUpdateInput } from 'src/db/types/db.types';
import type { CursorPaginatedResult } from 'src/shared/dtos/pagination.dto';
import type {
  JobApplicationWithStageRow,
  FindWithPaginationInput,
  CountByFiltersInput,
} from './types/applications.repository.types';

// Base columns selected for job applications with stage
const BASE_SELECT_COLUMNS = [
  'ja.id',
  'ja.user_id',
  'ja.stage_id',
  'ja.company_name',
  'ja.job_title',
  'ja.salary_min',
  'ja.salary_max',
  'ja.job_description',
  'ja.notes',
  'ja.applied_at',
  'ja.is_archived',
  'ja.archived_at',
  'ja.created_at',
  'ja.updated_at',

  'js.user_id as stage_user_id',
  'js.name as stage_name',
  'js.color as stage_color',
  'js.category as stage_category',
  'js.position as stage_position',
  'js.created_at as stage_created_at',
  'js.updated_at as stage_updated_at',
] as const;

@Injectable()
export class ApplicationsRepository {
  constructor(private kysely: DatabaseService) {}

  async findWithPagination(input: FindWithPaginationInput): Promise<CursorPaginatedResult<JobApplicationWithStageRow>> {
    const { userId, search, isArchived, filters, sort, pagination } = input;

    // When sorting by custom column, we need to filter the join by column_id
    // Otherwise we get duplicate rows (one per column value per job)
    const sortColumnId = sort?.column_id ?? null;

    const query = this.kysely.db
      .selectFrom('job_applications as ja')
      .innerJoin('job_stages as js', 'js.id', 'ja.stage_id')
      .leftJoin('job_column_values as jcv', join => join.onRef('jcv.job_id', '=', 'ja.id').on('jcv.column_id', '=', sortColumnId))
      .select([...BASE_SELECT_COLUMNS, 'jcv.value as custom_column_value'])
      .where('ja.user_id', '=', userId)
      .where(eb => eb.and(JobApplicationQueryBuilder.applyFilters(eb, { search, isArchived, filters })));

    return Pagination.cursor(query, {
      take: pagination.take,
      cursor: pagination.cursor,
      orderBy: JobApplicationQueryBuilder.createOrderBy(sort),
    });
  }

  async countByFilters(input: CountByFiltersInput): Promise<number> {
    const { userId, search, isArchived, filters } = input;

    const result = await this.kysely.db
      .selectFrom('job_applications as ja')
      .select(eb => eb.fn.count('ja.id').as('count'))
      .where('ja.user_id', '=', userId)
      .where(eb => eb.and(JobApplicationQueryBuilder.applyFilters(eb, { search, isArchived, filters })))
      .executeTakeFirst();

    return Number(result?.count ?? 0);
  }

  async findById(id: string): Promise<JobApplicationGetOutput | undefined> {
    return this.kysely.db.selectFrom('job_applications').where('id', '=', id).selectAll().executeTakeFirst();
  }

  async findByIdWithStage(id: string): Promise<JobApplicationWithStageRow | undefined> {
    return this.kysely.db
      .selectFrom('job_applications as ja')
      .innerJoin('job_stages as js', 'js.id', 'ja.stage_id')
      .where('ja.id', '=', id)
      .select(BASE_SELECT_COLUMNS)
      .executeTakeFirst();
  }

  async create(data: JobApplicationCreateInput): Promise<void> {
    await this.kysely.db.insertInto('job_applications').values(data).execute();
  }

  async update(id: string, data: JobApplicationUpdateInput): Promise<void> {
    await this.kysely.db
      .updateTable('job_applications')
      .set({ ...data, updated_at: new Date().toISOString() })
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.kysely.db.deleteFrom('job_applications').where('id', '=', id).execute();
  }
}
