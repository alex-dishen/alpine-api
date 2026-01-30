---
name: db-migrations
description: Guides Prisma migrations with required database comments. Use when creating migrations, adding tables/columns, or working with Prisma schema changes.
---

Prisma does not support adding comments in the schema file. After creating any migration, **manually add SQL comments** before applying.

## Workflow

1. Create migration (don't apply): `npx prisma migrate dev --name <name> --create-only`
2. Edit `prisma/migrations/<timestamp>_<name>/migration.sql`
3. Add comments for **all** new tables, columns, and enums (see SQL Comments section)
4. Apply: `npx prisma migrate deploy`

## Prisma Schema Conventions

### Model Structure

Follow this field ordering pattern:

```prisma
/// Brief model description
model Example {
    id      String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    user_id String @db.Uuid

    name       String
    status     ExampleStatus @default(PENDING) // Brief explanation
    is_active  Boolean       @default(true)    // What this flag means
    created_at DateTime      @default(now())
    updated_at DateTime?     @updatedAt

    user User @relation(fields: [user_id], references: [id], onDelete: Cascade)

    @@map("examples")
}
```

**Field ordering:**
1. `id` field first
2. Foreign key columns (user_id, parent_id, etc.) grouped together
3. Blank line
4. Business fields
5. Timestamp fields (created_at, updated_at)
6. Blank line
7. Relations

### Prisma Comments

In `.prisma` files, **only comment non-obvious fields**:

**Obvious (no comment needed):** `id`, `name`, `label`, `color`, `position`, `notes`, `email`, `created_at`, `updated_at`

**Non-obvious (needs comment):**
- `category` - what it groups/categorizes
- `is_archived` - "Soft delete flag"
- `job_description` - "Original job posting from job board/recruiter"
- `option_id` - "For SELECT/MULTI_SELECT - FK to selected option"
- `value` - "Text value for TEXT, NUMBER, DATE, URL, CHECKBOX types"

Use inline comments with `//` for field explanations.

### Enum Definition Pattern

Always use `@map()` on each enum value to store lowercase in database:

```prisma
enum UserProvider {
    GOOGLE   @map("google")
    LINKEDIN @map("linkedin")
    APPLE    @map("apple")
}
```

- **Enum values**: SCREAMING_CASE in code, lowercase via `@map()` in DB
- **Enum type name**: PascalCase (no `@@map()` needed)

## SQL Comments (Migration Files)

In `.sql` migration files, **every table and column must have a comment** for AI integration:

```sql
COMMENT ON TABLE "examples" IS 'Brief description of what this table stores';
COMMENT ON COLUMN "examples"."id" IS 'Unique identifier';
COMMENT ON COLUMN "examples"."user_id" IS 'References users.id - owner of this record';
COMMENT ON COLUMN "examples"."status" IS 'Current status: pending, active, completed';
```

**Guidelines:**
- Be concise but include business context
- For foreign keys, mention what they reference: `'References users.id - ...'`
- For enums, list possible values: `'Status: pending, active, completed'`
- For boolean flags, explain the meaning: `'Soft delete flag - hidden from default views'`
