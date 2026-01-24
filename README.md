# Alpine API

Welcome to the Alpine API repository. This is a NestJS server application providing the backend for the Alpine job search assistance tool, featuring authentication, user management, and AI-powered features.

## Documentation

This repository contains comprehensive documentation to help you understand and work with the project:

- **[Architecture](docs/ARCHITECTURE.md)** - Detailed explanation of the application architecture, folder structure, and patterns
- **[Setup Guide](docs/SETUP.md)** - Step-by-step installation and development environment setup instructions
- **[Contributing](docs/CONTRIBUTING.md)** - Code standards, git workflow, and pull request guidelines
- **[Naming Conventions](docs/NAMING_CONVENTIONS.md)** - File and folder naming standards

## Quick Start

```bash
# Install dependencies
npm install

# Start Docker services (PostgreSQL, Redis)
docker compose up -d

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | NestJS + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma (migrations) + Kysely (queries) |
| Cache | Redis |
| Auth | JWT + OAuth (Google, LinkedIn, Apple) |
| Validation | class-validator |
| Documentation | Swagger/OpenAPI |
| LLM | Google Gemini |
| Storage | AWS S3 |
| Linting | ESLint + Prettier |
| Git Hooks | Husky |
