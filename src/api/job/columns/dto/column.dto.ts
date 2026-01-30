import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { JobColumnType } from 'src/db/types/db.types';
import { JobColumnOptionResponseDto } from '../../column-options/dto/column-option.dto';

// Response DTOs
export class JobColumnWithOptionsResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: JobColumnType })
  column_type: JobColumnType;

  @ApiProperty({ type: [JobColumnOptionResponseDto] })
  options: JobColumnOptionResponseDto[];
}

// Input DTOs
export class CreateColumnDto {
  @IsUUID('all')
  id: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(JobColumnType)
  column_type: JobColumnType;
}

export class UpdateColumnDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
