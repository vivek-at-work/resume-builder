# Docker Setup Guide

This guide explains how to run the Resume Builder application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Development Mode

1. **Create a `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **Update `.env`** with your actual credentials:
   - Clerk publishable and secret keys
   - OpenAI API key
   - PostgreSQL password (optional, defaults to `dev_password`)

3. **Start the development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Access the application**:
   - App: http://localhost:3000
   - Database: localhost:5432

### Production Mode

1. **Create a `.env` file** with production credentials

2. **Start the production environment**:
   ```bash
   docker-compose up --build
   ```

3. **Run database migrations** (first time only):
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

## Available Commands

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start in detached mode (background)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker-compose.dev.yml down -v
```

### Production

```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

### Database Operations

```bash
# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# Generate Prisma Client
docker-compose exec app npx prisma generate

# Open Prisma Studio
docker-compose exec app npx prisma studio
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `DATABASE_URL` - PostgreSQL connection string (auto-configured in Docker)
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `POSTGRES_PASSWORD` - PostgreSQL password (optional, has defaults)

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use:

1. Stop the conflicting service, or
2. Modify ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Change host port
   ```

### Database Connection Issues

1. Ensure PostgreSQL container is healthy:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

### Prisma Migration Issues

If migrations fail:

```bash
# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d postgres
docker-compose exec app npx prisma db push
```

### Rebuild After Code Changes

Development mode has hot-reload enabled. For production:

```bash
docker-compose up --build -d
```

## File Structure

```
.
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Production compose file
├── docker-compose.dev.yml  # Development compose file
├── .dockerignore          # Files excluded from Docker build
└── .env.example           # Environment variables template
```

## Volumes

- `postgres_data` - Persistent PostgreSQL data (production)
- `postgres_dev_data` - Persistent PostgreSQL data (development)

Data persists between container restarts. To reset:

```bash
docker-compose down -v
```

