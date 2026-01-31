# Alpine API Architecture

## Folder Structure

```
alpine-api/
├── .husky/              # Git hooks
├── docs/                # Documentation
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── api/             # API modules (domain features)
│   │   ├── auth/        # Authentication module
│   │   └── user/        # User management module
│   ├── db/              # Database configuration
│   │   ├── transactions/    # Transaction management
│   │   └── types/           # Generated Kysely types
│   ├── llm/             # LLM integrations (Gemini)
│   ├── redis/           # Redis configuration
│   ├── shared/          # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── dtos/            # Shared DTOs
│   │   ├── enums/           # Shared enums
│   │   ├── guards/          # Auth guards
│   │   ├── services/        # Shared services (AWS, Config)
│   │   └── utils/           # Utility functions
│   ├── app.module.ts    # Root application module
│   └── main.ts          # Application entry point
├── husky_utils/         # Pre-commit hook utilities
└── pre-checks/          # Startup validation scripts
```

## Architecture Patterns

### Module Structure

Each API module follows a consistent NestJS pattern:

```
api/
└── feature/
    ├── feature.module.ts       # Module definition
    ├── feature.controller.ts   # HTTP endpoints
    ├── feature.service.ts      # Business logic
    ├── feature.repository.ts   # Data access layer
    ├── dto/                    # Data Transfer Objects
    │   ├── create-feature.dto.ts
    │   └── update-feature.dto.ts
    ├── mappers/                # Flat-to-nested transformations
    │   └── feature.mapper.ts
    ├── types/                  # Type definitions
    │   └── feature.repository.types.ts  # Flat types for joins
    └── strategies/             # Strategy pattern implementations (if needed)
```

### Complex Module Structure

For modules with dynamic filtering/sorting, add `strategies/` and `registry/` folders:

```
api/
└── feature/
    ├── strategies/             # Filter & sort handlers
    │   ├── feature-filter.strategy.ts
    │   ├── feature-sort.strategy.ts
    │   └── resolvers/
    │       └── feature-query-builder.helper.ts
    └── registry/               # Enums for filters/sorts
        ├── feature-filter.enum.ts
        └── feature-sort.enum.ts
```

### Transaction Management

Use `@Transaction()` decorator on service methods for multi-repository operations:

```typescript
import { Transaction } from 'src/db/transactions/transaction.decorator';

@Injectable()
export class FeatureService {
  @Transaction()
  async createWithRelated(userId: string, data: CreateDto): Promise<void> {
    await this.repository.create({ ... });
    await this.relatedRepository.create({ ... });
    // Both in same transaction - auto-rollback on error
  }
}
```

**How it works:**
- Decorator uses AsyncLocalStorage to track transaction context
- Repositories automatically use active transaction via `DatabaseService.db`
- Propagation: reuses existing transaction if called within one
- Error handling: automatic rollback on any thrown exception

### Layered Architecture

1. **Controller Layer** - Handles HTTP requests, validation, and response formatting
2. **Service Layer** - Contains business logic and orchestration
3. **Repository Layer** - Data access abstraction using Kysely (returns flat data)
4. **Mapper Layer** - Transforms flat repository rows to nested response DTOs

### Mapper Layer

Mappers transform flat repository rows to nested response DTOs. Located in `mappers/{feature}.mapper.ts`.

**Pattern:**
- Repository returns flat rows with aliased joined columns (e.g., `relation_id`, `relation_name`)
- Mapper transforms to nested DTO structure
- Service calls mapper after repository query

```typescript
// Service
const rows = await this.repository.findWithRelation(userId);
return FeatureMapper.toResponseDtoList(rows);

// Mapper
static toResponseDto(row: FeatureWithRelationRow): FeatureResponseDto {
  return {
    id: row.id,
    name: row.name,
    relation: {
      id: row.relation_id,
      name: row.relation_name,
    },
  };
}
```

### Database Stack

- **Prisma** - Schema definition and migrations only
- **Kysely** - Type-safe query builder for runtime queries
- **Redis** - Session management and caching

### Authentication

OAuth strategy pattern supporting multiple providers:

```
auth/
└── strategies/
    ├── oauth-strategy.interface.ts   # Strategy interface
    ├── oauth-strategy.factory.ts     # Factory to get strategy by provider
    ├── google.strategy.ts            # Google OAuth
    ├── linkedin.strategy.ts          # LinkedIn OAuth
    └── apple.strategy.ts             # Apple OAuth
```

## Folder Responsibilities

### `api/` - Domain Modules

Contains feature modules that expose REST endpoints. Each module is self-contained with its own controller, service, and repository.

**What belongs in `api/`:**

- Feature modules (auth, user, jobs, etc.)
- Domain-specific DTOs and types
- Feature-specific business logic

### `shared/` - Cross-cutting Concerns

Contains utilities and services used across multiple modules.

**What belongs in `shared/`:**

- Custom decorators (`@GetUser`, `@Match`, etc.)
- Shared DTOs (pagination, common responses)
- Guards (JWT auth guard)
- Shared services (AWS S3, Config)
- Utility functions

### `db/` - Database Layer

Contains database configuration and type definitions.

**What belongs in `db/`:**

- Database module and service
- Transaction management
- Kysely type definitions (generated from Prisma schema)

## Code Conventions

### File Naming

- Files: `kebab-case` with suffix (`user.service.ts`, `create-user.dto.ts`)
- Classes: `PascalCase` (`UserService`, `CreateUserDto`)

See [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) for detailed naming rules.

### Module Organization

- Domain folders: **singular** (`auth/`, `user/`)
- Resource subfolders: **plural** (`messages/`, `files/`)
- Class names: Always **singular** (`UserService`, not `UsersService`)

### Imports

- Use absolute imports from `src/` (`import { UserService } from 'src/api/user/user.service'`)
- Group imports: external packages first, then internal modules
