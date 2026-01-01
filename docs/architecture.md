# Next.js + Express.js CMS Architecture

This document describes the monorepo architecture for the Botble-compatible CMS implementation using Next.js 16 App Router and Express.js with TypeScript.

## Monorepo Structure

```
cms-expressjs-nextjs/
├── apps/
│   ├── api/                    # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── middleware/     # Auth, validation, etc.
│   │   │   ├── services/       # Business logic
│   │   │   ├── routes/         # API route definitions
│   │   │   ├── config/         # Database, env config
│   │   │   └── utils/          # Helpers
│   │   ├── prisma/             # Database schema & migrations
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                    # Next.js admin + public site
│       ├── app/                # Next.js App Router
│       │   ├── (admin)/        # Admin routes under /admin
│       │   ├── (public)/       # Public site routes
│       │   ├── api/            # Next.js API routes (if needed)
│       │   └── globals.css
│       ├── components/         # Shared React components
│       ├── lib/                # Client-side utilities
│       ├── public/             # Static assets
│       ├── package.json
│       └── next.config.js
├── packages/
│   ├── core/                   # Core functionality
│   │   ├── src/
│   │   │   ├── auth/           # Authentication logic
│   │   │   ├── rbac/           # Role/permission system
│   │   │   ├── settings/       # Settings store
│   │   │   ├── audit/          # Activity logging
│   │   │   ├── slug/           # Slug management
│   │   │   ├── locales/        # Language support
│   │   │   └── types/          # Shared TypeScript types
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── plugins/                # Plugin packages
│   │   ├── pages/              # Pages plugin
│   │   ├── blog/               # Blog plugin
│   │   ├── media/              # Media manager plugin
│   │   ├── menu/               # Menu builder plugin
│   │   ├── widget/             # Widget system plugin
│   │   └── theme/              # Theme system plugin
│   ├── ui/                     # Shared UI components
│   │   ├── components/         # Reusable React components
│   │   ├── hooks/              # Custom React hooks
│   │   └── styles/             # CSS/Tailwind utilities
│   └── shared/                 # Shared utilities
│       ├── types/              # Global TypeScript types
│       ├── utils/              # Helper functions
│       ├── constants/          # App constants
│       └── validations/        # Zod schemas
├── docs/                       # Documentation
├── docker/                     # Docker configuration
├── scripts/                    # Build/deployment scripts
├── package.json                # Root package.json for monorepo
├── pnpm-workspace.yaml         # Workspace configuration
└── turbo.json                  # Build pipeline configuration
```

## Plugin Architecture

### Plugin Contract

Each plugin must export a standard interface:

```typescript
// packages/plugins/pages/src/index.ts
export interface PluginContract {
  name: string;
  version: string;

  // API routes to register
  registerApiRoutes?: (router: Router, ctx: PluginContext) => void;

  // Admin navigation items
  getAdminNavigation?: () => AdminNavItem[];

  // Admin screens/routes to register
  getAdminScreens?: () => AdminScreen[];

  // Settings panels to add
  getSettingsPanels?: () => SettingsPanel[];

  // Database migrations to run
  migrations?: string[];

  // Permissions to register
  permissions?: Permission[];
}

// Admin navigation item structure
export interface AdminNavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  parentId?: string;
  priority?: number;
  permissions?: string[];
}

// Admin screen structure
export interface AdminScreen {
  path: string;
  component: React.ComponentType;
  layout?: React.ComponentType;
  permissions?: string[];
}
```

### Plugin Registration

```typescript
// apps/api/src/plugins/index.ts
import { pagesPlugin } from '@cms/plugins/pages';
import { blogPlugin } from '@cms/plugins/blog';

export const plugins = [pagesPlugin, blogPlugin];

export function registerPlugins(app: Express) {
  plugins.forEach(plugin => {
    // Register API routes
    if (plugin.registerApiRoutes) {
      const router = Router();
      plugin.registerApiRoutes(router, { app, prisma });
      app.use(`/api/v1/${plugin.name}`, router);
    }

    // Collect admin navigation, screens, etc.
    // ...
  });
}
```

## Next.js Admin Integration

### Thin Route Wrappers

Admin routes use thin wrappers that import screens from plugins:

```typescript
// apps/web/app/admin/pages/page/[id]/edit/page.tsx
import { getPageEditScreen } from '@cms/plugins/pages/admin';

export default function PageEditPage({ params }: { params: { id: string } }) {
  const PageEditScreen = getPageEditScreen();
  return <PageEditScreen pageId={params.id} />;
}
```

### Admin Layout System

```typescript
// apps/web/components/admin/AdminLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navigation = useAdminNavigation();

  return (
    <div className="admin-layout">
      <AdminSidebar navigation={navigation} currentPath={pathname} />
      <div className="admin-content">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

### Admin Navigation Generation

```typescript
// apps/web/lib/admin-navigation.ts
import { plugins } from '@cms/plugins';

