import { ColumnsRepository } from './columns.repository';
import { ColumnsMapper } from './mappers/columns.mapper';
import type { JobColumnOptionGetOutput } from 'src/db/types/db.types';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ColumnValuesRepository } from '../column-values/column-values.repository';
import { ColumnOptionsRepository } from '../column-options/column-options.repository';
import { CreateColumnDto, UpdateColumnDto, JobColumnWithOptionsResponseDto } from './dto/column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    private columnsRepository: ColumnsRepository,
    private columnOptionsRepository: ColumnOptionsRepository,
    private columnValuesRepository: ColumnValuesRepository,
  ) {}

  async getColumns(userId: string): Promise<JobColumnWithOptionsResponseDto[]> {
    const columns = await this.columnsRepository.findByUserId(userId);

    if (columns.length === 0) return [];

    const columnIds = columns.map(c => c.id);
    const options = await this.columnOptionsRepository.findByColumnIds(columnIds);

    const optionsByColumnId = new Map<string, JobColumnOptionGetOutput[]>();

    for (const option of options) {
      const existing = optionsByColumnId.get(option.column_id) ?? [];
      existing.push(option);
      optionsByColumnId.set(option.column_id, existing);
    }

    return ColumnsMapper.toJobColumnWithOptionsResponseDto(columns, optionsByColumnId);
  }

  async createColumn(userId: string, data: CreateColumnDto): Promise<void> {
    const existing = await this.columnsRepository.findByName(data.name, userId);

    if (existing) {
      throw new ConflictException('Column with this name already exists');
    }

    await this.columnsRepository.create({
      id: data.id,
      user_id: userId,
      name: data.name,
      column_type: data.column_type,
    });
  }

  async updateColumn(id: string, userId: string, data: UpdateColumnDto): Promise<void> {
    const column = await this.columnsRepository.findById(id);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    if (data.name && data.name !== column.name) {
      const existing = await this.columnsRepository.findByName(data.name, userId);

      if (existing) {
        throw new ConflictException('Column with this name already exists');
      }
    }

    await this.columnsRepository.update(id, data);
  }

  async deleteColumn(id: string): Promise<void> {
    const column = await this.columnsRepository.findById(id);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.columnValuesRepository.deleteByColumnId(id);
    await this.columnOptionsRepository.deleteByColumnId(id);
    await this.columnsRepository.delete(id);
  }
}
