/* eslint-disable */
// @ts-nocheck
// Auto-generated CRUD types for Kysely
// Generated at 2026-01-30T09:54:41.790Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum JobStageCategory {
  INITIAL = 'initial',
  INTERVIEW = 'interview',
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export enum JobColumnType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  URL = 'url',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
}

export enum InterviewOutcome {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export enum UserProvider {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  APPLE = 'apple',
}

export type JobStageTable = {
  id: Generated<string>;
  user_id: string;
  name: string;
  color: Generated<string>;
  category: Generated<JobStageCategory>;
  position: Generated<number>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type JobStageGetOutput = Selectable<JobStageTable>;
export type JobStageCreateInput = Insertable<JobStageTable>;
export type JobStageUpdateInput = Updateable<JobStageTable>;

export type JobApplicationTable = {
  id: Generated<string>;
  user_id: string;
  stage_id: string;
  company_name: string;
  job_title: string;
  salary_min: number | null;
  salary_max: number | null;
  job_description: string | null;
  notes: string | null;
  applied_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_archived: Generated<boolean>;
  archived_at: ColumnType<Date, Date | string | undefined, Date | string>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type JobApplicationGetOutput = Selectable<JobApplicationTable>;
export type JobApplicationCreateInput = Insertable<JobApplicationTable>;
export type JobApplicationUpdateInput = Updateable<JobApplicationTable>;

export type JobColumnDefinitionTable = {
  id: Generated<string>;
  user_id: string;
  name: string;
  column_type: JobColumnType;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type JobColumnDefinitionGetOutput = Selectable<JobColumnDefinitionTable>;
export type JobColumnDefinitionCreateInput = Insertable<JobColumnDefinitionTable>;
export type JobColumnDefinitionUpdateInput = Updateable<JobColumnDefinitionTable>;

export type JobColumnOptionTable = {
  id: Generated<string>;
  column_id: string;
  label: string;
  color: Generated<string>;
  position: Generated<number>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type JobColumnOptionGetOutput = Selectable<JobColumnOptionTable>;
export type JobColumnOptionCreateInput = Insertable<JobColumnOptionTable>;
export type JobColumnOptionUpdateInput = Updateable<JobColumnOptionTable>;

export type JobColumnValueTable = {
  id: Generated<string>;
  job_id: string;
  column_id: string;
  option_id: string | null;
  value: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type JobColumnValueGetOutput = Selectable<JobColumnValueTable>;
export type JobColumnValueCreateInput = Insertable<JobColumnValueTable>;
export type JobColumnValueUpdateInput = Updateable<JobColumnValueTable>;

export type JobInterviewTable = {
  id: Generated<string>;
  job_id: string;
  type: string;
  scheduled_at: ColumnType<Date, Date | string | undefined, Date | string>;
  duration_mins: Generated<number>;
  location: string | null;
  meeting_url: string | null;
  notes: string | null;
  outcome: Generated<InterviewOutcome>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type JobInterviewGetOutput = Selectable<JobInterviewTable>;
export type JobInterviewCreateInput = Insertable<JobInterviewTable>;
export type JobInterviewUpdateInput = Updateable<JobInterviewTable>;

export type UserTable = {
  id: Generated<string>;
  email: string;
  first_name: string;
  last_name: string;
  avatar_id: string | null;
  password: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type UserGetOutput = Selectable<UserTable>;
export type UserCreateInput = Insertable<UserTable>;
export type UserUpdateInput = Updateable<UserTable>;

export type UserPreferencesTable = {
  id: Generated<string>;
  user_id: string;
  preferences: Generated<Record<string, any>>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type UserPreferencesGetOutput = Selectable<UserPreferencesTable>;
export type UserPreferencesCreateInput = Insertable<UserPreferencesTable>;
export type UserPreferencesUpdateInput = Updateable<UserPreferencesTable>;

export type UserAuthProviderTable = {
  id: Generated<string>;
  user_id: string;
  provider: UserProvider;
  provider_id: string;
  provider_email: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type UserAuthProviderGetOutput = Selectable<UserAuthProviderTable>;
export type UserAuthProviderCreateInput = Insertable<UserAuthProviderTable>;
export type UserAuthProviderUpdateInput = Updateable<UserAuthProviderTable>;

export type DB = {
  job_stages: JobStageTable;
  job_applications: JobApplicationTable;
  job_column_definitions: JobColumnDefinitionTable;
  job_column_options: JobColumnOptionTable;
  job_column_values: JobColumnValueTable;
  job_interviews: JobInterviewTable;
  users: UserTable;
  user_preferences: UserPreferencesTable;
  user_auth_providers: UserAuthProviderTable;
};
