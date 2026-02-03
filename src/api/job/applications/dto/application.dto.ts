import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { JobStageCategory } from 'src/db/types/db.types';
import { JobStageResponseDto } from 'src/api/job/stages/dto/stage.dto';
import { JobColumnValueWithOptionResponseDto } from 'src/api/job/column-values/dto/column-value.dto';
import { JobInterviewResponseDto } from 'src/api/job/interviews/dto/interview.dto';
import { CursorPaginationRequestDto } from 'src/shared/dtos/pagination.dto';
import { JobApplicationSortByEnum } from '../registry/job-application-sort.enum';
import { SortOrderEnum } from 'src/shared/enums/sort-order';
import { ColumnFilterDto } from './column-filter.dto';

// Response DTOs
export class JobApplicationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty({ format: 'uuid' })
  stage_id: string;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  job_title: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  salary_min: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  salary_max: number | null;

  @ApiPropertyOptional({ type: String, nullable: true, description: 'Original job posting from job board/recruiter' })
  job_description: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  notes: string | null;

  @ApiProperty({ format: 'date-time' })
  applied_at: Date;

  @ApiProperty()
  is_archived: boolean;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  archived_at: Date | null;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  updated_at: Date | null;
}

export class JobApplicationWithStageResponseDto extends JobApplicationResponseDto {
  @ApiProperty({ type: JobStageResponseDto })
  stage: JobStageResponseDto;
}

export class JobApplicationWithDetailsResponseDto extends JobApplicationResponseDto {
  @ApiProperty({ type: JobStageResponseDto })
  stage: JobStageResponseDto;

  @ApiProperty({ type: [JobColumnValueWithOptionResponseDto] })
  column_values: JobColumnValueWithOptionResponseDto[];

  @ApiProperty({ type: [JobInterviewResponseDto] })
  interviews: JobInterviewResponseDto[];
}

// Count Response DTO
export class JobCountResponseDto {
  @ApiProperty()
  count: number;
}

// Input DTOs
export class CreateJobDto {
  @IsUUID()
  id: string;

  @IsUUID()
  stage_id: string;

  @IsString()
  @MaxLength(200)
  company_name: string;

  @IsString()
  @MaxLength(200)
  job_title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salary_min?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salary_max?: number;

  @IsOptional()
  @IsString()
  job_description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string;

  @IsOptional()
  @IsDateString()
  applied_at?: string;
}

export class UpdateJobDto {
  @IsOptional()
  @IsUUID()
  stage_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  company_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  job_title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salary_min?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  salary_max?: number | null;

  @IsOptional()
  @IsString()
  job_description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string | null;

  @IsOptional()
  @IsDateString()
  applied_at?: string;

  @IsOptional()
  @IsBoolean()
  is_archived?: boolean;
}

// Filter DTOs
export class JobFiltersBaseDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  stage_id?: string;

  @IsOptional()
  @IsEnum(JobStageCategory)
  category?: JobStageCategory;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_archived?: boolean;
}

export class JobSortDto {
  @IsOptional()
  @IsEnum(JobApplicationSortByEnum)
  sort_by: JobApplicationSortByEnum;

  @IsOptional()
  @IsEnum(SortOrderEnum)
  order: SortOrderEnum;

  @IsOptional()
  @IsUUID()
  column_id?: string; // Required when sort_by = 'custom_column'
}

export class JobFiltersDto {
  @ApiPropertyOptional({ type: JobFiltersBaseDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => JobFiltersBaseDto)
  filters?: JobFiltersBaseDto;

  @ApiPropertyOptional({ type: [ColumnFilterDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnFilterDto)
  column_filters?: ColumnFilterDto[];

  @ApiPropertyOptional({ type: JobSortDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => JobSortDto)
  sort?: JobSortDto;

  @ApiProperty({ type: CursorPaginationRequestDto })
  @ValidateNested()
  @Type(() => CursorPaginationRequestDto)
  pagination: CursorPaginationRequestDto;
}
