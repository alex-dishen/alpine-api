import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { StagesRepository } from './stages.repository';
import { StagesMapper } from './mappers/stages.mapper';
import { CreateStageDto, UpdateStageDto, ReorderStagesDto, JobStageWithCountResponseDto } from './dto/stage.dto';
import { DEFAULT_STAGES } from './constants/default-stages';

@Injectable()
export class StagesService {
  constructor(private stagesRepository: StagesRepository) {}

  async getStages(userId: string): Promise<JobStageWithCountResponseDto[]> {
    const rows = await this.stagesRepository.findByUserId(userId);

    return StagesMapper.toStageWithCount(rows);
  }

  async createStage(userId: string, data: CreateStageDto): Promise<void> {
    const existing = await this.stagesRepository.findByName(data.name, userId);

    if (existing) {
      throw new ConflictException('Stage with this name already exists');
    }

    await this.stagesRepository.create({ ...data, user_id: userId });
  }

  async updateStage(id: string, userId: string, data: UpdateStageDto): Promise<void> {
    const stage = await this.stagesRepository.findById(id);

    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    if (data.name && data.name !== stage.name) {
      const existing = await this.stagesRepository.findByName(data.name, userId);

      if (existing) {
        throw new ConflictException('Stage with this name already exists');
      }
    }

    await this.stagesRepository.update(id, data);
  }

  async deleteStage(id: string): Promise<void> {
    const hasApplications = await this.stagesRepository.hasApplications(id);

    if (hasApplications) {
      throw new BadRequestException('Cannot delete stage with existing applications. Move or delete applications first.');
    }

    await this.stagesRepository.delete(id);
  }

  async reorderStages(data: ReorderStagesDto): Promise<void> {
    for (let i = 0; i < data.stage_ids.length; i++) {
      await this.stagesRepository.update(data.stage_ids[i], { position: i });
    }
  }

  async seedDefaultStages(userId: string): Promise<void> {
    const existingStages = await this.stagesRepository.findByUserId(userId);

    if (existingStages.length > 0) {
      return; // User already has stages
    }

    const categoryPositions: Record<string, number> = {
      initial: 0,
      interview: 0,
      positive: 0,
      negative: 0,
    };

    const stagesToCreate = DEFAULT_STAGES.map(stage => {
      const position = categoryPositions[stage.category];
      categoryPositions[stage.category]++;

      return {
        user_id: userId,
        name: stage.name,
        color: stage.color,
        category: stage.category as never,
        position,
        is_default: true,
      };
    });

    await this.stagesRepository.create(stagesToCreate);
  }
}
