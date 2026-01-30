import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import { InterviewOutcome } from 'src/db/types/db.types';

// Filter DTOs
export class CalendarFiltersDto {
  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}

// Response DTOs
export class JobInterviewResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  job_id: string;

  @ApiProperty({ description: 'Interview type (e.g., Phone Screen, Technical)' })
  type: string;

  @ApiProperty({ format: 'date-time' })
  scheduled_at: Date;

  @ApiProperty()
  duration_mins: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  location: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  meeting_url: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  notes: string | null;

  @ApiProperty({ enum: ['pending', 'passed', 'failed', 'canceled'] })
  outcome: InterviewOutcome;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  updated_at: Date | null;
}

class JobApplicationSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  job_title: string;
}

export class InterviewWithJobResponseDto extends JobInterviewResponseDto {
  @ApiProperty({ type: JobApplicationSummaryDto })
  job: JobApplicationSummaryDto;
}

// Input DTOs
export class CreateInterviewDto {
  @IsString()
  @MaxLength(200)
  type: string;

  @IsDateString()
  scheduled_at: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration_mins?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(2000)
  meeting_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string;

  @IsOptional()
  @IsEnum(InterviewOutcome)
  outcome?: InterviewOutcome;
}

export class UpdateInterviewDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  type?: string;

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration_mins?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string | null;

  @IsOptional()
  @IsUrl()
  @MaxLength(2000)
  meeting_url?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string | null;

  @IsOptional()
  @IsEnum(InterviewOutcome)
  outcome?: InterviewOutcome;
}
