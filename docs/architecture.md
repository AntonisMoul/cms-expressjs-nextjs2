# Next.js + Express.js Architecture for Botble CMS Reimplementation

This document outlines the monorepo architecture designed to replicate Botble CMS functionality while leveraging modern Next.js 16 and TypeScript patterns.

## Monorepo Layout

### Root Structure
```
cms-expressjs-nextjs2/
├── apps/
│   ├── api/                    # Express.js API server
│   └── web/                    # Next.js 16 web application
├── packages/
│   ├── core/                   # Shared core functionality
│   ├── plugins/                # Feature plugins (pages, blog, etc.)
│   │   ├── pages/
│   │   ├── blog/
│   │   ├── media/
│   │   ├── menu/
│   │   ├── widget/
│   │   ├── theme/
│   │   ├── language/
│   │   └── translation/
│   ├── ui/                     # Shared UI components
│   └── shared/                 # Shared utilities and types
├── docs/                       # Documentation
├── package.json                # Root package.json with workspaces
├── pnpm-workspace.yaml         # Workspace configuration
├── turbo.json                  # Turborepo configuration
└── docker-compose.yml          # Development environment
```

### Apps Directory

#### `apps/api/` - Express.js Backend
```
apps/api/
├── src/
│   ├── index.ts                # Express app entry point
│   ├── routes/                 # API routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── plugins/            # Plugin-registered routes
│   │   └── index.ts
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   ├── rate-limit.ts
│   │   └── validation.ts
│   ├── services/               # Business logic services
│   ├── utils/                  # Utilities
│   └── types/                  # TypeScript types
├── prisma/                     # Database schema
│   └── schema.prisma
├── package.json
└── tsconfig.json
```

#### `apps/web/` - Next.js 16 Frontend
```
apps/web/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public routes (SSR)
│   │   ├── [locale]/           # Localized routes
│   │   │   ├── [...slug]/      # Dynamic slug resolution
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── admin/                  # Admin routes
│   │   ├── layout.tsx          # Admin shell
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── pages/              # Thin route wrappers
│   │   │   ├── page.tsx        # Imports from @cms/plugins-pages
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── edit/
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── blog/
│   │   │   ├── posts/
│   │   │   ├── categories/
│   │   │   └── tags/
│   │   ├── media/
│   │   ├── menus/
│   │   ├── widgets/
│   │   ├── appearance/
│   │   ├── system/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   ├── languages/
│   │   │   ├── translations/
│   │   │   └── settings/
│   │   └── api/                 # Client-side API routes
│   ├── api/                     # Next.js API routes (proxied to Express)
│   └── globals.css
├── components/                  # Shared components
├── lib/                         # Utilities
├── hooks/                       # Custom hooks
├── types/                       # TypeScript types
├── package.json
└── next.config.js
```

### Packages Directory

#### `packages/core/` - Core Functionality
```
packages/core/
├── src/
│   ├── auth/                   # Authentication logic
│   │   ├── jwt.ts
│   │   ├── cookies.ts
│   │   └── middleware.ts
│   ├── rbac/                   # Role-based access control
│   │   ├── permissions.ts
│   │   ├── roles.ts
│   │   └── middleware.ts
│   ├── settings/               # Settings store
│   │   ├── store.ts
│   │   └── service.ts
│   ├── audit/                  # Audit logging
│   │   ├── logger.ts
│   │   └── service.ts
│   ├── slug/                   # Slug/permalink system
│   │   ├── service.ts
│   │   ├── transliteration.ts
│   │   └── redirects.ts
│   ├── language/               # Language/localization
│   │   ├── manager.ts
│   │   ├── middleware.ts
│   │   └── translations.ts
│   ├── database/               # Database utilities
│   ├── utils/                  # Shared utilities
│   └── index.ts                # Core exports
├── prisma/                     # Core database schema
└── package.json
```

#### `packages/plugins/*/`
Each plugin follows this structure:
```
packages/plugins/pages/
├── src/
│   ├── api/                    # API routes for Express
│   │   ├── routes.ts           # Route definitions
│   │   ├── controllers/        # Route controllers
│   │   └── requests/           # Request validation
│   ├── admin/                  # Admin screens for Next.js
│   │   ├── pages/              # Page components
│   │   │   ├── list.tsx
│   │   │   ├── create.tsx
│   │   │   └── edit.tsx
│   │   ├── components/         # Admin components
│   │   └── navigation.ts       # Navigation items
│   ├── public/                 # Public rendering
│   │   ├── components/         # Public components
│   │   └── types.ts
│   ├── models/                 # Prisma models/types
│   ├── services/               # Business logic
│   ├── permissions.ts          # Permission definitions
│   ├── plugin.ts               # Plugin registration
│   └── index.ts                # Plugin exports
├── prisma/                     # Plugin-specific schema
└── package.json
```

