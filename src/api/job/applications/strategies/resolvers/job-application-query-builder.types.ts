import type { DB, JobApplicationTable, JobStageTable } from 'src/db/types/db.types';
import type { JobFiltersBaseDto } from '../../dto/application.dto';
import type {
  SqlBool,
  ExpressionBuilder as NativeExpressionBuilder,
  ExpressionWrapper as NativeExpressionWrapper,
  SelectQueryBuilder as NativeSelectQueryBuilder,
} from 'kysely';

export type JoinedTables = {
  js: JobStageTable;
  ja: JobApplicationTable;
};

export type SelectQueryBuilder<T> = NativeSelectQueryBuilder<DB & JoinedTables, keyof JoinedTables, T>;

export type ExpressionBuilder = NativeExpressionBuilder<DB & JoinedTables, keyof JoinedTables>;

export type ExpressionWrapper = NativeExpressionWrapper<DB & JoinedTables, keyof JoinedTables, SqlBool>;

export type TableFieldReference = `ja.${keyof JobApplicationTable}` | `js.${keyof JobStageTable}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryHandler = (eb: ExpressionBuilder, value: any) => ExpressionWrapper | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OrderByHandler = <T>(query: SelectQueryBuilder<T>, value: any) => SelectQueryBuilder<T>;

export type DefinedJobApplicationFilters = {
  [K in keyof JobFiltersBaseDto]-?: JobFiltersBaseDto[K];
};
