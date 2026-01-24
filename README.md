# Alpine Api

## 🚨 The most important information

- pre-checks for the script `start` is turned off for the sake of hosting on railway

<br/>

A NestJS-based server application using Prisma for migrations management, Redis for caching and Kysely for database management.

## Prerequisites

- Node.js v22.14.0

<br/>

## Project Setup

1. Clone the repository

   ```bash
   git clone https://github.com/alex-dishen/alpine-api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   NODE_ENV='local'

   PORT=3001

   REDIS_URL= redis://localhost:6379
   DATABASE_URL=postgresql://postgres:postgres@localhost:55001/alpine

   ACCESS_TOKEN_SECRET=provide your own secret, can be a random string
   COOKIE_SECRET=provide your own secret, can be a random string
   REFRESH_TOKEN_SECRET=provide your own secret, can be a random string

   CORS_ORIGIN=...

   ACCESS_TOKEN_EXPIRY_TIME=provide your own time like 2h or 30m
   REFRESH_TOKEN_EXPIRY_TIME=provide your own time like 2h or 30m
   ```

4. The project uses Docker Compose to run the required services. To start them run the following command in the project directory:

   ```bash
   docker compose up -d
   ```

   This will start:

   - PostgreSQL (port 55001)
   - Redis (port 6379)

5. Migrate your running database:

   ```bash
   npx prisma migrate dev
   ```

6. Starting the Application

   ```bash
   # Development mode
   npm run start:dev

   # Debug mode
   npm run start:debug
   ```

   The application will run pre-checks before starting to ensure all requirements are met.

<br/>

## Database Migration

1. Make a change in `schema.prisma` file

2. Migrate the db based on your changes

   ```bash
   npx prisma migrate dev
   ```

If you want to first generate the file and take a look at what will be applied during migration, you can follow these steps:

1. Make a change in `schema.prisma` file

2. Create a migration file

   ```bash
   npx prisma migrate dev --create-only
   ```

3. Migrate the db

   ```bash
   npx prisma migrate dev
   ```

<br/>

## API Documentation

> 💡 API documentation is not available in production

Swagger/OpenAPI documentation can be accessed at `http://localhost:3001/api`
