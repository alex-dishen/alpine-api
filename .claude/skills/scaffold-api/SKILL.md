---
name: scaffold-api
description: Scaffold NestJS module structure for alpine-api following project patterns. Use when user asks to "create a module", "scaffold API", "add new feature", "create endpoint", or needs to set up a new domain/resource in the API.
---

# Scaffold API

Generate NestJS module structure following alpine-api patterns.

## Layer Responsibilities

| Layer | Responsibility | Returns |
|-------|---------------|---------|
| Controller | HTTP, validation | `MessageDto` for writes, DTOs for reads |
| Service | Business logic, ownership verification, orchestration, calls mappers | `void` for writes, DTOs for reads |
| Repository | Data access (Kysely queries) - "dumb", no business logic, no mapping | `void` for writes, flat data for reads |
| Mapper | Transform flat repository data to response DTOs | Response DTOs |

## Module Structure

```
src/api/{feature}/
├── {feature}.controller.ts
├── {feature}.service.ts
├── {feature}.repository.ts
├── dto/
│   └── {feature}.dto.ts
├── mappers/
│   └── {feature}.mapper.ts
└── types/
    ├── {feature}.types.ts           # Service-level types
    └── {feature}.repository.types.ts # Flat types for repository returns
```

## Templates

### Controller

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { {Feature}Service } from './{feature}.service';
import { Create{Feature}Dto, Update{Feature}Dto, {Feature}ResponseDto } from './dto/{feature}.dto';

@ApiTags('{Features}')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('{features}')
export class {Feature}Controller {
  constructor(private {feature}Service: {Feature}Service) {}

  @ApiOperation({ summary: 'List {features}' })
  @ApiResponse({ status: 200, type: [{Feature}ResponseDto] })
  @Get()
  async list(@GetUser('sub') userId: string): Promise<{Feature}ResponseDto[]> {
    return this.{feature}Service.findMany(userId);
  }

  @ApiOperation({ summary: 'Create {feature}' })
  @ApiResponse({ status: 201, type: MessageDto })
  @Post()
  async create(@GetUser('sub') userId: string, @Body() data: Create{Feature}Dto): Promise<MessageDto> {
    await this.{feature}Service.create(userId, data);
    return { message: '{Feature} created successfully' };
  }

