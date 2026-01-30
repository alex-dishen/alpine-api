import type { JobInterviewGetOutput } from 'src/db/types/db.types';
import type { JobApplicationWithStageRow } from '../types/applications.repository.types';
import type { JobApplicationWithDetailsResponseDto, JobApplicationWithStageResponseDto } from '../dto/application.dto';
import type { ColumnValueWithOptionRow } from '../../column-values/types/column-values.repository.types';

export class ApplicationsMapper {
  static toJobApplicationWithStageResponseDto(rows: JobApplicationWithStageRow[]): JobApplicationWithStageResponseDto[] {
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      stage_id: row.stage_id,
      company_name: row.company_name,
      job_title: row.job_title,
      salary_min: row.salary_min,
      salary_max: row.salary_max,
      job_description: row.job_description,
      notes: row.notes,
      applied_at: row.applied_at,
      is_archived: row.is_archived,
      archived_at: row.archived_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      stage: {
        id: row.stage_id,
        user_id: row.stage_user_id,
        name: row.stage_name,
        color: row.stage_color,
        category: row.stage_category,
        position: row.stage_position,
        created_at: row.stage_created_at,
        updated_at: row.stage_updated_at,
      },
    }));
  }

  private static toColumnValuesWithOptions(rows: ColumnValueWithOptionRow[]) {
    return rows.map(cv => ({
      id: cv.id,
      job_id: cv.job_id,
      column_id: cv.column_id,
      option_id: cv.option_id,
      value: cv.value,
      created_at: cv.created_at,
      updated_at: cv.updated_at,
      option: cv.option_id_nested
        ? {
            id: cv.option_id_nested,
            column_id: cv.option_column_id!,
            label: cv.option_label!,
            color: cv.option_color!,
            position: cv.option_position!,
            created_at: cv.option_created_at!,
            updated_at: cv.option_updated_at!,
          }
        : null,
    }));
  }

  static toJobApplicationWithDetailsResponseDto(
    row: JobApplicationWithStageRow,
    columnValueRows: ColumnValueWithOptionRow[],
    interviews: JobInterviewGetOutput[],
  ): JobApplicationWithDetailsResponseDto {
    return {
      id: row.id,
      user_id: row.user_id,
      stage_id: row.stage_id,
      company_name: row.company_name,
      job_title: row.job_title,
      salary_min: row.salary_min,
      salary_max: row.salary_max,
      job_description: row.job_description,
      notes: row.notes,
      applied_at: row.applied_at,
      is_archived: row.is_archived,
      archived_at: row.archived_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      stage: {
        id: row.stage_id,
        user_id: row.stage_user_id,
        name: row.stage_name,
        color: row.stage_color,
        category: row.stage_category,
        position: row.stage_position,
        created_at: row.stage_created_at,
        updated_at: row.stage_updated_at,
      },
      column_values: this.toColumnValuesWithOptions(columnValueRows),
      interviews,
    };
  }
}
