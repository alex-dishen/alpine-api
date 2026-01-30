import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsHexColor, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

// Response DTOs
export class JobColumnOptionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  column_id: string;

  @ApiProperty()
  label: string;

  @ApiProperty({ description: 'Hex color code' })
  color: string;

  @ApiProperty()
  position: number;
}

// Input DTOs
export class CreateColumnOptionDto {
  @IsUUID('all')
  id: string;

  @IsString()
  @MaxLength(100)
  label: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsInt()
  @Min(0)
  position: number;
}

export class UpdateColumnOptionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}

export class ReorderColumnOptionsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  option_ids: string[];
}
