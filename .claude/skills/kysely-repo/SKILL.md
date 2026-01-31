---
name: kysely-repo
description: Generate Kysely repository methods for alpine-api following project patterns. Use when user asks to "add repository method", "create CRUD", "generate Kysely query", "implement findMany", "add cursor pagination", or needs database query logic.
---

# Kysely Repository

Generate type-safe Kysely repository methods. Repositories are "dumb" - no business logic, no mapping, just data access.

## Type Conventions

Types are auto-generated in `src/db/types/db.types.ts` from Prisma schema:

| Type | Purpose |
|------|---------|
| `{Table}GetOutput` | Select result |
| `{Table}CreateInput` | Insert input |
| `{Table}UpdateInput` | Update input |

For joins, define flat return types in `types/{feature}.repository.types.ts`.

## Repository Pattern

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type { {Table}GetOutput, {Table}CreateInput, {Table}UpdateInput } from 'src/db/types/db.types';

@Injectable()
export class {Feature}Repository {
  constructor(private kysely: DatabaseService) {}
}
```

## Query Patterns

### findById (simple - no userId)

```typescript
async findById(id: string): Promise<{Table}GetOutput | undefined> {
  return this.kysely.db
    .selectFrom('{table_name}')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}
```

Ownership verification happens in service layer:
```typescript
// Service layer
const item = await this.repository.findById(id);
if (!item || item.user_id !== userId) {
  throw new NotFoundException('Not found');
}
```

### findByUserId

```typescript
async findByUserId(userId: string): Promise<{Table}GetOutput[]> {
  return this.kysely.db
    .selectFrom('{table_name}')
    .where('user_id', '=', userId)
    .selectAll()
    .execute();
}
```

### findMany with filters

```typescript
async findMany(userId: string, filters: {Table}Filters): Promise<{Table}GetOutput[]> {
  let qb = this.kysely.db
    .selectFrom('{table_name}')
    .where('user_id', '=', userId);

  if (filters.status) {
    qb = qb.where('status', '=', filters.status);
  }
  if (filters.search) {
    qb = qb.where('name', 'ilike', `%${filters.search}%`);
  }

  return qb.selectAll().orderBy('created_at', 'desc').execute();
}
```

### findManyWithCursor

```typescript
import { Pagination } from 'src/db/helpers/pagination.helper';

async findManyWithCursor(userId: string, take: number, cursor?: string | null) {
  const qb = this.kysely.db
    .selectFrom('{table_name}')
    .where('user_id', '=', userId)
    .selectAll();

  return Pagination.cursor(qb, {
    take,
    cursor,
    orderBy: [
      { column: '{table_name}.created_at', selectColumn: 'created_at', direction: 'desc' },
      { column: '{table_name}.id', selectColumn: 'id', direction: 'desc' },
    ],
  });
}
```

### create (returns void)

```typescript
async create(data: {Table}CreateInput): Promise<void> {
  await this.kysely.db.insertInto('{table_name}').values(data).execute();
}
```

### update (returns void)

```typescript
async update(id: string, data: {Table}UpdateInput): Promise<void> {
  await this.kysely.db
    .updateTable('{table_name}')
    .set({ ...data, updated_at: new Date() })
    .where('id', '=', id)
    .execute();
}
```

### delete

```typescript
async delete(id: string): Promise<void> {
  await this.kysely.db.deleteFrom('{table_name}').where('id', '=', id).execute();
}
```

### deleteByParentId (for cascade deletion)

```typescript
async deleteByColumnId(columnId: string): Promise<void> {
  await this.kysely.db
    .deleteFrom('{table_name}')
    .where('column_id', '=', columnId)
    .execute();
}
```

### count

```typescript
async count(userId: string): Promise<number> {
  const result = await this.kysely.db
    .selectFrom('{table_name}')
    .where('user_id', '=', userId)
    .select(eb => eb.fn.countAll<string>().as('count'))
    .executeTakeFirstOrThrow();

  return Number(result.count);
}
```

## Joins - Return Flat Data

Repositories NEVER map to nested structures. Return flat rows with prefixed column names.

### Define Flat Return Type

```typescript
// types/{feature}.repository.types.ts
export type {Feature}WithRelationRow = {
  id: string;
  name: string;
  user_id: string;
  created_at: Date;
  updated_at: Date | null;
  // Joined fields - use descriptive prefixes
  relation_id: string;
  relation_name: string;
  relation_color: string;
};
```

### Inner Join (returns flat)

```typescript
import type { {Feature}WithRelationRow } from './types/{feature}.repository.types';

async findWithRelation(userId: string): Promise<{Feature}WithRelationRow[]> {
  return this.kysely.db
    .selectFrom('{table_name} as t')
    .innerJoin('relations as r', 'r.id', 't.relation_id')
    .where('t.user_id', '=', userId)
    .select([
      't.id',
      't.name',
      't.user_id',
      't.created_at',
      't.updated_at',
      'r.id as relation_id',
      'r.name as relation_name',
      'r.color as relation_color',
    ])
    .execute();
}
```

### Left Join (returns flat with nullable fields)

```typescript
export type {Feature}WithOptionalRelationRow = {
  id: string;
  name: string;
  // Nullable for left joins
  related_id: string | null;
  related_name: string | null;
};

