import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { InterviewsService } from './interviews.service';
import {
  CreateInterviewDto,
  UpdateInterviewDto,
  CalendarFiltersDto,
  JobInterviewResponseDto,
  InterviewWithJobResponseDto,
} from './dto/interview.dto';

@ApiTags('Job Interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @ApiOperation({ summary: 'List interviews for a job application' })
  @ApiResponse({ status: 200, type: [JobInterviewResponseDto] })
  @Get(':jobId/interviews')
  async getInterviewsForJob(@Param('jobId') jobId: string): Promise<JobInterviewResponseDto[]> {
    return this.interviewsService.getInterviewsForJob(jobId);
  }

  @ApiOperation({ summary: 'Create an interview for a job application' })
  @ApiResponse({ status: 201, type: MessageDto })
  @Post(':jobId/interviews')
  async createInterview(@Param('jobId') jobId: string, @Body() data: CreateInterviewDto): Promise<MessageDto> {
    await this.interviewsService.createInterview(jobId, data);

    return { message: 'Interview created successfully' };
  }

  @ApiOperation({ summary: 'Get all interviews for calendar view' })
  @ApiResponse({ status: 200, type: [InterviewWithJobResponseDto] })
  @Get('interviews/calendar')
  async getInterviewsForCalendar(
    @GetUser('sub') userId: string,
    @Query() filters: CalendarFiltersDto,
  ): Promise<InterviewWithJobResponseDto[]> {
    return this.interviewsService.getInterviewsForCalendar(userId, filters);
  }

  @ApiOperation({ summary: 'Update an interview' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put('interviews/:id')
  async updateInterview(@Param('id') id: string, @Body() data: UpdateInterviewDto): Promise<MessageDto> {
    await this.interviewsService.updateInterview(id, data);

    return { message: 'Interview updated successfully' };
  }

  @ApiOperation({ summary: 'Delete an interview' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Delete('interviews/:id')
  async deleteInterview(@Param('id') id: string): Promise<MessageDto> {
    await this.interviewsService.deleteInterview(id);

    return { message: 'Interview deleted successfully' };
  }
}
