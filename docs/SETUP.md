# Alpine API Setup Guide

## Prerequisites

- Node.js v22.14.0
- Docker and Docker Compose

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/alex-dishen/alpine-api.git
   cd alpine-api
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   NODE_ENV='local'

   PORT=3001

   DATABASE_URL=postgresql://postgres:postgres@localhost:55001/alpine

   # Redis
   REDISHOST=localhost
   REDISPORT=6379
   REDISPASSWORD=

   # Auth
   ACCESS_TOKEN_SECRET=<random-string>
   COOKIE_SECRET=<random-string>
   REFRESH_TOKEN_SECRET=<random-string>
   ACCESS_TOKEN_EXPIRY_TIME=1h
   REFRESH_TOKEN_EXPIRY_TIME=60d

   CORS_ORIGIN=http://localhost:5173

   # LLM
   GEMINI_API_KEY=<your-gemini-api-key>

   # OAuth (Google)
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>

   # AWS
   AWS_REGION=<your-aws-region>
   AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
   AWS_S3_BUCKET=<your-s3-bucket-name>
   ```

4. Start Docker services

   ```bash
   docker compose up -d
   ```

   This starts:
   - PostgreSQL (port 55001)
   - Redis (port 6379)

5. Run database migrations

   ```bash
   npx prisma migrate dev
   ```

6. Start the application

   ```bash
   npm run start:dev
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:debug` | Start in debug mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests |
| `npm run test:e2e` | Run end-to-end tests |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (`local`, `dev`, `stage`, `prod`) | Yes |
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDISHOST` | Redis host | Yes |
| `REDISPORT` | Redis port | Yes |
| `REDISPASSWORD` | Redis password | Yes |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes |
| `COOKIE_SECRET` | Cookie signing secret | Yes |
| `ACCESS_TOKEN_EXPIRY_TIME` | Access token TTL (e.g., `1h`) | Yes |
| `REFRESH_TOKEN_EXPIRY_TIME` | Refresh token TTL (e.g., `60d`) | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `AWS_REGION` | AWS region (e.g., `us-east-1`) | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key ID | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | Yes |
| `AWS_S3_BUCKET` | AWS S3 bucket name | Yes |

## Database Migrations

### Create and apply a migration

```bash
npx prisma migrate dev
```

### Create migration without applying

```bash
npx prisma migrate dev --create-only
```

### Apply pending migrations

```bash
npx prisma migrate deploy
```

## API Documentation

Swagger/OpenAPI documentation is available at:

```
http://localhost:3001/api
```

> Note: API documentation is disabled in production.

## Pre-commit Hooks

The following checks run on every commit:

1. **TypeScript** - Type checking
2. **Prettier** - Code formatting
3. **ESLint** - Code linting
4. **Madge** - Circular dependency detection
