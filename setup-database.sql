-- PostgreSQL Database Setup Script
-- Run this script as a PostgreSQL superuser (usually 'postgres')
-- Usage: psql -U postgres -f setup-database.sql

-- Create database
CREATE DATABASE resume_builder;

-- Create user (change 'your_password' to a secure password)
CREATE USER resume_builder_user WITH PASSWORD 'your_password';

-- Grant privileges on the database
GRANT ALL PRIVILEGES ON DATABASE resume_builder TO resume_builder_user;

-- Connect to the database
\c resume_builder

-- Grant schema privileges (for Prisma migrations)
GRANT ALL ON SCHEMA public TO resume_builder_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resume_builder_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resume_builder_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO resume_builder_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO resume_builder_user;

-- Verify the setup
\du resume_builder_user
\l resume_builder

