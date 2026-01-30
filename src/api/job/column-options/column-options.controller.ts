import { Controller, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ColumnOptionsService } from './column-options.service';
import { CreateColumnOptionDto, UpdateColumnOptionDto, ReorderColumnOptionsDto } from './dto/column-option.dto';

@ApiTags('Job Column Options')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs/columns')
export class ColumnOptionsController {
  constructor(private columnOptionsService: ColumnOptionsService) {}

  @ApiOperation({ summary: 'Add an option to a SELECT/MULTI_SELECT column' })
  @ApiResponse({ status: 201, type: MessageDto })
  @Post(':columnId/options')
  async createOption(
    @GetUser('sub') userId: string,
    @Param('columnId') columnId: string,
    @Body() data: CreateColumnOptionDto,
  ): Promise<MessageDto> {
    await this.columnOptionsService.createOption(columnId, userId, data);

    return { message: 'Option added successfully' };
  }

  @ApiOperation({ summary: 'Update a column option' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put('options/:id')
  async updateOption(@Param('id') id: string, @Body() data: UpdateColumnOptionDto): Promise<MessageDto> {
    await this.columnOptionsService.updateOption(id, data);

    return { message: 'Option updated successfully' };
  }

  @ApiOperation({ summary: 'Delete a column option' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Delete('options/:id')
  async deleteOption(@Param('id') id: string): Promise<MessageDto> {
    await this.columnOptionsService.deleteOption(id);

    return { message: 'Option deleted successfully' };
  }

  @ApiOperation({ summary: 'Reorder options within a column' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put(':columnId/options/reorder')
  async reorderOptions(
    @GetUser('sub') userId: string,
    @Param('columnId') columnId: string,
    @Body() data: ReorderColumnOptionsDto,
  ): Promise<MessageDto> {
    await this.columnOptionsService.reorderOptions(columnId, userId, data);

    return { message: 'Options reordered successfully' };
  }
}
