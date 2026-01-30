import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ColumnValuesRepository } from './column-values.repository';
import { ColumnsRepository } from '../columns/columns.repository';
import { UpsertValueDto } from './dto/column-value.dto';
import { JobColumnType } from 'src/db/types/db.types';

@Injectable()
export class ColumnValuesService {
  constructor(
    private columnValuesRepository: ColumnValuesRepository,
    private columnsRepository: ColumnsRepository,
  ) {}

  async upsertValue(jobId: string, columnId: string, data: UpsertValueDto): Promise<void> {
    const column = await this.columnsRepository.findById(columnId);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    switch (column.column_type) {
      case JobColumnType.TEXT:
      case JobColumnType.NUMBER:
      case JobColumnType.DATE:
      case JobColumnType.URL:
      case JobColumnType.CHECKBOX:
        if (data.text_value === undefined && data.option_id === undefined && data.option_ids === undefined) {
          throw new BadRequestException('text_value is required for this column type');
        }

        await this.columnValuesRepository.upsertTextValue(jobId, columnId, data.text_value ?? null);
        break;

      case JobColumnType.SELECT:
        if (data.option_id === undefined) {
          throw new BadRequestException('option_id is required for SELECT column type');
        }

        await this.columnValuesRepository.upsertSelectValue(jobId, columnId, data.option_id);
        break;

      case JobColumnType.MULTI_SELECT:
        if (data.option_ids == undefined) {
          throw new BadRequestException('option_ids is required for MULTI_SELECT column type');
        }

        await this.columnValuesRepository.upsertMultiSelectValues(jobId, columnId, data.option_ids);
        break;

      default:
        throw new BadRequestException('Unknown column type');
    }
  }
}
