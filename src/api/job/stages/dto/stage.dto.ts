import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsHexColor, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { JobStageCategory } from 'src/db/types/db.types';

// Response DTOs
export class JobStageResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Hex color code' })
  color: string;

  @ApiProperty({ enum: ['initial', 'interview', 'positive', 'negative'] })
  category: JobStageCategory;

  @ApiProperty()
  position: number;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  updated_at: Date | null;
}

export class JobStageWithCountResponseDto extends JobStageResponseDto {
  @ApiProperty({ description: 'Number of jobs in this stage' })
  job_count: number;
}

// Input DTOs
export class CreateStageDto {
  @IsUUID('all')
  id: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEnum(JobStageCategory)
  category: JobStageCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  position: number;
}

export class UpdateStageDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsEnum(JobStageCategory)
  category?: JobStageCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class ReorderStagesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  stage_ids: string[];
}
