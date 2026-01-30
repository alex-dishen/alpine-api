import type { JobColumnDefinitionGetOutput, JobColumnOptionGetOutput } from 'src/db/types/db.types';
import type { JobColumnWithOptionsResponseDto } from '../dto/column.dto';
import type { JobColumnOptionResponseDto } from '../../column-options/dto/column-option.dto';

export class ColumnsMapper {
  private static toJobColumnOptionResponseDto(option: JobColumnOptionGetOutput): JobColumnOptionResponseDto {
    return {
      id: option.id,
      label: option.label,
      color: option.color,
      position: option.position,
      column_id: option.column_id,
    };
  }

  static toJobColumnWithOptionsResponseDto(
    columns: JobColumnDefinitionGetOutput[],
    options: Map<string, JobColumnOptionGetOutput[]>,
  ): JobColumnWithOptionsResponseDto[] {
    return columns.map(column => {
      const columnOptions = options.get(column.id) ?? [];

      return {
        id: column.id,
        name: column.name,
        user_id: column.user_id,
        column_type: column.column_type,
        options: columnOptions?.map(o => this.toJobColumnOptionResponseDto(o)),
      };
    });
  }
}
