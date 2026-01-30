import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { JobColumnOptionResponseDto } from 'src/api/job/column-options/dto/column-option.dto';

// Response DTOs
export class JobColumnValueWithOptionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  job_id: string;

  @ApiProperty({ format: 'uuid' })
  column_id: string;

  @ApiPropertyOptional({ format: 'uuid', type: String, nullable: true })
  option_id: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, description: 'Value for TEXT, NUMBER, DATE, URL, CHECKBOX types' })
  value: string | null;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  updated_at: Date | null;

  @ApiPropertyOptional({ type: JobColumnOptionResponseDto, nullable: true })
  option?: JobColumnOptionResponseDto | null;
}

// Input DTOs
export class UpsertValueDto {
  // For TEXT, NUMBER, DATE, URL, CHECKBOX types - store as text_value
  @IsOptional()
  @IsString()
  text_value?: string | null;

  // For SELECT type - single option_id
  @IsOptional()
  @IsUUID()
  option_id?: string | null;

  // For MULTI_SELECT type - array of option_ids
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  option_ids?: string[];
}
