import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ColumnOptionsRepository } from './column-options.repository';
import { ColumnsRepository } from '../columns/columns.repository';
import { ColumnValuesRepository } from '../column-values/column-values.repository';
import { CreateColumnOptionDto, UpdateColumnOptionDto, ReorderColumnOptionsDto } from './dto/column-option.dto';
import { JobColumnType } from 'src/db/types/db.types';

@Injectable()
export class ColumnOptionsService {
  constructor(
    private columnOptionsRepository: ColumnOptionsRepository,
    private columnsRepository: ColumnsRepository,
    private columnValuesRepository: ColumnValuesRepository,
  ) {}

  async createOption(columnId: string, userId: string, data: CreateColumnOptionDto): Promise<void> {
    const column = await this.columnsRepository.findById(columnId);

    if (!column || column.user_id !== userId) {
      throw new NotFoundException('Column not found');
    }

    if (column.column_type !== JobColumnType.SELECT && column.column_type !== JobColumnType.MULTI_SELECT) {
      throw new BadRequestException('Options can only be added to SELECT or MULTI_SELECT columns');
    }

    const existing = await this.columnOptionsRepository.findByLabel(columnId, data.label);

    if (existing) {
      throw new ConflictException('Option with this label already exists');
    }

    await this.columnOptionsRepository.create({
      id: data.id,
      label: data.label,
      color: data.color,
      column_id: columnId,
      position: data.position,
    });
  }

  async updateOption(optionId: string, data: UpdateColumnOptionDto): Promise<void> {
    const option = await this.columnOptionsRepository.findById(optionId);

    if (!option) {
      throw new NotFoundException('Option not found');
    }

    if (data.label && data.label !== option.label) {
      const existing = await this.columnOptionsRepository.findByLabel(option.column_id, data.label);

      if (existing) {
        throw new ConflictException('Option with this label already exists');
      }
    }

    await this.columnOptionsRepository.update(optionId, data);
  }

  async deleteOption(optionId: string): Promise<void> {
    await this.columnValuesRepository.deleteByOptionId(optionId);
    await this.columnOptionsRepository.delete(optionId);
  }

  async reorderOptions(columnId: string, userId: string, data: ReorderColumnOptionsDto): Promise<void> {
    const column = await this.columnsRepository.findById(columnId);

    if (!column || column.user_id !== userId) {
      throw new NotFoundException('Column not found');
    }

    for (let i = 0; i < data.option_ids.length; i++) {
      await this.columnOptionsRepository.update(data.option_ids[i], { position: i });
    }
  }
}
