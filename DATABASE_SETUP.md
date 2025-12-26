# PostgreSQL Database Setup

## Prerequisites
- PostgreSQL installed and running
- Access to PostgreSQL superuser (usually `postgres`)

## Quick Setup

### Option 1: Using SQL Script

1. Edit `setup-database.sql` and change `'your_password'` to your desired password
2. Run the script:
   ```bash
   psql -U postgres -f setup-database.sql
   ```

### Option 2: Manual Setup via psql

1. Connect to PostgreSQL as superuser:
   ```bash
   psql -U postgres
   ```

2. Run these commands:
   ```sql
   CREATE DATABASE resume_builder;
   CREATE USER resume_builder_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE resume_builder TO resume_builder_user;
   \c resume_builder
   GRANT ALL ON SCHEMA public TO resume_builder_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resume_builder_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resume_builder_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO resume_builder_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO resume_builder_user;
   ```

### Option 3: Using Docker (Recommended for Development)

```bash
docker run --name resume-builder-db \
  -e POSTGRES_USER=resume_builder_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e POSTGRES_DB=resume_builder \
  -p 5432:5432 \
  -d postgres:16
```

## Update .env File

After creating the database, update your `.env` file with the connection string:

```env
DATABASE_URL="postgresql://resume_builder_user:your_secure_password@localhost:5432/resume_builder?schema=public"
```

## Run Prisma Migrations

After setting up the database:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or run migrations
npm run db:migrate
```

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=[schema]
```

Example:
```
postgresql://resume_builder_user:mypassword@localhost:5432/resume_builder?schema=public
```

## Troubleshooting

- **Connection refused**: Make sure PostgreSQL is running
- **Authentication failed**: Check username and password
- **Database does not exist**: Run the setup script first
- **Permission denied**: Ensure the user has proper privileges