#### `packages/ui/` - Shared UI Components
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── forms/              # Form components
│   │   │   ├── TextField.tsx
│   │   │   ├── SelectField.tsx
│   │   │   ├── MetaBoxes.tsx
│   │   │   └── SlugField.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── TwoColumnEditor.tsx
│   │   │   └── Table.tsx
│   │   ├── media/              # Media components
│   │   ├── navigation/         # Navigation components
│   │   └── common/             # Common components
│   ├── themes/                 # Theme system
│   ├── hooks/                  # UI hooks
│   └── index.ts
├── package.json
└── tailwind.config.js
```

#### `packages/shared/` - Shared Utilities
```
packages/shared/
├── src/
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # Utility functions
│   ├── constants/              # Constants
│   ├── validation/             # Validation schemas
│   └── index.ts
└── package.json
```

## Plugin Contract

### Plugin Interface
```typescript
// packages/shared/src/types/plugin.ts
export interface Plugin {
  name: string;
  version: string;
  description?: string;

  // API registration
  registerApiRoutes?: (router: Router, context: PluginContext) => void;

  // Permissions
  permissions?: PermissionDefinition[];

  // Admin navigation
  adminNavigation?: AdminNavigationItem[];

  // Settings panels
  settingsPanels?: SettingsPanel[];

  // Initialization
  init?: (context: PluginContext) => Promise<void> | void;

  // Cleanup
  destroy?: () => Promise<void> | void;
}

export interface PluginContext {
  prisma: PrismaClient;
  config: Config;
  logger: Logger;
  cache: Cache;
}
```

### API Routes Registration
```typescript
// packages/plugins/pages/src/api/routes.ts
import { Router } from 'express';
import { PluginContext } from '@cms/shared';

export function registerRoutes(router: Router, context: PluginContext) {
  const { prisma, logger } = context;

  // Pages API routes
  router.get('/pages', async (req, res) => {
    // Implementation
  });

  router.post('/pages', async (req, res) => {
    // Implementation
  });

  router.put('/pages/:id', async (req, res) => {
    // Implementation
  });
}
```

### Permissions Namespace
```typescript
// packages/plugins/pages/src/permissions.ts
export const PAGE_PERMISSIONS = {
  INDEX: 'pages.index',
  CREATE: 'pages.create',
  EDIT: 'pages.edit',
  DELETE: 'pages.delete',
  PUBLISH: 'pages.publish',
} as const;

export const pagePermissions: PermissionDefinition[] = [
  {
    key: PAGE_PERMISSIONS.INDEX,
    name: 'View Pages',
    module: 'pages',
  },
  {
    key: PAGE_PERMISSIONS.CREATE,
    name: 'Create Pages',
    module: 'pages',
  },
  // ... more permissions
];
```

### Admin Navigation Items
```typescript
// packages/plugins/pages/src/admin/navigation.ts
export const pageNavigation: AdminNavigationItem[] = [
  {
    id: 'pages',
    name: 'Pages',
    icon: 'ti ti-notebook',
    route: '/admin/pages',
    permissions: [PAGE_PERMISSIONS.INDEX],
    priority: 2,
  },
];
```

### Settings Panels
```typescript
// packages/plugins/pages/src/admin/settings.ts
export const pageSettingsPanels: SettingsPanel[] = [
  {
    id: 'pages-general',
    title: 'Pages Settings',
    route: '/admin/settings/pages',
    permissions: ['settings.edit'],
    component: 'PageSettingsForm',
  },
];
```

## Next.js Admin Route Pattern

### Thin Route Wrappers
Admin routes in `apps/web/app/admin/` are minimal wrappers that import and render components from plugins:

```typescript
// apps/web/app/admin/pages/page.tsx
import { PageListScreen } from '@cms/plugins-pages/admin';

export default function PagesPage() {
  return <PageListScreen />;
}
```

```typescript
// apps/web/app/admin/pages/create/page.tsx
import { PageCreateScreen } from '@cms/plugins-pages/admin';

