# CMS - Node.js/TypeScript Re-implementation

A Node.js/TypeScript re-implementation of Botble CMS with Next.js 16 App Router and Express.js API.

## Architecture

- **Monorepo**: pnpm workspaces
- **API**: Express.js (TypeScript)
- **Web**: Next.js 16 App Router (TypeScript)
- **Database**: MySQL 8 + Prisma
- **Queue**: MySQL-backed (no Redis required)

## Prerequisites

- Node.js 20.x
- pnpm 8.x
- MySQL 8.0+ (running locally)

## Setup (No Docker Required)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE cms_dev;"

# Copy environment file
cp .env.example .env

# Edit .env and set your DATABASE_URL
# DATABASE_URL="mysql://user:password@localhost:3306/cms_dev"

# Run migrations
pnpm db:migrate

# Generate Prisma client
# Note: If you encounter "pnpm add prisma" errors during generation, try:
# 1. Run from the prisma directory: cd prisma && npx prisma generate
# 2. Or manually: npx prisma generate --schema=prisma/schema.prisma
pnpm db:generate
```

### 3. Seed Database (Optional)

```bash
pnpm --filter '@cms/shared' seed
```

### 4. Start Development

```bash
# Start API and Web in parallel
pnpm dev

# Or separately:
pnpm dev:api    # Express API on :3001
pnpm dev:web    # Next.js on :3000
```

### 5. Start Worker (Separate Terminal)

```bash
pnpm worker
```

### 6. Start Scheduler (Separate Terminal)

```bash
pnpm scheduler
```

## Project Structure

```
cms-expressjs-nextjs2/
├── apps/
│   ├── api/          # Express.js API server
│   └── web/           # Next.js 16 App Router
├── packages/
│   ├── core/          # Core services (Auth, RBAC, Settings, etc.)
│   ├── shared/        # Shared utilities & Prisma client
│   ├── ui/            # Shared UI components
│   └── plugins/       # Plugin packages
├── prisma/
│   └── schema.prisma  # Database schema
└── docs/              # Documentation
```

## Available Scripts

- `pnpm dev` - Start API and Web in parallel
- `pnpm dev:api` - Start API server only
- `pnpm dev:web` - Start Next.js app only
- `pnpm worker` - Start queue worker
- `pnpm scheduler` - Start scheduler
- `pnpm build` - Build all packages
- `pnpm db:migrate` - Run database migrations
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:studio` - Open Prisma Studio
- `pnpm setup:local` - Setup local database (migrate + seed)

## API Endpoints

### Auth
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Languages
- `GET /api/v1/languages` - List languages
- `GET /api/v1/languages/:code` - Get language
- `POST /api/v1/languages` - Create language
- `PUT /api/v1/languages/:code` - Update language
- `DELETE /api/v1/languages/:code` - Delete language

### Slugs
- `POST /api/v1/slugs/check` - Check slug availability
- `POST /api/v1/slugs/generate` - Generate slug

### Settings
- `GET /api/v1/settings` - Get all settings
- `GET /api/v1/settings/:key` - Get setting
- `PUT /api/v1/settings/:key` - Update setting

### Audit Logs
- `GET /api/v1/audit` - Get audit logs

### Queue
- `GET /api/v1/queue/jobs` - List jobs
- `GET /api/v1/queue/failed` - List failed jobs

## Core Services

- **AuthService**: JWT-based authentication
- **RBACService**: Role-based access control
- **SettingsService**: Key-value settings store
- **AuditService**: Activity logging
- **SlugService**: Slug generation and validation
- **QueueService**: MySQL-backed queue
- **I18nService**: Internationalization

## Documentation

- [Architecture](./docs/architecture.md)
- [Botble Parity Spec](./docs/botble-parity-spec.md)
- [Queue Specification](./docs/botble-queues-spec.md)

## Development

This is a work in progress. Core services are implemented, but plugins are not yet created.

## License

MIT

