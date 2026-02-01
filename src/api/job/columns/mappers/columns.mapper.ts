import type { JobColumnDefinitionGetOutput, JobColumnOptionGetOutput, JobStageGetOutput } from 'src/db/types/db.types';
import type { JobColumnWithOptionsResponseDto } from '../dto/column.dto';
import { CORE_COLUMNS, STAGE_COLUMN_ID } from '../constants/core-columns';

export class ColumnsMapper {
  static toJobColumnWithOptionsResponseDto(
    columns: JobColumnDefinitionGetOutput[],
    options: Map<string, JobColumnOptionGetOutput[]>,
    stages: JobStageGetOutput[],
  ): JobColumnWithOptionsResponseDto[] {
    const coreColumnsWithStages = CORE_COLUMNS.map(col => {
      if (col.id === STAGE_COLUMN_ID) {
        return {
          ...col,
          options: stages.map((stage, index) => ({
            id: stage.id,
            label: stage.name,
            color: stage.color,
            position: index,
            column_id: STAGE_COLUMN_ID,
          })),
        };
      }

      return col;
    });

    const customColumns = columns.map(column => {
      const columnOptions = options.get(column.id) ?? [];

      return {
        id: column.id,
        is_core: false,
        field_key: null,
        name: column.name,
        column_type: column.column_type,
        options: columnOptions.map(o => ({
          id: o.id,
          label: o.label,
          color: o.color,
          position: o.position,
          column_id: o.column_id,
        })),
      };
    });

    return [...coreColumnsWithStages, ...customColumns];
  }
}