export default function CreatePagePage() {
  return <PageCreateScreen />;
}
```

```typescript
// apps/web/app/admin/pages/[id]/edit/page.tsx
import { PageEditScreen } from '@cms/plugins-pages/admin';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: EditPageProps) {
  const { id } = await params;
  return <PageEditScreen id={id} />;
}
```

### Plugin Admin Components
```typescript
// packages/plugins/pages/src/admin/pages/list.tsx
'use client';

import { usePages } from '../hooks/usePages';
import { AdminTable } from '@cms/ui';
import { PageFilters } from '../components/PageFilters';

export function PageListScreen() {
  const { pages, loading, filters, setFilters } = usePages();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Pages</h1>
        <Link href="/admin/pages/create" className="btn-primary">
          Create Page
        </Link>
      </div>

      <PageFilters filters={filters} onChange={setFilters} />

      <AdminTable
        data={pages}
        columns={pageColumns}
        loading={loading}
        bulkActions={pageBulkActions}
      />
    </div>
  );
}
```

## Public Site Slug Resolution

### Dynamic Slug Route Handler
```typescript
// apps/web/app/[locale]/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { getContentBySlug } from '@cms/core';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const content = await getContentBySlug(slug.join('/'), locale);

  if (!content) {
    notFound();
  }

  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription,
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const content = await getContentBySlug(slug.join('/'), locale);

  if (!content) {
    notFound();
  }

  // Render based on content type
  switch (content.type) {
    case 'page':
      return <PageRenderer content={content} />;
    case 'post':
      return <PostRenderer content={content} />;
    case 'category':
      return <CategoryRenderer content={content} />;
    default:
      notFound();
  }
}
```

### Slug Resolution Service
```typescript
// packages/core/src/slug/service.ts
export async function getContentBySlug(
  slug: string,
  locale: string
): Promise<Content | null> {
  // Check pages first
  const page = await prisma.page.findFirst({
    where: {
      translations: {
        some: {
          locale,
          slug: {
            key: slug,
            prefix: null, // Pages have no prefix
          },
        },
      },
      status: 'published',
    },
    include: {
      translations: true,
      author: true,
    },
  });

  if (page) {
    return {
      type: 'page',
      id: page.id,
      title: page.name,
      content: page.content,
      // ... other fields
    };
  }

  // Check posts (with 'blog' prefix)
  const post = await prisma.post.findFirst({
    where: {
      translations: {
        some: {
          locale,
          slug: {
            key: slug,
            prefix: 'blog',
          },
        },
      },
      status: 'published',
    },
    include: {
      translations: true,
      categories: true,
      tags: true,
      author: true,
    },
  });

  if (post) {
    return {
      type: 'post',
      id: post.id,
      title: post.name,
      content: post.content,
      // ... other fields
    };
  }

  // Check categories
  const category = await prisma.category.findFirst({
    where: {
      translations: {
        some: {
          locale,
          slug: {
            key: slug,
            prefix: null,
          },
        },
      },
      status: 'published',
    },
  });

  if (category) {
    return {
      type: 'category',
      id: category.id,
      title: category.name,
      // ... other fields
    };
  }

  return null;
}
```

## Environment Variables & Development Setup

### Environment Configuration
```bash
# .env.local (apps/web)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en

# .env (apps/api)
DATABASE_URL="mysql://user:password@localhost:3306/cms_db"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
REDIS_URL="redis://localhost:6379"

# SMTP Configuration
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# Development
NODE_ENV=development
DEBUG=true
```

### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: cms_db
      MYSQL_USER: cms
      MYSQL_PASSWORD: cms
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"  # SMTP server
      - "8025:8025"  # Web interface

volumes:
  mysql_data:
```

### Development Scripts
```json
// package.json (root)
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "start": "turbo start",
    "db:migrate": "cd apps/api && prisma migrate dev",
    "db:seed": "cd apps/api && prisma db seed",
    "db:studio": "cd apps/api && prisma studio",
    "clean": "turbo clean && rm -rf node_modules"
  }
}
```

```json
// apps/api/package.json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

```json
// apps/web/package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Turborepo Configuration
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "test": {}
  }
}
```

### Workspace Configuration
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This architecture provides:
- **Scalable monorepo** with clear separation of concerns
- **Plugin-based extensibility** matching Botble's architecture
- **Type-safe** development with shared types and interfaces
- **Modern tooling** with Turborepo, pnpm workspaces, and Docker
- **Exact Botble parity** in functionality and UX patterns
