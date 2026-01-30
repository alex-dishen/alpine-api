import { Injectable } from '@nestjs/common';
import { InterviewsRepository } from './interviews.repository';
import { InterviewsMapper } from './mappers/interviews.mapper';
import {
  CreateInterviewDto,
  UpdateInterviewDto,
  CalendarFiltersDto,
  JobInterviewResponseDto,
  InterviewWithJobResponseDto,
} from './dto/interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private interviewsRepository: InterviewsRepository) {}

  async getInterviewsForJob(jobId: string): Promise<JobInterviewResponseDto[]> {
    return this.interviewsRepository.findByJobId(jobId);
  }

  async getInterviewsForCalendar(userId: string, filters: CalendarFiltersDto): Promise<InterviewWithJobResponseDto[]> {
    const rows = await this.interviewsRepository.findByUserForCalendar(userId, filters.start_date, filters.end_date);

    return InterviewsMapper.toInterviewWithJob(rows);
  }

  async createInterview(jobId: string, data: CreateInterviewDto): Promise<void> {
    await this.interviewsRepository.create({
      job_id: jobId,
      type: data.type,
      notes: data.notes,
      outcome: data.outcome,
      location: data.location,
      meeting_url: data.meeting_url,
      scheduled_at: data.scheduled_at,
      duration_mins: data.duration_mins,
    });
  }

  async updateInterview(interviewId: string, data: UpdateInterviewDto): Promise<void> {
    await this.interviewsRepository.update(interviewId, data);
  }

  async deleteInterview(interviewId: string): Promise<void> {
    await this.interviewsRepository.delete(interviewId);
  }
}