export function getAdminNavigation(): AdminNavItem[] {
  const navigation: AdminNavItem[] = [];

  plugins.forEach(plugin => {
    if (plugin.getAdminNavigation) {
      navigation.push(...plugin.getAdminNavigation());
    }
  });

  // Sort by priority and build hierarchy
  return buildNavigationTree(navigation);
}
```

## Public Site Architecture

### Slug Resolution System

```typescript
// apps/web/app/[...slug]/page.tsx
import { resolveSlug } from '@cms/core/slug';
import { renderPage } from '@cms/plugins/pages/public';
import { renderPost } from '@cms/plugins/blog/public';

export default async function SlugPage({ params }: { params: { slug: string[] } }) {
  const fullSlug = params.slug.join('/');
  const resolved = await resolveSlug(fullSlug);

  if (!resolved) {
    notFound();
  }

  switch (resolved.entityType) {
    case 'page':
      return renderPage(resolved.entityId, resolved.locale);
    case 'post':
      return renderPost(resolved.entityId, resolved.locale);
    default:
      notFound();
  }
}
```

### Slug Resolution Service

```typescript
// packages/core/src/slug/resolver.ts
export async function resolveSlug(fullSlug: string, locale?: string) {
  // Remove language prefix if present
  const { slug, detectedLocale } = parseSlugWithLocale(fullSlug, locale);

  // Query database for slug
  const slugRecord = await prisma.slug.findFirst({
    where: {
      key: slug,
      locale: detectedLocale,
      isActive: true,
    },
  });

  if (!slugRecord) {
    return null;
  }

  return {
    entityType: slugRecord.entityType,
    entityId: slugRecord.entityId,
    locale: detectedLocale,
    fullPath: slugRecord.fullPath,
  };
}
```

## Database Schema (Prisma)

### Core Schema

```prisma
// packages/core/prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String?
  lastName  String?
  username  String?  @unique
  password  String
  avatarId  String?
  superUser Boolean  @default(false)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  roles     UserRole[]
  meta      UserMeta[]
  auditLogs AuditHistory[]

  @@map("users")
}

model Role {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  permissions Json?
  description String?
  isDefault   Boolean  @default(false)
  createdBy   String
  updatedBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users UserRole[]

  @@map("roles")
}

model UserRole {
  id     String @id @default(cuid())
  userId String
  roleId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@map("role_users")
}

model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String?

  @@map("settings")
}

model AuditHistory {
  id            String   @id @default(cuid())
  userId        String
  module        String
  action        String
  request       Json?
  userAgent     String?
  ipAddress     String?
  referenceUser String
  referenceId   String
  referenceName String
  type          String
  createdAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("audit_histories")
}

model Slug {
  id           String  @id @default(cuid())
  key          String
  entityId     String
  entityType   String
  prefix       String?
  fullPath     String
  locale       String  @default("en")
  isActive     Boolean @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([key, locale])
  @@index([entityType, entityId])
  @@index([key, prefix])
  @@map("slugs")
}

model Language {
  id        String  @id @default(cuid())
  name      String
  locale    String  @unique
  code      String
  flag      String?
  isDefault Boolean @default(false)
  order     Int     @default(0)
  isRTL     Boolean @default(false)

  @@map("languages")
}
```

## API Architecture

### Route Structure

```typescript
// apps/api/src/routes/index.ts
import { Router } from 'express';
import { authRoutes } from './auth';
import { adminRoutes } from './admin';
import { publicRoutes } from './public';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);

// Protected admin routes
router.use('/admin', authenticate, authorize, adminRoutes);

// Plugin routes
registerPlugins(router);

export { router };
```

### Authentication Middleware

```typescript
// packages/core/src/auth/middleware.ts
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: 'No access token' });
    }

    const payload = verifyJWT(accessToken);
    req.user = await getUserById(payload.userId);

    next();
  } catch (error) {
    // Try refresh token
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const newTokens = await refreshAccessToken(refreshToken);

    if (!newTokens) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    setAuthCookies(res, newTokens);
    req.user = newTokens.user;

    next();
  }
}
```

### Permission Middleware

```typescript
// packages/core/src/rbac/middleware.ts
export function authorize(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}
```

## Environment Configuration

### API Environment Variables

```bash
# apps/api/.env
DATABASE_URL="mysql://user:pass@localhost:3306/cms"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
UPLOAD_PATH="/uploads"
MAX_FILE_SIZE="10MB"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
```

### Web Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# For production builds
NEXT_PUBLIC_API_URL="https://api.yourcms.com/api/v1"
NEXT_PUBLIC_SITE_URL="https://yourcms.com"
```

## Development Setup

### Local Development

```bash
# Install dependencies
pnpm install

# Start database
docker-compose up -d db

# Run migrations
cd apps/api && pnpm prisma migrate dev

# Start API server
cd apps/api && pnpm dev

# Start web server (new terminal)
cd apps/web && pnpm dev
```

### Docker Development

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: cms
      MYSQL_USER: cms
      MYSQL_PASSWORD: cms
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

## Build & Deployment

### Production Builds

```json
// package.json scripts
{
  "build": "turbo run build",
  "build:api": "cd apps/api && pnpm build",
  "build:web": "cd apps/web && pnpm build",
  "start": "turbo run start"
}
```

### Docker Production

```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS production
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

This architecture provides a scalable, maintainable foundation for the CMS that closely matches Botble's plugin-based architecture while leveraging modern Next.js and Express.js patterns.

