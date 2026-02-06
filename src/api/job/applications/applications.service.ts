import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationsRepository } from './applications.repository';
import { ApplicationsMapper } from './mappers/applications.mapper';
import { ColumnValuesRepository } from '../column-values/column-values.repository';
import { InterviewsRepository } from '../interviews/interviews.repository';
import {
  CreateJobDto,
  UpdateJobDto,
  JobFiltersDto,
  JobListRequestDto,
  JobApplicationWithStageResponseDto,
  JobApplicationWithDetailsResponseDto,
} from './dto/application.dto';
import type { CursorPaginatedResult } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private applicationsRepository: ApplicationsRepository,
    private columnValuesRepository: ColumnValuesRepository,
    private interviewsRepository: InterviewsRepository,
  ) {}

  async getJobs(userId: string, dto: JobListRequestDto): Promise<CursorPaginatedResult<JobApplicationWithStageResponseDto>> {
    const result = await this.applicationsRepository.findWithPagination({
      userId,
      sort: dto.sort,
      pagination: dto.pagination,
      search: dto.filters?.search,
      filters: dto.filters?.column_filters,
      isArchived: dto.filters?.is_archived,
    });

    return {
      data: ApplicationsMapper.toJobApplicationWithStageResponseDto(result.data),
      pagination: result.pagination,
    };
  }

  async getJobsCount(userId: string, dto: JobFiltersDto): Promise<{ count: number }> {
    const count = await this.applicationsRepository.countByFilters({
      userId,
      search: dto.search,
      filters: dto.column_filters,
      isArchived: dto.is_archived,
    });

    return { count };
  }

  async getJob(id: string): Promise<JobApplicationWithDetailsResponseDto> {
    const jobRow = await this.applicationsRepository.findByIdWithStage(id);

    if (!jobRow) {
      throw new NotFoundException('Job application not found');
    }

    const [columnValueRows, interviews] = await Promise.all([
      this.columnValuesRepository.findColumnValuesByJobId(id),
      this.interviewsRepository.findByJobId(id),
    ]);

    return ApplicationsMapper.toJobApplicationWithDetailsResponseDto(jobRow, columnValueRows, interviews);
  }

  async createJob(userId: string, data: CreateJobDto): Promise<void> {
    await this.applicationsRepository.create({ ...data, user_id: userId });
  }

  async updateJob(id: string, data: UpdateJobDto): Promise<void> {
    await this.applicationsRepository.update(id, data);
  }

  async deleteJob(id: string): Promise<void> {
    await this.columnValuesRepository.deleteByJobId(id);
    await this.interviewsRepository.deleteByJobId(id);
    await this.applicationsRepository.delete(id);
  }
}
