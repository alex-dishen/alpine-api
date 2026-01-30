import { Module } from '@nestjs/common';
import { StagesController } from './stages/stages.controller';
import { StagesService } from './stages/stages.service';
import { StagesRepository } from './stages/stages.repository';
import { ApplicationsController } from './applications/applications.controller';
import { ApplicationsService } from './applications/applications.service';
import { ApplicationsRepository } from './applications/applications.repository';
import { ColumnsController } from './columns/columns.controller';
import { ColumnsService } from './columns/columns.service';
import { ColumnsRepository } from './columns/columns.repository';
import { ColumnOptionsController } from './column-options/column-options.controller';
import { ColumnOptionsService } from './column-options/column-options.service';
import { ColumnOptionsRepository } from './column-options/column-options.repository';
import { ColumnValuesController } from './column-values/column-values.controller';
import { ColumnValuesService } from './column-values/column-values.service';
import { ColumnValuesRepository } from './column-values/column-values.repository';
import { InterviewsController } from './interviews/interviews.controller';
import { InterviewsService } from './interviews/interviews.service';
import { InterviewsRepository } from './interviews/interviews.repository';

@Module({
  imports: [],
  controllers: [
    StagesController,
    ColumnsController,
    ColumnOptionsController, // Must be before ApplicationsController to avoid route conflicts
    InterviewsController, // Must be before ApplicationsController to avoid route conflicts
    ColumnValuesController,
    ApplicationsController,
  ],
  providers: [
    StagesRepository,
    StagesService,
    ApplicationsRepository,
    ApplicationsService,
    ColumnsRepository,
    ColumnsService,
    ColumnOptionsRepository,
    ColumnOptionsService,
    ColumnValuesRepository,
    ColumnValuesService,
    InterviewsRepository,
    InterviewsService,
  ],
  exports: [StagesRepository, StagesService, ColumnOptionsRepository],
})
export class JobModule {}
