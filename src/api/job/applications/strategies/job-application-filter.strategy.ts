import { JobApplicationFilterEnum } from '../registry/job-application-filter.enum';
import type {
  QueryHandler,
  ExpressionBuilder,
  DefinedJobApplicationFilters,
} from './resolvers/job-application-query-builder.types';

export const jobApplicationFilterHandler: Record<JobApplicationFilterEnum, QueryHandler> = {
  [JobApplicationFilterEnum.Search]: (eb: ExpressionBuilder, value: DefinedJobApplicationFilters['search']) => {
    const searchTerm = `%${value.toLowerCase()}%`;

    return eb.or([eb('ja.company_name', 'ilike', searchTerm), eb('ja.job_title', 'ilike', searchTerm)]);
  },

  [JobApplicationFilterEnum.StageId]: (eb: ExpressionBuilder, value: DefinedJobApplicationFilters['stage_id']) => {
    return eb('ja.stage_id', '=', value);
  },

  [JobApplicationFilterEnum.Category]: (eb: ExpressionBuilder, value: DefinedJobApplicationFilters['category']) => {
    return eb('js.category', '=', value);
  },

  [JobApplicationFilterEnum.IsArchived]: (eb: ExpressionBuilder, value: DefinedJobApplicationFilters['is_archived']) => {
    return eb('ja.is_archived', '=', value);
  },
};
