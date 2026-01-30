import type { JobStageWithCountResponseDto } from '../dto/stage.dto';
import type { StageWithCountRow } from '../types/stages.repository.types';

export class StagesMapper {
  static toStageWithCount(rows: StageWithCountRow[]): JobStageWithCountResponseDto[] {
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      color: row.color,
      category: row.category,
      position: row.position,
      created_at: row.created_at,
      updated_at: row.updated_at,
      job_count: Number(row.job_count),
    }));
  }
}
