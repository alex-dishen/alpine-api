export enum JobApplicationSortByEnum {
  // Existing
  Stage = 'stage',
  Category = 'category',
  IsArchived = 'is_archived',
  // Core fields
  CompanyName = 'company_name',
  JobTitle = 'job_title',
  AppliedAt = 'applied_at',
  SalaryMin = 'salary_min',
  SalaryMax = 'salary_max',
  CreatedAt = 'created_at',
  // Dynamic - for custom columns
  CustomColumn = 'custom_column',
}
