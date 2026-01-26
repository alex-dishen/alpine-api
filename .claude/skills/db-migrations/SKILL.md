---
name: db-migrations
description: Guides Prisma migrations with required database comments. Use when creating migrations, adding tables/columns, or working with Prisma schema changes.
---

Prisma does not support adding comments in the schema file. After creating any migration, **manually add SQL comments** before applying.

## Workflow

1. Create migration (don't apply): `npx prisma migrate dev --name <name> --create-only`
2. Edit `prisma/migrations/<timestamp>_<name>/migration.sql`
3. Add comments for all new tables, columns, and enums:
   - `COMMENT ON TABLE "table_name" IS 'Description';`
   - `COMMENT ON COLUMN "table_name"."column_name" IS 'Description';`
   - `COMMENT ON TYPE "EnumName" IS 'Description';`
4. Apply: `npx prisma migrate deploy`

## Guidelines

- Every table/column must have a comment
- Be concise but include business context
- For foreign keys, mention what they reference
