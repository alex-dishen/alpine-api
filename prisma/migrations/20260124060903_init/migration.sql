-- CreateEnum
CREATE TYPE "UserProvider" AS ENUM ('google', 'linkedin', 'apple');
COMMENT ON TYPE "UserProvider" IS 'OAuth provider types for user authentication';

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "avatar_id" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Table comments
COMMENT ON TABLE "users" IS 'Core user accounts for the application';

-- Column comments for users
COMMENT ON COLUMN "users"."id" IS 'Unique identifier for the user';
COMMENT ON COLUMN "users"."email" IS 'User email address, used for authentication';
COMMENT ON COLUMN "users"."first_name" IS 'User first name';
COMMENT ON COLUMN "users"."last_name" IS 'User last name';
COMMENT ON COLUMN "users"."avatar_id" IS 'Reference to user avatar image (S3 key or URL)';
COMMENT ON COLUMN "users"."password" IS 'Hashed password, null when user signed up via OAuth';
COMMENT ON COLUMN "users"."created_at" IS 'Timestamp when the user was created';
COMMENT ON COLUMN "users"."updated_at" IS 'Timestamp when the user was last updated';

-- CreateTable
CREATE TABLE "user_auth_providers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "provider" "UserProvider" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_auth_providers_pkey" PRIMARY KEY ("id")
);

-- Table comments
COMMENT ON TABLE "user_auth_providers" IS 'Links users to their OAuth provider accounts';

-- Column comments for user_auth_providers
COMMENT ON COLUMN "user_auth_providers"."id" IS 'Unique identifier for the auth provider link';
COMMENT ON COLUMN "user_auth_providers"."user_id" IS 'Reference to the user';
COMMENT ON COLUMN "user_auth_providers"."provider" IS 'OAuth provider type (google, linkedin, apple)';
COMMENT ON COLUMN "user_auth_providers"."provider_id" IS 'Unique ID from the OAuth provider';
COMMENT ON COLUMN "user_auth_providers"."provider_email" IS 'Email from the OAuth provider (may differ from user email)';
COMMENT ON COLUMN "user_auth_providers"."created_at" IS 'Timestamp when the provider was linked';
COMMENT ON COLUMN "user_auth_providers"."updated_at" IS 'Timestamp when the link was last updated';

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_providers_user_id_provider_key" ON "user_auth_providers"("user_id", "provider");

-- AddForeignKey
ALTER TABLE "user_auth_providers" ADD CONSTRAINT "user_auth_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