  @ApiOperation({ summary: 'Update {feature}' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Put(':id')
  async update(
    @GetUser('sub') userId: string,
    @Param('id') id: string,
    @Body() data: Update{Feature}Dto,
  ): Promise<MessageDto> {
    await this.{feature}Service.update(id, userId, data);
    return { message: '{Feature} updated successfully' };
  }

  @ApiOperation({ summary: 'Delete {feature}' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<MessageDto> {
    await this.{feature}Service.delete(id);
    return { message: '{Feature} deleted successfully' };
  }
}
```

### Service

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { {Feature}Repository } from './{feature}.repository';
import { {Feature}Mapper } from './mappers/{feature}.mapper';
import { Create{Feature}Dto, Update{Feature}Dto, {Feature}ResponseDto } from './dto/{feature}.dto';

@Injectable()
export class {Feature}Service {
  constructor(private {feature}Repository: {Feature}Repository) {}

  async findMany(userId: string): Promise<{Feature}ResponseDto[]> {
    const items = await this.{feature}Repository.findByUserId(userId);
    return {Feature}Mapper.toResponseDtoList(items);
  }

  async create(userId: string, data: Create{Feature}Dto): Promise<void> {
    await this.{feature}Repository.create({
      id: data.id,
      user_id: userId,
      name: data.name,
    });
  }

  async update(id: string, userId: string, data: Update{Feature}Dto): Promise<void> {
    const item = await this.{feature}Repository.findById(id);

    if (!item || item.user_id !== userId) {
      throw new NotFoundException('{Feature} not found');
    }

    await this.{feature}Repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const item = await this.{feature}Repository.findById(id);

    if (!item) {
      throw new NotFoundException('{Feature} not found');
    }

    await this.{feature}Repository.delete(id);
  }
}
```

### Repository

Repositories return flat data structures - no nesting or mapping.

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type { {Feature}GetOutput, {Feature}CreateInput, {Feature}UpdateInput } from 'src/db/types/db.types';

@Injectable()
export class {Feature}Repository {
  constructor(private kysely: DatabaseService) {}

  async findByUserId(userId: string): Promise<{Feature}GetOutput[]> {
    return this.kysely.db
      .selectFrom('{table_name}')
      .where('user_id', '=', userId)
      .selectAll()
      .execute();
  }

  async findById(id: string): Promise<{Feature}GetOutput | undefined> {
    return this.kysely.db
      .selectFrom('{table_name}')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async create(data: {Feature}CreateInput): Promise<void> {
    await this.kysely.db.insertInto('{table_name}').values(data).execute();
  }

  async update(id: string, data: {Feature}UpdateInput): Promise<void> {
    await this.kysely.db
      .updateTable('{table_name}')
      .set({ ...data, updated_at: new Date() })
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.kysely.db.deleteFrom('{table_name}').where('id', '=', id).execute();
  }
}
```

### Repository with Joins (returns flat)

For queries with joins, define flat return type and let mapper handle nesting:

```typescript
// types/{feature}.repository.types.ts
export type {Feature}WithRelationRow = {
  id: string;
  name: string;
  created_at: Date;
  // Joined fields use prefixed names
  relation_id: string;
  relation_name: string;
  relation_color: string;
};

// {feature}.repository.ts
async findWithRelation(userId: string): Promise<{Feature}WithRelationRow[]> {
  return this.kysely.db
    .selectFrom('{table_name} as t')
    .innerJoin('relations as r', 'r.id', 't.relation_id')
    .where('t.user_id', '=', userId)
    .select([
      't.id',
      't.name',
      't.created_at',
      'r.id as relation_id',
      'r.name as relation_name',
      'r.color as relation_color',
    ])
    .execute();
}
```

### Mapper

Mappers transform flat repository data to nested response DTOs:

```typescript
import type { {Feature}GetOutput } from 'src/db/types/db.types';
import type { {Feature}WithRelationRow } from '../types/{feature}.repository.types';
import type { {Feature}ResponseDto, {Feature}WithRelationResponseDto } from '../dto/{feature}.dto';

export class {Feature}Mapper {
  static toResponseDto(item: {Feature}GetOutput): {Feature}ResponseDto {
    return {
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      // Explicit field mapping, no spread operators
    };
  }

  static toResponseDtoList(items: {Feature}GetOutput[]): {Feature}ResponseDto[] {
    return items.map(item => this.toResponseDto(item));
  }

  // For joined queries - transform flat to nested
  static toWithRelationResponseDto(row: {Feature}WithRelationRow): {Feature}WithRelationResponseDto {
    return {
      id: row.id,
      name: row.name,
      created_at: row.created_at,
      relation: {
        id: row.relation_id,
        name: row.relation_name,
        color: row.relation_color,
      },
    };
  }

  static toWithRelationResponseDtoList(rows: {Feature}WithRelationRow[]): {Feature}WithRelationResponseDto[] {
    return rows.map(row => this.toWithRelationResponseDto(row));
  }
}
```

### DTOs

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class {Feature}ResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty()
  name: string;
}

export class Create{Feature}Dto {
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(100)
  name: string;
}
```

## Key Patterns

### Repository Returns Flat Data

Repositories NEVER map data to nested structures. All joins return flat rows with prefixed column names. Mapping to nested structures happens in mappers called from services.

### Ownership Verification (Service Layer)

```typescript
const item = await this.repository.findById(id);
if (!item || item.user_id !== userId) {
  throw new NotFoundException('{Feature} not found');
}
```

### Delete Operations - No Ownership Check

```typescript
async delete(id: string): Promise<void> {
  const item = await this.repository.findById(id);
  if (!item) throw new NotFoundException('{Feature} not found');
  await this.repository.delete(id);
}
```

### Client-Generated IDs

Create DTOs include `id` field so clients can generate UUIDs for optimistic updates.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Domain folder | singular | `job/`, `user/` |
| Resource subfolder | plural | `applications/`, `stages/` |
| File name | kebab-case | `job-application.service.ts` |
| Class name | PascalCase, singular | `JobApplicationService` |
| Mapper class | `{Feature}Mapper` | `ApplicationsMapper` |
| Repository types file | `{feature}.repository.types.ts` | `applications.repository.types.ts` |

## Checklist

1. Create module folder under `src/api/`
2. Generate files: controller, service, repository
3. Create `dto/{feature}.dto.ts` with response and input DTOs
4. Create `mappers/{feature}.mapper.ts` with explicit field mapping
5. Create `types/{feature}.repository.types.ts` for flat join return types
6. Ensure repository returns flat data - no nested structures
7. Ensure mappers transform flat to nested in service layer
8. Ensure Create DTO has `id` field for optimistic updates
9. Verify write operations return `void` (service) / `MessageDto` (controller)
