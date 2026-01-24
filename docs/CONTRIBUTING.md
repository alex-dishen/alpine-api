# Contributing to Alpine API

## Code Standards

### TypeScript

- Strict mode is enabled
- Prefer explicit return types on exported functions
- Use `type` imports for type-only imports
- Avoid `any` - use `unknown` if type is truly unknown

### NestJS

- Follow the module-controller-service-repository pattern
- Use dependency injection for all services
- Validate all input with class-validator decorators
- Document endpoints with Swagger decorators

### Database

- Use Prisma for schema and migrations only
- Use Kysely for all runtime queries
- Wrap related operations in transactions
- Never expose raw database entities - use DTOs

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

Example: `feature/job-applications-api`

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

Example: `feat(auth): add LinkedIn OAuth provider`

## Pull Request Process

1. Ensure all checks pass (lint, type check, tests)
2. Update documentation if needed
3. Add/update Swagger documentation for new endpoints
4. Request review from at least one team member
5. Squash and merge after approval

## Testing

- Write unit tests for services
- Write integration tests for controllers
- Mock external dependencies (database, Redis, external APIs)
- Use descriptive test names

### Test File Location

Co-locate tests with source files:

```
api/
└── auth/
    ├── auth.service.ts
    ├── auth.service.spec.ts
    ├── auth.controller.ts
    └── auth.controller.spec.ts
```

## Adding New Features

1. Create a new module in `src/api/`
2. Follow the naming conventions (see [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md))
3. Add DTOs with validation decorators
4. Add Swagger documentation
5. Add repository for data access
6. Register module in `app.module.ts`
7. Add tests

## API Design

### Endpoints

- Use RESTful conventions
- Use plural nouns for resources (`/users`, `/jobs`)
- Use HTTP methods appropriately (GET, POST, PUT, PATCH, DELETE)
- Return appropriate status codes

### Response Format

```typescript
// Success
{
  "data": { ... }
}

// Error
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}

// Paginated
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Validation

Use class-validator decorators:

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  first_name: string;

  @IsStrongPassword()
  password: string;
}
```