async findWithOptionalRelation(userId: string): Promise<{Feature}WithOptionalRelationRow[]> {
  return this.kysely.db
    .selectFrom('{table_name} as t')
    .leftJoin('related as r', 'r.parent_id', 't.id')
    .where('t.user_id', '=', userId)
    .select([
      't.id',
      't.name',
      'r.id as related_id',
      'r.name as related_name',
    ])
    .execute();
}
```

### Mapping Happens in Service via Mapper

```typescript
// Service calls mapper to transform flat to nested
async findWithRelation(userId: string): Promise<{Feature}WithRelationResponseDto[]> {
  const rows = await this.repository.findWithRelation(userId);
  return {Feature}Mapper.toWithRelationResponseDtoList(rows);
}

// Mapper transforms flat row to nested DTO
static toWithRelationResponseDto(row: {Feature}WithRelationRow): {Feature}WithRelationResponseDto {
  return {
    id: row.id,
    name: row.name,
    relation: {
      id: row.relation_id,
      name: row.relation_name,
      color: row.relation_color,
    },
  };
}
```

## Execution Methods

| Method | Returns | Use When |
|--------|---------|----------|
| `execute()` | `T[]` | Multiple rows |
| `executeTakeFirst()` | `T \| undefined` | 0-1 rows |
| `executeTakeFirstOrThrow()` | `T` | Exactly 1 row (throws if none) |

## Soft Delete

```typescript
async archive(id: string): Promise<void> {
  await this.kysely.db
    .updateTable('{table_name}')
    .set({ is_archived: true, archived_at: new Date() })
    .where('id', '=', id)
    .execute();
}

async findActive(userId: string): Promise<{Table}GetOutput[]> {
  return this.kysely.db
    .selectFrom('{table_name}')
    .where('user_id', '=', userId)
    .where('is_archived', '=', false)
    .selectAll()
    .execute();
}
```

## Advanced Patterns

### Batch Operations

```typescript
async create(data: {Table}CreateInput | {Table}CreateInput[]): Promise<void> {
  if (Array.isArray(data) && data.length === 0) return;
  await this.kysely.db.insertInto('{table_name}').values(data).execute();
}
```

### Upsert Pattern (delete-then-insert)

For replacing values rather than updating:

```typescript
async upsertValue(jobId: string, columnId: string, value: string | null): Promise<void> {
  await this.deleteByJobAndColumn(jobId, columnId);
  if (value === null) return;
  await this.create({ job_id: jobId, column_id: columnId, value });
}
```

### Aggregations with GROUP BY

```typescript
export type {Feature}WithCountRow = {
  id: string;
  name: string;
  count: number;
};

async findWithCount(userId: string): Promise<{Feature}WithCountRow[]> {
  return this.kysely.db
    .selectFrom('{table_name} as t')
    .leftJoin('related as r', join => join.onRef('r.parent_id', '=', 't.id').on('r.is_active', '=', true))
    .where('t.user_id', '=', userId)
    .groupBy('t.id')
    .select(['t.id', 't.name'])
    .select(eb => eb.fn.count<number>('r.id').as('count'))
    .execute();
}
```

### Conditional Joins

Add conditions directly in join clause:

```typescript
.leftJoin('related as r', join =>
  join.onRef('r.parent_id', '=', 't.id')
      .on('r.is_archived', '=', false)
)
```

### Existence Check

```typescript
async hasRelated(parentId: string): Promise<boolean> {
  const result = await this.kysely.db
    .selectFrom('{table_name}')
    .where('parent_id', '=', parentId)
    .select(eb => eb.fn.count<number>('id').as('count'))
    .executeTakeFirst();
  return Number(result?.count ?? 0) > 0;
}
```

## Transactions (@Transaction Decorator)

For multi-repository operations, use `@Transaction()` decorator in the **service layer** (not repository):

```typescript
import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/db/transactions/transaction.decorator';

@Injectable()
export class {Feature}Service {
  constructor(
    private repository: {Feature}Repository,
    private relatedRepository: RelatedRepository,
  ) {}

  @Transaction()
  async createWithRelated(userId: string, data: CreateDto): Promise<void> {
    await this.repository.create({ ... });
    await this.relatedRepository.create({ ... });
    // Both operations in same transaction - auto-rollback on error
  }
}
```

The decorator uses AsyncLocalStorage to track transaction context. Repositories automatically use the active transaction via `DatabaseService.db`.

## Key Principles

1. **Repositories are "dumb"** - no business logic, validation, orchestration, or mapping
2. **Write operations return `void`** - no `returningAll()` for create/update
3. **`findById` takes only `id`** - ownership verification happens in service
4. **Manual cascade deletion** - use `deleteByParentId` methods, no DB cascades
5. **No nested returns** - joins return flat rows; mapping to nested structures happens in mappers
6. **Define flat types** - create `types/{feature}.repository.types.ts` for join return types
7. **Transactions in services** - use `@Transaction()` on service methods, not repositories
