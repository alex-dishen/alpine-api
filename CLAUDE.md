# Alpine API

NestJS backend with Kysely queries, Prisma schema/migrations, and Redis.

## Commands

```bash
npm run start:dev        # Start dev server (port 3001)
npm run build            # Production build
npm run test             # Unit tests (Vitest)
npx prisma migrate dev   # Run migrations
npx prisma studio        # Database GUI
```

## Infrastructure

```bash
docker compose up -d     # Start PostgreSQL + Redis
docker compose down      # Stop services
```

## Code Patterns

- **Prisma for schema only** — Migrations and schema definition
- **Kysely for queries** — All runtime database queries
- **Layered architecture** — Controller → Service → Repository

## Structure

```
src/
├── api/[feature]/       # Domain modules (auth, user, etc.)
│   ├── feature.controller.ts
│   ├── feature.service.ts
│   ├── feature.repository.ts
│   └── dto/
├── db/                  # Database config, Kysely types
├── shared/              # Decorators, guards, utils, services
└── redis/               # Redis config
```

## Module Pattern

```typescript
// Controller: HTTP layer, validation
// Service: Business logic
// Repository: Data access (Kysely queries)
```

## Database

- **Migrations**: Use `/db-migrations` skill — always add SQL comments
- **Types**: Auto-generated in `src/db/types/` from Prisma schema

## API Endpoints

```
POST /api/auth/sign-in
POST /api/auth/sign-up
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/google
GET  /api/auth/callback/google
GET  /api/users/current
```

## Naming

- Domain folders: singular (`auth/`, `user/`)
- Class names: singular (`UserService`, not `UsersService`)
- Files: kebab-case with suffix (`user.service.ts`)

See @docs/NAMING_CONVENTIONS.md for full details.

## Testing

```bash
npm run test -- parse-duration   # Run specific test
npm run test:watch               # Watch mode
```
