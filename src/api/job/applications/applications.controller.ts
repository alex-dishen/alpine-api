import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ApplicationsService } from './applications.service';
import {
  CreateJobDto,
  UpdateJobDto,
  JobFiltersDto,
  JobApplicationWithDetailsResponseDto,
  JobCountResponseDto,
  JobApplicationWithStageResponseDto,
  JobFiltersBaseDto,
} from './dto/application.dto';
import { ApiCursorPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';
import { CursorPaginatedResult } from 'src/shared/dtos/pagination.dto';

@ApiTags('Job Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'List job applications with cursor pagination' })
  @ApiCursorPaginatedResponse(JobApplicationWithStageResponseDto)
  @Post('list')
  async getJobs(
    @GetUser('sub') userId: string,
    @Body() dto: JobFiltersDto,
  ): Promise<CursorPaginatedResult<JobApplicationWithStageResponseDto>> {
    return this.applicationsService.getJobs(userId, dto);
  }

  @ApiOperation({ summary: 'Get total count of job applications with filters' })
  @ApiResponse({ status: 200, type: JobCountResponseDto })
  @Get('count')
  async getJobsCount(@GetUser('sub') userId: string, @Query() filters: JobFiltersBaseDto): Promise<JobCountResponseDto> {
    return this.applicationsService.getJobsCount(userId, filters);
  }

  @ApiOperation({ summary: 'Create a new job application' })
  @ApiResponse({ status: 201, type: MessageDto })
  @Post()
  async createJob(@GetUser('sub') userId: string, @Body() data: CreateJobDto): Promise<MessageDto> {
    await this.applicationsService.createJob(userId, data);

    return { message: 'Job application created successfully' };
  }

  @ApiOperation({ summary: 'Get a single job application with details' })
  @ApiResponse({ status: 200, type: JobApplicationWithDetailsResponseDto })
  @Get(':id')
  async getJob(@Param('id') id: string): Promise<JobApplicationWithDetailsResponseDto> {
    return this.applicationsService.getJob(id);
  }

  @ApiOperation({ summary: 'Update a job application' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put(':id')
  async updateJob(@Param('id') id: string, @Body() data: UpdateJobDto): Promise<MessageDto> {
    await this.applicationsService.updateJob(id, data);

    return { message: 'Job application updated successfully' };
  }

  @ApiOperation({ summary: 'Archive (soft delete) a job application' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Delete(':id')
  async archiveJob(@Param('id') id: string): Promise<MessageDto> {
    await this.applicationsService.deleteJob(id);

    return { message: 'Job application archived successfully' };
  }
}
