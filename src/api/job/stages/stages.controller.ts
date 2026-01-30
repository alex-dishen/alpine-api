import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { StagesService } from './stages.service';
import { CreateStageDto, UpdateStageDto, ReorderStagesDto, JobStageWithCountResponseDto } from './dto/stage.dto';

@ApiTags('Job Stages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs/stages')
export class StagesController {
  constructor(private stagesService: StagesService) {}

  @ApiOperation({ summary: 'Get all job stages for the current user' })
  @ApiResponse({ status: 200, type: [JobStageWithCountResponseDto] })
  @Get()
  async getStages(@GetUser('sub') userId: string): Promise<JobStageWithCountResponseDto[]> {
    return this.stagesService.getStages(userId);
  }

  @ApiOperation({ summary: 'Create a new job stage' })
  @ApiResponse({ status: 201, type: MessageDto })
  @Post()
  async createStage(@GetUser('sub') userId: string, @Body() data: CreateStageDto): Promise<MessageDto> {
    await this.stagesService.createStage(userId, data);

    return { message: 'Stage created successfully' };
  }

  @ApiOperation({ summary: 'Update a job stage' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put(':id')
  async updateStage(@GetUser('sub') userId: string, @Param('id') id: string, @Body() data: UpdateStageDto): Promise<MessageDto> {
    await this.stagesService.updateStage(id, userId, data);

    return { message: 'Stage updated successfully' };
  }

  @ApiOperation({ summary: 'Delete a job stage' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Delete(':id')
  async deleteStage(@Param('id') id: string): Promise<MessageDto> {
    await this.stagesService.deleteStage(id);

    return { message: 'Stage deleted successfully' };
  }

  @ApiOperation({ summary: 'Reorder job stages' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put('reorder')
  async reorderStages(@Body() data: ReorderStagesDto): Promise<MessageDto> {
    await this.stagesService.reorderStages(data);

    return { message: 'Stages reordered successfully' };
  }
}
