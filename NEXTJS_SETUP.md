# Next.js + Prisma + PostgreSQL Setup

This project uses Next.js with Prisma and PostgreSQL backend.

## Setup Instructions

### 1. Environment Variables

Create/update your `.env` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Database (PostgreSQL)
# For local PostgreSQL:
DATABASE_URL="postgresql://resume_builder_user:your_password@localhost:5432/resume_builder?schema=public"
# Or use Docker PostgreSQL:
# DATABASE_URL="postgresql://resume_builder_user:your_password@localhost:5432/resume_builder?schema=public"

# OpenAI API (for PDF resume parsing)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 2. Database Setup

Run the following commands to set up your database:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or run migrations (alternative)
npm run db:migrate
```

### 3. Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── resumes/       # Resume CRUD endpoints
│   ├── dashboard/         # Protected dashboard page
│   ├── sign-in/           # Sign in page
│   ├── sign-up/           # Sign up page
│   ├── layout.tsx         # Root layout with ClerkProvider
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/
│   ├── prisma.ts          # Prisma client instance
│   └── ...
└── pages/                 # Page components
```

## API Routes

### GET /api/resumes
Get all resumes for the authenticated user

### POST /api/resumes
Create a new resume

### POST /api/resumes/parse-pdf
Parse a PDF resume and extract structured data (requires OpenAI API key)

### GET /api/resumes/[id]
Get a specific resume

### PUT /api/resumes/[id]
Update a resume

### DELETE /api/resumes/[id]
Delete a resume

## Database Schema

- **User**: Stores user information linked to Clerk ID
- **Resume**: Stores resume data with JSON fields for complex data

## Features

✅ Next.js 14+ App Router
✅ Prisma ORM with PostgreSQL
✅ Clerk Authentication
✅ API Routes for CRUD operations
✅ Protected routes with middleware
✅ Server-side rendering
✅ OpenAI-powered PDF resume parsing

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio

