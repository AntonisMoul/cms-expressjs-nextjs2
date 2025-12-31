# Botble CMS - Next.js + Express.js Reimplementation

A modern, scalable CMS built with Next.js 16 and Express.js, reimplementing the Botble CMS functionality with contemporary web technologies.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- Docker & Docker Compose (recommended)

### Installation

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd cms-expressjs-nextjs2
   ```

2. **Run setup script:**
   ```bash
   # Automatic setup (recommended)
   pnpm run setup

   # Or manual setup:
   pnpm install
   copy env.example.txt .env
   # Edit .env with your configuration
   docker-compose up -d
   pnpm db:push
   pnpm db:seed
   pnpm build
   ```

   **Windows users:** Use `copy` instead of `cp` and run commands in PowerShell or Command Prompt.

3. **Start development:**
   ```bash
   pnpm dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - API: http://localhost:3001
   - Database Studio: `pnpm db:studio`
   - MailHog (Email Testing): http://localhost:8025

## Development

### Available Scripts
```bash
# Development
pnpm dev              # Start development servers
pnpm build            # Build all packages
pnpm start            # Start production servers

# Database
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Create and run migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio

# Utilities
pnpm clean            # Clean build artifacts and node_modules
pnpm type-check       # Run TypeScript type checking
pnpm setup            # Run initial setup (Linux/Mac)
```

### Default Admin Credentials
After running `pnpm db:seed`, you can login with:
- **Email**: admin@example.com
- **Password**: admin123

**⚠️ Important**: Change these credentials in production!

### Project Structure
```
├── apps/
│   ├── api/              # Express.js API server
│   └── web/              # Next.js frontend
├── packages/
│   ├── core/             # Shared core functionality
│   ├── shared/           # Shared types and utilities
│   ├── ui/               # UI components
│   └── plugins/          # Feature plugins
├── docs/                 # Documentation
├── docker-compose.yml    # Development services
└── env.example.txt       # Environment variables template
```

### Adding New Features
1. Create a new plugin in `packages/plugins/`
2. Implement the plugin interface
3. Register the plugin in `apps/api/src/index.ts`
4. Add admin routes in `apps/web/app/admin/`
5. Update the admin navigation

## Deployment

### Production Checklist
- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT secrets
- [ ] Set up production database
- [ ] Configure Redis for caching
- [ ] Set up SMTP for emails
- [ ] Enable SSL/HTTPS
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and logging

### Environment Variables for Production
```bash
NODE_ENV=production
DATABASE_URL=mysql://prod_user:prod_pass@prod_host:3306/prod_db
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
REDIS_URL=redis://prod-redis:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://yourdomain.com
SITE_URL=https://yourdomain.com
COOKIE_SECURE=true
```

### Docker Production Setup
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=prod_password
    volumes:
      - mysql_prod_data:/var/lib/mysql
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm type-check`
5. Submit a pull request

## License

This project is licensed under the MIT License.

### Environment Configuration

Copy `env.example.txt` to `.env` and configure:

```bash
# Required settings
NODE_ENV=development
DATABASE_URL=mysql://cms:cms@localhost:3306/cms_db
JWT_SECRET=your-secure-jwt-secret-here
JWT_REFRESH_SECRET=your-secure-refresh-secret-here

# Optional settings
FRONTEND_URL=http://localhost:3000
SITE_URL=http://localhost:3000
SMTP_HOST=localhost
SMTP_PORT=1025
REDIS_URL=redis://localhost:6379
```

See `env.example.txt` for all available configuration options.

## Features

### Core Functionality ✅
- **Authentication**: JWT-based auth with httpOnly cookies
- **RBAC**: Role-based access control with permissions
- **Settings Store**: Key-value configuration system
- **Audit Logging**: Complete admin action tracking
- **Slug System**: Permalink management with transliteration
- **Locales**: Multi-language support with content translations

### Plugins System ✅
- **Pages Plugin**: Static pages with SEO and content management
- **Blog Plugin**: Posts, categories, tags with full blogging features
- **Media Manager**: File uploads, galleries, image processing
- **Menu Builder**: Hierarchical navigation with custom links
- **Widgets System**: Content widgets and sidebar management
- **Themes & Appearance**: Theme management with customization options
- **System Tools**: Redirects, cache, sitemap, maintenance tools
- **Translations**: String translations with import/export

### Architecture
- **Monorepo**: Turborepo with pnpm workspaces
- **API**: Express.js with TypeScript
- **Frontend**: Next.js 16 App Router with Tailwind CSS
- **Database**: MySQL with Prisma ORM
- **Plugin System**: Modular, extensible architecture
- **Docker**: Containerized development environment

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- pnpm

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd cms-expressjs-nextjs2
pnpm install
```

2. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Set up database:**
```bash
# Generate Prisma client
pnpm db:push

# Seed initial data
pnpm db:seed
```

4. **Start development servers:**
```bash
# Terminal 1: API server
pnpm dev --filter=api

# Terminal 2: Web server
pnpm dev --filter=web
```

5. **Access the application:**
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3001/api/v1
- **Health Check**: http://localhost:3001/health

## Development

### Available Scripts
```bash
# Development
pnpm dev                    # Start all services
pnpm build                  # Build all packages
pnpm start                  # Start production servers

# Database
pnpm db:migrate            # Run database migrations
pnpm db:push               # Push schema changes
pnpm db:seed               # Seed database
pnpm db:studio             # Open Prisma Studio

# Code Quality
pnpm lint                  # Run ESLint
pnpm type-check            # Run TypeScript checks
```

### Project Structure
```
cms-expressjs-nextjs2/
├── apps/
│   ├── api/               # Express.js API server
│   └── web/               # Next.js web application
├── packages/
│   ├── core/              # Core business logic
│   ├── shared/            # Shared types and utilities
│   ├── ui/                # Shared UI components
│   └── plugins/           # Feature plugins
├── docs/                  # Documentation
└── tools/                 # Development tools
```

## API Documentation

### Authentication
```bash
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Core Endpoints
```bash
# Users
GET  /api/v1/users
GET  /api/v1/users/:id

# Settings
GET  /api/v1/settings
POST /api/v1/settings
PUT /api/v1/settings/bulk

# Locales
GET  /api/v1/system/locales
POST /api/v1/system/locales
PUT /api/v1/system/locales/:id

# Slugs
GET  /api/v1/admin/slugs/check
POST /api/v1/admin/slugs/generate
```

## Botble Parity

This reimplementation maintains complete functional parity with Botble CMS:

- **Admin UX**: Identical navigation, forms, and workflows
- **Data Models**: All tables and relationships preserved
- **Slug Behavior**: Exact permalink generation and validation
- **Translation System**: Linked content translations
- **Plugin Architecture**: Extensible module system

## Contributing

1. Follow the established patterns in existing code
2. Add TypeScript types for all new functionality
3. Include proper error handling and validation
4. Update documentation for new features
5. Ensure tests pass before submitting PRs

## License

This project is a reimplementation inspired by Botble CMS. Please refer to the original Botble CMS license for any licensing considerations.
