-- CreateEnum
CREATE TYPE "JobStageCategory" AS ENUM ('initial', 'interview', 'positive', 'negative');

-- CreateEnum
CREATE TYPE "JobColumnType" AS ENUM ('text', 'number', 'date', 'url', 'checkbox', 'select', 'multi_select');

-- CreateEnum
CREATE TYPE "InterviewOutcome" AS ENUM ('pending', 'passed', 'failed', 'canceled');

-- CreateTable
CREATE TABLE "job_stages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "category" "JobStageCategory" NOT NULL DEFAULT 'initial',
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "job_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "stage_id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "job_description" TEXT,
    "notes" TEXT,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_column_definitions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "column_type" "JobColumnType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "job_column_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_column_options" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "column_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "job_column_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_column_values" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "column_id" UUID NOT NULL,
    "option_id" UUID,
    "value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "job_column_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_interviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "duration_mins" INTEGER NOT NULL DEFAULT 60,
    "location" TEXT,
    "meeting_url" TEXT,
    "notes" TEXT,
    "outcome" "InterviewOutcome" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "job_interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_stages_user_id_name_key" ON "job_stages"("user_id", "name");

-- CreateIndex
CREATE INDEX "job_applications_user_id_is_archived_idx" ON "job_applications"("user_id", "is_archived");

-- CreateIndex
CREATE INDEX "job_applications_user_id_stage_id_idx" ON "job_applications"("user_id", "stage_id");

-- CreateIndex
CREATE INDEX "job_applications_user_id_company_name_idx" ON "job_applications"("user_id", "company_name");

-- CreateIndex
CREATE UNIQUE INDEX "job_column_definitions_user_id_name_key" ON "job_column_definitions"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "job_column_options_column_id_label_key" ON "job_column_options"("column_id", "label");

-- CreateIndex
CREATE INDEX "job_column_values_job_id_idx" ON "job_column_values"("job_id");

