# Architecture Documentation

This document defines the architecture for the Node.js/TypeScript re-implementation of Botble CMS. It specifies the monorepo structure, plugin system, routing, i18n, and queue design.

## Table of Contents

1. [Monorepo Layout](#monorepo-layout)
2. [Plugin System](#plugin-system)
3. [Routing](#routing)
4. [Internationalization (i18n)](#internationalization-i18n)
5. [Database-Backed Queue System](#database-backed-queue-system)
6. [Core Services](#core-services)
7. [Technology Stack](#technology-stack)

---

## Monorepo Layout

### Structure

```
cms-expressjs-nextjs2/
├── apps/
│   ├── api/                    # Express.js API server
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── server.ts       # Express app setup
│   │   │   ├── routes/         # API routes
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── worker.ts       # Queue worker process
│   │   │   └── scheduler.ts    # Scheduled tasks
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Next.js 16 App Router (public + admin)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/   # Public site routes
│       │   │   │   ├── page.tsx
│       │   │   │   ├── [slug]/page.tsx
│       │   │   │   └── layout.tsx
│       │   │   └── admin/      # Admin routes (under /admin)
│       │   │       ├── layout.tsx
│       │   │       ├── page.tsx
│       │   │       ├── pages/
│       │   │       ├── blog/
│       │   │       └── ...
│       │   ├── components/     # React components
│       │   ├── lib/            # Utilities
│       │   └── hooks/          # React hooks
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── core/                   # Core CMS functionality
│   │   ├── src/
│   │   │   ├── auth/           # Authentication & authorization
│   │   │   ├── rbac/           # Role-based access control
│   │   │   ├── settings/       # Settings store
│   │   │   ├── audit/           # Audit logging
│   │   │   ├── slug/           # Slug/permalink system
│   │   │   ├── queue/           # Queue system
│   │   │   └── events/          # Event system
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                 # Shared utilities & types
│   │   ├── src/
│   │   │   ├── types/          # TypeScript types
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── constants/      # Constants
│   │   │   └── prisma/         # Prisma client & types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── forms/          # Form components
│   │   │   ├── tables/         # Table components
│   │   │   └── admin/          # Admin-specific components
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── plugins/                # Plugin packages
│       ├── page/               # Pages plugin
│       │   ├── src/
│       │   │   ├── index.ts    # Plugin entry
│       │   │   ├── routes.ts   # API routes
│       │   │   ├── admin/      # Admin UI components
│       │   │   └── handlers/  # Queue handlers
│       │   ├── package.json
│       │   └── tsconfig.json
│       │
│       ├── blog/               # Blog plugin
│       ├── menu/                # Menu plugin
│       ├── widget/             # Widget plugin
│       ├── theme/               # Theme plugin
│       ├── media/               # Media plugin
│       ├── language/            # Language plugin
│       ├── translation/         # Translation plugin
│       └── sitemap/             # Sitemap plugin
│
├── prisma/
│   ├── schema.prisma           # Prisma schema
│   └── migrations/             # Migration files
│
├── package.json                # Root package.json (workspaces)
├── pnpm-workspace.yaml         # pnpm workspace config
├── tsconfig.json               # Root TypeScript config
└── README.md
```

### Package Management

- **Package Manager**: pnpm (with workspaces)
- **Workspace Config**: `pnpm-workspace.yaml`
- **TypeScript**: Shared `tsconfig.json` with project references

### Build System

- **Next.js**: Built-in build system for `apps/web`
- **TypeScript**: Direct execution with `tsx` or compiled with `tsc`
- **Prisma**: Database migrations via `prisma migrate dev`

---

## Plugin System

### Plugin Contract

All plugins must implement the following interface:

```typescript
// packages/shared/src/types/plugin.ts

export interface Plugin {
  // Plugin metadata
  name: string;
  version: string;
  description?: string;
  
  // Plugin initialization
  initialize(ctx: PluginContext): Promise<void>;
  
  // API routes registration
  registerRoutes?(router: Express.Router, ctx: PluginContext): void;
  
  // Admin navigation items
  getAdminNavItems?(ctx: PluginContext): AdminNavItem[];
  
  // Admin screens (React components)
  getAdminScreens?(ctx: PluginContext): AdminScreen[];
  
  // Settings panels
  getSettingsPanels?(ctx: PluginContext): SettingsPanel[];
  
  // Event handlers
  getEventHandlers?(ctx: PluginContext): EventHandler[];
  
  // Queue job handlers
  getJobHandlers?(ctx: PluginContext): JobHandler[];
  
  // Permissions
  getPermissions?(ctx: PluginContext): Permission[];
  
  // Database migrations (optional, can be in separate folder)
  migrations?: string[]; // Paths to migration files
}

export interface PluginContext {
  // Core services
  db: PrismaClient;
  queue: QueueService;
  events: EventService;
  settings: SettingsService;
  auth: AuthService;
  rbac: RBACService;
  slug: SlugService;
  i18n: I18nService;
  
  // Plugin registry
  plugins: PluginRegistry;
  
  // App instances
  apiApp: Express.Application;
  webApp: NextApp;
}
```

### Plugin Registration

Plugins are registered in `apps/api/src/plugins.ts`:

```typescript
import { PagePlugin } from '@cms/plugin-page';
import { BlogPlugin } from '@cms/plugin-blog';
// ... other plugins

export const plugins = [
  new PagePlugin(),
  new BlogPlugin(),
  // ... other plugins
];
```

### Plugin Lifecycle

1. **Discovery**: Plugins are loaded from `packages/plugins/*`
2. **Initialization**: `initialize()` called for each plugin
3. **Route Registration**: `registerRoutes()` called to register API routes
4. **Admin UI**: `getAdminNavItems()` and `getAdminScreens()` called to build admin UI
5. **Event Handlers**: `getEventHandlers()` registered with event system
6. **Job Handlers**: `getJobHandlers()` registered with queue system

### Permissions Namespace

Permissions follow the pattern: `{plugin}.{resource}.{action}`

Examples:
- `pages.create`
- `pages.edit`
- `pages.delete`
- `blog.posts.index`
- `blog.posts.create`
- `blog.categories.update-tree`
- `menus.index`
- `widgets.index`

Permissions are defined in the plugin:

```typescript
export class PagePlugin implements Plugin {
  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'pages.index', description: 'List pages' },
      { name: 'pages.create', description: 'Create pages' },
      { name: 'pages.edit', description: 'Edit pages' },
      { name: 'pages.delete', description: 'Delete pages' },
    ];
  }
}
```

### Admin Navigation

Plugins can add items to the admin navigation:

```typescript
export interface AdminNavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: AdminNavItem[];
  permission?: string; // Required permission to see this item
  order?: number;
}

// Example from PagePlugin
getAdminNavItems(ctx: PluginContext): AdminNavItem[] {
  return [
    {
      id: 'pages',
      label: 'Pages',
      icon: 'file-text',
      href: '/admin/pages',
      permission: 'pages.index',
      order: 10,
    },
  ];
}
```

### Admin Screens

Admin screens are React components rendered in the admin layout:

```typescript
export interface AdminScreen {
  path: string; // e.g., '/admin/pages'
  component: React.ComponentType;
  permission?: string;
}

// Example from PagePlugin
getAdminScreens(ctx: PluginContext): AdminScreen[] {
  return [
    {
      path: '/admin/pages',
      component: PagesListScreen,
      permission: 'pages.index',
    },
    {
      path: '/admin/pages/create',
      component: PageCreateScreen,
      permission: 'pages.create',
    },
    {
      path: '/admin/pages/[id]',
      component: PageEditScreen,
      permission: 'pages.edit',
    },
  ];
}
```

### Settings Panels

Plugins can add settings panels:

```typescript
export interface SettingsPanel {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType;
  permission?: string;
  order?: number;
}

// Example from SitemapPlugin
getSettingsPanels(ctx: PluginContext): SettingsPanel[] {
  return [
    {
      id: 'sitemap',
      title: 'Sitemap',
      description: 'Configure XML sitemap generation',
      component: SitemapSettingsPanel,
      permission: 'settings.options',
      order: 1000,
    },
  ];
}
```

### Event Handlers

Plugins can listen to and emit events:

```typescript
export interface EventHandler {
  event: string; // Event name
  handler: (payload: any, ctx: PluginContext) => Promise<void> | void;
}

// Example from SitemapPlugin
getEventHandlers(ctx: PluginContext): EventHandler[] {
  return [
    {
      event: 'content.published',
      handler: async (payload, ctx) => {
        // Enqueue sitemap generation
        await ctx.queue.enqueue('sitemap.generate', {});
      },
    },
  ];
}
```

### Job Handlers

Plugins can register queue job handlers:

```typescript
export interface JobHandler {
  name: string; // Job type name
  handler: (payload: any, ctx: PluginContext) => Promise<void>;
  maxAttempts?: number;
  backoff?: number; // Base backoff in seconds
}

// Example from SitemapPlugin
getJobHandlers(ctx: PluginContext): JobHandler[] {
  return [
    {
      name: 'sitemap.generate',
      handler: async (payload, ctx) => {
        // Generate sitemap logic
      },
      maxAttempts: 3,
      backoff: 60,
    },
  ];
}
```

---

## Routing

### Public Routing (Next.js App Router)

Public routes are handled by Next.js in `apps/web/src/app/(public)/`:

```
/                    -> page.tsx (homepage)
/[slug]              -> [slug]/page.tsx (dynamic slug resolution)
/blog                -> blog/page.tsx (blog listing)
/blog/[slug]         -> blog/[slug]/page.tsx (blog post)
/sitemap.xml         -> sitemap.xml/route.ts (sitemap generation)
```

### Slug Resolution

The slug resolver (`packages/core/src/slug/resolver.ts`) handles dynamic slug routing:

```typescript
export class SlugResolver {
  async resolve(slug: string, locale?: string): Promise<SlugResolution | null> {
    // Query slugs table
    const slugRecord = await db.slug.findFirst({
      where: {
        key: slug,
        prefix: '', // or specific prefix
        isActive: true,
        ...(locale && { locale }),
      },
      include: {
        // Include related entity based on referenceType
      },
    });
    
    if (!slugRecord) {
      return null;
    }
    
    // Load entity based on referenceType
    const entity = await this.loadEntity(
      slugRecord.referenceType,
      slugRecord.referenceId
    );
    
    return {
      type: slugRecord.referenceType,
      entity,
      slug: slugRecord,
    };
  }
}
```

### Admin Routing (Next.js App Router)

Admin routes are under `/admin` in `apps/web/src/app/admin/`:

```
/admin                    -> page.tsx (dashboard)
/admin/pages              -> pages/page.tsx (pages list)
/admin/pages/create       -> pages/create/page.tsx
/admin/pages/[id]         -> pages/[id]/page.tsx
/admin/blog/posts         -> blog/posts/page.tsx
/admin/settings           -> settings/page.tsx
```

### API Routing (Express.js)

API routes are in `apps/api/src/routes/`:

```
/api/v1/auth/login        -> POST
/api/v1/auth/me           -> GET
/api/v1/pages             -> GET, POST
/api/v1/pages/:id         -> GET, PUT, DELETE
/api/v1/blog/posts         -> GET, POST
/api/v1/blog/posts/:id    -> GET, PUT, DELETE
/api/v1/slugs/check       -> POST (slug availability)
/api/v1/media/upload      -> POST
/api/v1/queue/jobs        -> GET (admin: list jobs)
```

### Route Registration

Plugins register routes in `registerRoutes()`:

```typescript
// packages/plugins/page/src/routes.ts
export function registerPageRoutes(
  router: Express.Router,
  ctx: PluginContext
): void {
  router.get('/pages', requireAuth, requirePermission('pages.index'), listPages);
  router.post('/pages', requireAuth, requirePermission('pages.create'), createPage);
  router.get('/pages/:id', requireAuth, requirePermission('pages.index'), getPage);
  router.put('/pages/:id', requireAuth, requirePermission('pages.edit'), updatePage);
  router.delete('/pages/:id', requireAuth, requirePermission('pages.delete'), deletePage);
}
```

---

## Internationalization (i18n)

### Locale Management

Locales are stored in the `languages` table:

```prisma
model Language {
  id          Int      @id @default(autoincrement())
  langName    String
  langCode    String   @unique // e.g., 'en', 'el', 'fr'
  langFlag    String?
  langIsDefault Boolean @default(false)
  langIsRtl    Boolean @default(false)
  langOrder    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Content Translations

Content translations use separate translation tables:

```prisma
model Page {
  id          Int      @id @default(autoincrement())
  name        String
  content     String?
  status      String   @default("published")
  // ... other fields
  translations PageTranslation[]
  slug        Slug?
}

model PageTranslation {
  langCode String
  pagesId  Int
  name     String?
  content  String?
  
  page     Page   @relation(fields: [pagesId], references: [id])
  
  @@id([langCode, pagesId])
}
```

### Translation Grouping

Linked translations are grouped via `translationGroupId`:

```prisma
model Page {
  id                Int      @id @default(autoincrement())
  translationGroupId String? @unique // UUID for grouping translations
  // ... other fields
}
```

When creating a translation:
1. Generate new `translationGroupId` if creating first page
2. Use existing `translationGroupId` when creating translation
3. Ensure `translationGroupId + locale` is unique

### String Translations

UI string translations are stored in `lang/{locale}/{group}.json` files:

```
lang/
  en/
    common.json
    pages.json
    blog.json
  el/
    common.json
    pages.json
    blog.json
```

Translation service (`packages/core/src/i18n/service.ts`):

```typescript
export class I18nService {
  async getTranslation(
    key: string,
    locale: string,
    params?: Record<string, any>
  ): Promise<string> {
    // Load from lang/{locale}/{group}.json
    // Support dot notation: 'pages.title' -> pages.json['title']
    // Interpolate params: 'Hello {name}' -> 'Hello John'
  }
  
  async updateTranslation(
    key: string,
    locale: string,
    value: string
  ): Promise<void> {
    // Update lang/{locale}/{group}.json file
  }
}
```

### Slug Translations

Slugs can be different per locale:

```prisma
model Slug {
  id            Int      @id @default(autoincrement())
  key           String
  referenceId   Int
  referenceType String
  prefix        String   @default("")
  locale        String?  // NULL = default locale
  isActive      Boolean  @default(true)
  translations  SlugTranslation[]
}

model SlugTranslation {
  langCode String
  slugsId  Int
  key      String?
  prefix   String?
  
  slug     Slug   @relation(fields: [slugsId], references: [id])
  
  @@id([langCode, slugsId])
}
```

### Locale Detection

1. **Admin**: Use `Accept-Language` header or user preference
2. **Public**: Use URL prefix (`/el/page-slug`) or `Accept-Language` header
3. **Default**: Use `langIsDefault = true` locale

---

## Database-Backed Queue System

### Schema

```prisma
model Job {
  id           BigInt    @id @default(autoincrement())
  queue        String    @default("default")
  name         String    // Job type: 'sitemap.generate', 'media.processImage', etc.
  payloadJson  String    @db.Text // JSON payload
  status       JobStatus @default(QUEUED)
  priority     Int       @default(0)
  runAt        DateTime  @default(now())
  attempts     Int       @default(0)
  maxAttempts  Int       @default(3)
  lastError    String?   @db.Text
  lockedAt     DateTime?
  lockedBy     String?   // Worker identifier
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  @@index([status, runAt, priority])
  @@index([queue, status, runAt])
}

enum JobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
}

model FailedJob {
  id          BigInt   @id @default(autoincrement())
  uuid        String   @unique
  connection  String
  queue       String
  payload     String   @db.Text
  exception   String   @db.Text
  failedAt    DateTime @default(now())
}
```

### Queue Service

```typescript
// packages/core/src/queue/service.ts

export class QueueService {
  async enqueue(
    name: string,
    payload: any,
    options?: {
      queue?: string;
      priority?: number;
      runAt?: Date;
      maxAttempts?: number;
    }
  ): Promise<Job> {
    const job = await db.job.create({
      data: {
        name,
        payloadJson: JSON.stringify(payload),
        queue: options?.queue || 'default',
        priority: options?.priority || 0,
        runAt: options?.runAt || new Date(),
        maxAttempts: options?.maxAttempts || 3,
        status: 'QUEUED',
      },
    });
    
    return job;
  }
  
  async claimNextJob(workerId: string): Promise<Job | null> {
    // Atomic transaction to claim job
    return await db.$transaction(async (tx) => {
      const job = await tx.job.findFirst({
        where: {
          status: 'QUEUED',
          runAt: { lte: new Date() },
          OR: [
            { lockedAt: null },
            { lockedAt: { lt: new Date(Date.now() - 90 * 1000) } }, // Lock expired
          ],
        },
        orderBy: [
          { runAt: 'asc' },
          { priority: 'desc' },
          { id: 'asc' },
        ],
      });
      
      if (!job) {
        return null;
      }
      
      // Claim job
      await tx.job.update({
        where: { id: job.id },
        data: {
          status: 'PROCESSING',
          lockedAt: new Date(),
          lockedBy: workerId,
          attempts: { increment: 1 },
        },
      });
      
      return job;
    });
  }
  
  async completeJob(jobId: bigint): Promise<void> {
    await db.job.delete({
      where: { id: jobId },
    });
  }
  
  async failJob(
    jobId: bigint,
    error: Error,
    retry: boolean = true
  ): Promise<void> {
    const job = await db.job.findUnique({
      where: { id: jobId },
    });
    
    if (!job) {
      return;
    }
    
    if (retry && job.attempts < job.maxAttempts) {
      // Retry with backoff
      const backoff = Math.min(
        60 * Math.pow(2, job.attempts),
         3600
      ); // Exponential backoff, max 1 hour
      
      await db.job.update({
        where: { id: jobId },
        data: {
          status: 'QUEUED',
          lockedAt: null,
          lockedBy: null,
          runAt: new Date(Date.now() + backoff * 1000),
          lastError: error.message,
        },
      });
    } else {
      // Max attempts reached, move to failed_jobs
      await db.failedJob.create({
        data: {
          uuid: crypto.randomUUID(),
          connection: 'database',
          queue: job.queue,
          payload: job.payloadJson,
          exception: error.stack || error.message,
        },
      });
      
      await db.job.delete({
        where: { id: jobId },
      });
    }
  }
}
```

### Worker Process

```typescript
// apps/api/src/worker.ts

import { QueueService } from '@cms/core/queue';
import { PrismaClient } from '@cms/shared/prisma';

const workerId = `worker-${process.pid}-${Date.now()}`;
const db = new PrismaClient();
const queue = new QueueService(db);

// Load job handlers from plugins
const jobHandlers = loadJobHandlers();

async function processJobs() {
  while (true) {
    try {
      const job = await queue.claimNextJob(workerId);
      
      if (!job) {
        // No jobs available, wait before polling again
        await sleep(3000); // 3 seconds
        continue;
      }
      
      // Execute job handler
      const handler = jobHandlers.get(job.name);
      if (!handler) {
        console.error(`No handler found for job: ${job.name}`);
        await queue.failJob(job.id, new Error(`No handler for ${job.name}`), false);
        continue;
      }
      
      try {
        const payload = JSON.parse(job.payloadJson);
        await handler(payload, { db, queue, /* ... other context */ });
        await queue.completeJob(job.id);
      } catch (error) {
        await queue.failJob(job.id, error as Error, true);
      }
    } catch (error) {
      console.error('Worker error:', error);
      await sleep(5000); // Wait before retrying
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Worker shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Worker shutting down...');
  process.exit(0);
});

processJobs();
```

### Scheduler Process

```typescript
// apps/api/src/scheduler.ts

import cron from 'node-cron';
import { QueueService } from '@cms/core/queue';
import { PrismaClient } from '@cms/shared/prisma';

const db = new PrismaClient();
const queue = new QueueService(db);

// Schedule: Daily at 02:00
cron.schedule('0 2 * * *', async () => {
  await queue.enqueue('sitemap.generate', {});
});

// Schedule: Daily at 02:00 (after sitemap)
cron.schedule('0 2 * * *', async () => {
  await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
  await queue.enqueue('sitemap.indexnow', { sitemapUrl: null });
}, { scheduled: false }); // Disable by default, enable after first job

// Schedule: Every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  await queue.enqueue('cache.clearExpired', {});
});

// Schedule: Daily at 03:00
cron.schedule('0 3 * * *', async () => {
  await queue.enqueue('backup.generate', {
    includeFiles: true,
    includeDatabase: true,
  });
});

// Schedule: Hourly
cron.schedule('0 * * * *', async () => {
  await queue.enqueue('analytics.process', {});
});

// Schedule: Daily at 04:00
cron.schedule('0 4 * * *', async () => {
  await queue.enqueue('logs.cleanup', {});
});

console.log('Scheduler started');
```

---

## Core Services

### Authentication Service

```typescript
// packages/core/src/auth/service.ts

export class AuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    // Verify credentials
    // Generate JWT token
    // Set HTTP-only cookie
  }
  
  async getCurrentUser(token: string): Promise<User | null> {
    // Verify JWT token
    // Load user from database
  }
  
  async logout(): Promise<void> {
    // Clear cookie
  }
}
```

### RBAC Service

```typescript
// packages/core/src/rbac/service.ts

export class RBACService {
  async checkPermission(
    userId: number,
    permission: string
  ): Promise<boolean> {
    // Check if user is super user
    // Check user permissions
    // Check role permissions
  }
  
  async getUserRoles(userId: number): Promise<Role[]> {
    // Load user roles
  }
}
```

### Settings Service

```typescript
// packages/core/src/settings/service.ts

export class SettingsService {
  async get(key: string): Promise<string | null> {
    // Load from settings table
  }
  
  async set(key: string, value: string): Promise<void> {
    // Upsert in settings table
  }
  
  async getMany(keys: string[]): Promise<Record<string, string>> {
    // Load multiple settings
  }
}
```

### Slug Service

```typescript
// packages/core/src/slug/service.ts

export class SlugService {
  async generate(
    text: string,
    model: string,
    excludeId?: number
  ): Promise<string> {
    // Transliterate non-Latin characters (Greek → Latin)
    // Generate slug from text
    // Check uniqueness with prefix
    // Append -2, -3, etc. if taken
  }
  
  async checkAvailability(
    slug: string,
    prefix: string,
    excludeId?: number
  ): Promise<boolean> {
    // Check if slug is available
  }
  
  async create(
    entityType: string,
    entityId: number,
    slug: string,
    prefix: string,
    locale?: string
  ): Promise<Slug> {
    // Create slug record
  }
}
```

---

## Technology Stack

### Runtime
- **Node.js**: 20.x LTS
- **TypeScript**: 5.x

### Framework
- **Next.js**: 16.x (App Router)
- **Express.js**: 4.x

### Database
- **MySQL**: 8.0+
- **Prisma**: ORM and migrations

### Package Management
- **pnpm**: Workspace-based monorepo

### Queue
- **MySQL-backed**: Custom implementation (no Redis)
- **node-cron**: Scheduled tasks

### Authentication
- **JWT**: JSON Web Tokens (HTTP-only cookies)

### Image Processing
- **Sharp**: Image processing and thumbnails

### Validation
- **Zod**: Schema validation

### Testing
- **Vitest**: Unit and integration tests
- **Playwright**: E2E tests

---

## Development Scripts

### Root `package.json` Scripts

```json
{
  "scripts": {
    "dev": "pnpm --parallel --filter './apps/*' dev",
    "dev:api": "pnpm --filter '@cms/api' dev",
    "dev:web": "pnpm --filter '@cms/web' dev",
    "worker": "pnpm --filter '@cms/api' worker",
    "scheduler": "pnpm --filter '@cms/api' scheduler",
    "build": "pnpm --recursive build",
    "db:migrate": "pnpm --filter '@cms/shared' db:migrate",
    "db:generate": "pnpm --filter '@cms/shared' db:generate",
    "setup:local": "pnpm db:migrate && pnpm seed"
  }
}
```

### Setup Without Docker

1. **Prerequisites**:
   - Node.js 20.x
   - pnpm
   - MySQL 8.0+ (running locally)

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Setup Database**:
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE cms_dev;"
   
   # Run migrations
   pnpm db:migrate
   
   # Seed database
   pnpm seed
   ```

4. **Start Development**:
   ```bash
   # Start API and Web in parallel
   pnpm dev
   
   # Or separately:
   pnpm dev:api    # Express API on :3001
   pnpm dev:web    # Next.js on :3000
   ```

5. **Start Worker**:
   ```bash
   pnpm worker
   ```

6. **Start Scheduler**:
   ```bash
   pnpm scheduler
   ```

---

## Summary

This architecture provides:

1. **Monorepo Structure**: Clear separation of apps and packages
2. **Plugin System**: Extensible plugin contract with lifecycle hooks
3. **Routing**: Next.js for public/admin, Express for API
4. **i18n**: Multi-locale support with content and string translations
5. **Queue System**: MySQL-backed queue with worker and scheduler processes
6. **Core Services**: Reusable services for auth, RBAC, settings, slugs

The system is designed to be:
- **Runnable after each phase**: Each phase builds on the previous
- **No Docker required**: Uses local MySQL
- **Plugin-based**: Easy to extend with new functionality
- **Type-safe**: Full TypeScript coverage
- **Scalable**: Can run multiple workers, separate processes

