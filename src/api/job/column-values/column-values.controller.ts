import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ColumnValuesService } from './column-values.service';
import { UpsertValueDto } from './dto/column-value.dto';

@ApiTags('Job Column Values')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs/:jobId/values')
export class ColumnValuesController {
  constructor(private columnValuesService: ColumnValuesService) {}

  @ApiOperation({ summary: 'Upsert a column value for a job application' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put(':columnId')
  async upsertValue(
    @Param('jobId') jobId: string,
    @Param('columnId') columnId: string,
    @Body() data: UpsertValueDto,
  ): Promise<MessageDto> {
    await this.columnValuesService.upsertValue(jobId, columnId, data);

    return { message: 'Value updated successfully' };
  }
}
