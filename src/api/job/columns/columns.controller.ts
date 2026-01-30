import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ColumnsService } from './columns.service';
import { CreateColumnDto, UpdateColumnDto, JobColumnWithOptionsResponseDto } from './dto/column.dto';

@ApiTags('Job Columns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs/columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @ApiOperation({ summary: 'Get all custom column definitions with options' })
  @ApiResponse({ status: 200, type: [JobColumnWithOptionsResponseDto] })
  @Get()
  async getColumns(@GetUser('sub') userId: string): Promise<JobColumnWithOptionsResponseDto[]> {
    return this.columnsService.getColumns(userId);
  }

  @ApiOperation({ summary: 'Add a custom column definition' })
  @ApiResponse({ status: 201, type: MessageDto })
  @Post()
  async createColumn(@GetUser('sub') userId: string, @Body() data: CreateColumnDto): Promise<MessageDto> {
    await this.columnsService.createColumn(userId, data);

    return { message: 'Column created successfully' };
  }

  @ApiOperation({ summary: 'Update a custom column definition' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put(':id')
  async updateColumn(
    @GetUser('sub') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateColumnDto,
  ): Promise<MessageDto> {
    await this.columnsService.updateColumn(id, userId, data);

    return { message: 'Column updated successfully' };
  }

  @ApiOperation({ summary: 'Delete a custom column definition' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Delete(':id')
  async deleteColumn(@Param('id') id: string): Promise<MessageDto> {
    await this.columnsService.deleteColumn(id);

    return { message: 'Column deleted successfully' };
  }
}