-- CreateIndex
CREATE INDEX "job_column_values_column_id_option_id_idx" ON "job_column_values"("column_id", "option_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_column_values_job_id_column_id_option_id_key" ON "job_column_values"("job_id", "column_id", "option_id");

-- CreateIndex
CREATE INDEX "job_interviews_job_id_idx" ON "job_interviews"("job_id");

-- CreateIndex
CREATE INDEX "job_interviews_scheduled_at_idx" ON "job_interviews"("scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "job_stages" ADD CONSTRAINT "job_stages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "job_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_column_definitions" ADD CONSTRAINT "job_column_definitions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_column_options" ADD CONSTRAINT "job_column_options_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "job_column_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_column_values" ADD CONSTRAINT "job_column_values_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_column_values" ADD CONSTRAINT "job_column_values_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "job_column_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_column_values" ADD CONSTRAINT "job_column_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "job_column_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_interviews" ADD CONSTRAINT "job_interviews_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for Enums
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TYPE "JobStageCategory" IS 'Groups stages in kanban view: initial, interview, positive, negative';
COMMENT ON TYPE "JobColumnType" IS 'Data types for custom columns: text, number, date, url, checkbox, select, multi_select';
COMMENT ON TYPE "InterviewOutcome" IS 'Interview results: pending, passed, failed, canceled';

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for job_stages table
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE "job_stages" IS 'Job tracking stages for organizing applications (e.g., Applied, Interview, Offered)';
COMMENT ON COLUMN "job_stages"."id" IS 'Unique identifier for the stage';
COMMENT ON COLUMN "job_stages"."user_id" IS 'References users.id - owner of this stage';
COMMENT ON COLUMN "job_stages"."name" IS 'Display name of the stage';
COMMENT ON COLUMN "job_stages"."color" IS 'Hex color code for UI display';
COMMENT ON COLUMN "job_stages"."category" IS 'Category grouping for kanban view: initial, interview, positive, negative';
COMMENT ON COLUMN "job_stages"."position" IS 'Sort order within the category';
COMMENT ON COLUMN "job_stages"."created_at" IS 'Timestamp when the stage was created';
COMMENT ON COLUMN "job_stages"."updated_at" IS 'Timestamp when the stage was last updated';

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for job_applications table
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE "job_applications" IS 'Job application records tracking companies and positions applied to';
COMMENT ON COLUMN "job_applications"."id" IS 'Unique identifier for the job application';
COMMENT ON COLUMN "job_applications"."user_id" IS 'References users.id - owner of this application';
COMMENT ON COLUMN "job_applications"."stage_id" IS 'References job_stages.id - current stage in the application process';
COMMENT ON COLUMN "job_applications"."company_name" IS 'Name of the company being applied to';
COMMENT ON COLUMN "job_applications"."job_title" IS 'Title of the position being applied for';
COMMENT ON COLUMN "job_applications"."salary_min" IS 'Minimum salary range for the position';
COMMENT ON COLUMN "job_applications"."salary_max" IS 'Maximum salary range for the position';
COMMENT ON COLUMN "job_applications"."job_description" IS 'Original job posting content from job board or recruiter';
COMMENT ON COLUMN "job_applications"."notes" IS 'Free-form notes about the application';
COMMENT ON COLUMN "job_applications"."applied_at" IS 'Date when the application was submitted';
COMMENT ON COLUMN "job_applications"."is_archived" IS 'Soft delete flag - archived applications hidden from default views';
COMMENT ON COLUMN "job_applications"."archived_at" IS 'Timestamp when the application was archived';
COMMENT ON COLUMN "job_applications"."created_at" IS 'Timestamp when the record was created';
COMMENT ON COLUMN "job_applications"."updated_at" IS 'Timestamp when the record was last updated';

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for job_column_definitions table
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE "job_column_definitions" IS 'Custom column definitions for extending job application data';
COMMENT ON COLUMN "job_column_definitions"."id" IS 'Unique identifier for the column definition';
COMMENT ON COLUMN "job_column_definitions"."user_id" IS 'References users.id - owner of this column';
COMMENT ON COLUMN "job_column_definitions"."name" IS 'Display name shown in table header';
COMMENT ON COLUMN "job_column_definitions"."column_type" IS 'Data type: text, number, date, url, checkbox, select, multi_select';
COMMENT ON COLUMN "job_column_definitions"."created_at" IS 'Timestamp when the column was created';
COMMENT ON COLUMN "job_column_definitions"."updated_at" IS 'Timestamp when the column was last updated';

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for job_column_options table
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE "job_column_options" IS 'Selectable options for SELECT and MULTI_SELECT column types';
COMMENT ON COLUMN "job_column_options"."id" IS 'Unique identifier for the option';
COMMENT ON COLUMN "job_column_options"."column_id" IS 'References job_column_definitions.id - parent column';
COMMENT ON COLUMN "job_column_options"."label" IS 'Display text for the option';
COMMENT ON COLUMN "job_column_options"."color" IS 'Hex color code for UI display (tags, badges)';
COMMENT ON COLUMN "job_column_options"."position" IS 'Sort order within the column options dropdown';
COMMENT ON COLUMN "job_column_options"."created_at" IS 'Timestamp when the option was created';
COMMENT ON COLUMN "job_column_options"."updated_at" IS 'Timestamp when the option was last updated';

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for job_column_values table
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE "job_column_values" IS 'Stores values for custom columns on job applications';
COMMENT ON COLUMN "job_column_values"."id" IS 'Unique identifier for the value record';
COMMENT ON COLUMN "job_column_values"."job_id" IS 'References job_applications.id - job this value belongs to';
COMMENT ON COLUMN "job_column_values"."column_id" IS 'References job_column_definitions.id - column definition';
COMMENT ON COLUMN "job_column_values"."option_id" IS 'References job_column_options.id - for SELECT/MULTI_SELECT types only';
COMMENT ON COLUMN "job_column_values"."value" IS 'Text value storage for TEXT, NUMBER, DATE, URL, CHECKBOX types';
COMMENT ON COLUMN "job_column_values"."created_at" IS 'Timestamp when the value was created';
COMMENT ON COLUMN "job_column_values"."updated_at" IS 'Timestamp when the value was last updated';

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for job_interviews table
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE "job_interviews" IS 'Interview records for job applications';
COMMENT ON COLUMN "job_interviews"."id" IS 'Unique identifier for the interview';
COMMENT ON COLUMN "job_interviews"."job_id" IS 'References job_applications.id - related job application';
COMMENT ON COLUMN "job_interviews"."type" IS 'Interview type (e.g., Phone Screen, Technical, Cultural Fit)';
COMMENT ON COLUMN "job_interviews"."scheduled_at" IS 'Date and time of the interview';
COMMENT ON COLUMN "job_interviews"."duration_mins" IS 'Expected duration in minutes';
COMMENT ON COLUMN "job_interviews"."location" IS 'Physical location or video call indicator';
COMMENT ON COLUMN "job_interviews"."meeting_url" IS 'Video conference URL if applicable';
COMMENT ON COLUMN "job_interviews"."notes" IS 'Preparation notes or post-interview feedback';
COMMENT ON COLUMN "job_interviews"."outcome" IS 'Interview result: pending, passed, failed, canceled';
COMMENT ON COLUMN "job_interviews"."created_at" IS 'Timestamp when the interview was created';
COMMENT ON COLUMN "job_interviews"."updated_at" IS 'Timestamp when the interview was last updated';

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for user_preferences table
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE "user_preferences" IS 'User-specific application settings and preferences';
COMMENT ON COLUMN "user_preferences"."id" IS 'Unique identifier for the preferences record';
COMMENT ON COLUMN "user_preferences"."user_id" IS 'References users.id - user these preferences belong to';
COMMENT ON COLUMN "user_preferences"."preferences" IS 'JSON object containing user settings (view preferences, filters, etc.)';
COMMENT ON COLUMN "user_preferences"."created_at" IS 'Timestamp when preferences were created';
COMMENT ON COLUMN "user_preferences"."updated_at" IS 'Timestamp when preferences were last updated';
