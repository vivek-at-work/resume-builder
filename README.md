# Resume Builder

A modern, ATS-friendly resume builder application built with Next.js, TypeScript, Tailwind CSS, Prisma, Clerk Auth, and AI-powered features.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Clerk** - Authentication
- **OpenAI** - AI-powered resume parsing and improvements
- **Docker** - Containerization

## Getting Started

### Option 1: Docker (Recommended)

#### Prerequisites
- Docker Desktop installed and running

#### Quick Start

1. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **Update `.env`** with your credentials:
   - Clerk publishable and secret keys
   - OpenAI API key
   - PostgreSQL password

3. **Start development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Access the application**:
   - App: http://localhost:3000
   - Database: localhost:5432

For production:
```bash
docker-compose up --build
```

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

### Option 2: Local Development

#### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

#### Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up database**:
   ```bash
   # Create PostgreSQL database (see DATABASE_SETUP.md)
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - App: http://localhost:3000

### Build

```bash
npm run build
npm start
```

### Preview Production Build

```bash
npm run preview
```

## Adding shadcn/ui Components

To add shadcn/ui components to your project:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## Project Structure

```
src/
├── components/     # React components (shadcn/ui components will be added here)
├── lib/
│   └── utils.ts   # Utility functions (cn helper for className merging)
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Path Aliases

The project uses path aliases for cleaner imports:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

Example:
```tsx
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
