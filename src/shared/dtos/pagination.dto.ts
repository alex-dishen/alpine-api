import { IsNumber } from 'class-validator';
import { IsOptional } from 'class-validator';
import IsNullOrNumberDecorator from '../decorators/is-number-or-null.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderByDirection } from 'kysely';

export class OffsetPaginationDto {
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  take?: number;
}

export class OffsetPaginationMetadata {
  @IsNumber()
  total: number;

  @IsNumber()
  lastPage: number;

  @IsNumber()
  currentPage: number;

  @IsNumber()
  perPage: number;

  @IsNullOrNumberDecorator({ message: 'Must be integer or null' })
  prev: number | null;

  @IsNullOrNumberDecorator({ message: 'Must be integer or null' })
  next: number | null;
}

export class OffsetPaginatedResult<T> {
  @ApiProperty({ isArray: true })
  data: T[];
  meta: OffsetPaginationMetadata;
}

export type OffsetPaginateOptions = { skip?: number; take?: number };

class CursorPaginationDto {
  @ApiProperty({ description: 'Indicates if there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Cursor for the next page', type: String, nullable: true })
  cursor: string | null;
}

export class CursorPaginatedResult<T> {
  @ApiProperty({ description: 'Array of data items', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Pagination meta', type: CursorPaginationDto })
  pagination: CursorPaginationDto;
}

export type CursorPaginationOptionsOrderBy<T = string, I = object> = {
  column: T;
  selectColumn: keyof I;
  direction: OrderByDirection;
  nulls?: 'first' | 'last';
};

export type CursorPaginationOptions<T, I> = {
  take?: number;
  cursor?: string | null;
  orderBy: CursorPaginationOptionsOrderBy<T, I>[];
};
