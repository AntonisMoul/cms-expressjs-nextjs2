# CMS με Next.js 16 + Express.js

Ένα σύγχρονο Σύστημα Διαχείρισης Περιεχομένου (CMS) που έχει αναπτυχθεί με Next.js 16, Express.js και TypeScript. Το CMS αυτό είναι πλήρως συμβατό με το Botble CMS και παρέχει όλες τις βασικές λειτουργίες διαχείρισης περιεχομένου με ένα μοντέρνο, επεκτάσιμο αρχιτεκτονικό σχεδιασμό.

## ✨ Χαρακτηριστικά

### 🎯 Βασικές Λειτουργίες
- **Διαχείριση Σελίδων** - Δημιουργία και επεξεργασία στατικών σελίδων με πλούσιο περιεχόμενο
- **Διαχείριση Blog** - Άρθρα, κατηγορίες και ετικέτες με πλήρη σχέσεις
- **Βιβλιοθήκη Πολυμέσων** - Μεταφόρτωση, οργάνωση και διαχείριση αρχείων
- **Σύστημα Μενού** - Ιεραρχική κατασκευή πλοήγησης με drag-and-drop
- **Σύστημα Widgets** - Δυναμική τοποθέτηση περιεχομένου σε πλευρικές μπάρες
- **Πολυγλωσσική Υποστήριξη** - Διεπαφή και περιεχόμενο σε πολλές γλώσσες
- **Σύστημα Χρηστών & Ρόλων** - Διαχείριση χρηστών με έλεγχο πρόσβασης

### 🔧 Τεχνικά Χαρακτηριστικά
- **JWT Authentication** με httpOnly cookies
- **Role-Based Access Control (RBAC)** με λεπτομερή δικαιώματα
- **SEO-Friendly URLs** με αυτόματη δημιουργία slugs
- **Audit Logging** για πλήρη ιχνηλασιμότητα
- **Plugin Architecture** για επεκτασιμότητα
- **RESTful API** με ολοκληρωμένη τεκμηρίωση
- **Responsive Admin UI** με React/Next.js

## 🏗️ Αρχιτεκτονική

```
cms-expressjs-nextjs2/
├── packages/
│   ├── core/           # Πυρήνας του συστήματος
│   │   ├── auth/       # Σύστημα πιστοποίησης
│   │   ├── rbac/       # Ρόλοι και δικαιώματα
│   │   ├── settings/   # Ρυθμίσεις συστήματος
│   │   ├── audit/      # Καταγραφή ενεργειών
│   │   ├── slug/       # SEO-friendly URLs
│   │   └── locales/    # Πολυγλωσσική υποστήριξη
│   └── plugins/        # Πρόσθετα λειτουργίες
│       ├── pages/      # Διαχείριση σελίδων
│       ├── blog/       # Διαχείριση blog
│       ├── media/      # Βιβλιοθήκη πολυμέσων
│       ├── menu/       # Σύστημα μενού
│       └── widget/     # Σύστημα widgets
├── apps/
│   ├── api/           # Express.js API server
│   └── web/           # Next.js admin + public interface
└── docs/              # Τεκμηρίωση
```

## 🛠️ Τεχνολογίες

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - ORM για βάση δεδομένων
- **MySQL** - Βάση δεδομένων
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **Next.js 16** - React framework με App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Development Tools
- **Turbo** - Build system και task runner
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization

## 📋 Προαπαιτούμενα

- **Node.js** 18+
- **npm** ή **pnpm**
- **MySQL** 8.0+
- **Docker** (προαιρετικά για ανάπτυξη)

## 🚀 Εγκατάσταση

### 1. Clone το Repository
```bash
git clone https://github.com/yourusername/cms-expressjs-nextjs2.git
cd cms-expressjs-nextjs2
```

### 2. Εγκατάσταση Dependencies
```bash
# Με pnpm (συνιστάται)
pnpm install

# Ή με npm
npm install
```

### 3. Ρύθμιση Βάσης Δεδομένων
```bash
# Δημιουργία βάσης δεδομένων MySQL
CREATE DATABASE cms_db;
```

### 4. Ρύθμιση Environment Variables

#### API Server (.env)
```bash
# apps/api/.env
DATABASE_URL="mysql://username:password@localhost:3306/cms_db"
JWT_ACCESS_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Email (προαιρετικά)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE="10MB"

# Redis (προαιρετικά)
REDIS_URL="redis://localhost:6379"
```

#### Web App (.env.local)
```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 5. Database Migration
```bash
# Δημιουργία database schema
cd apps/api
pnpm prisma generate
pnpm prisma db push

# Δημιουργία admin χρήστη (προαιρετικά)
pnpm prisma db seed
```

### 6. Build και Εκκίνηση
```bash
# Build όλων των packages
pnpm build

# Εκκίνηση σε development mode
pnpm dev

# Ή ξεχωριστά
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

Το CMS θα είναι διαθέσιμο σε:
- **Admin Panel:** http://localhost:3000/admin
- **API Server:** http://localhost:3001
- **Public Site:** http://localhost:3000

## ⚡ Γρήγορη Εκκίνηση με Docker

Για την πιο εύκολη εγκατάσταση, χρησιμοποιήστε Docker:

```bash
# 1. Clone και setup
git clone https://github.com/yourusername/cms-expressjs-nextjs2.git
cd cms-expressjs-nextjs2
cp env.example .env

# 2. Επεξεργασία .env (προαιρετικά)
nano .env

# 3. Εκκίνηση όλων των υπηρεσιών
make docker-up

# 4. Επίσκεψη admin panel
open http://localhost:3000/admin
```

**Login:** admin@example.com / admin123

## 🛠️ Development με Make Commands

```bash
# Πλήρες setup (πρώτη φορά)
make setup

# Development servers
make dev          # API + Web ταυτόχρονα
make dev-api     # Μόνο API server
make dev-web     # Μόνο Web app

# Database operations
make db-studio   # Prisma Studio
make db-seed     # Δημιουργία δειγματικών δεδομένων
make db-reset    # Reset database

# Docker operations
make docker-up   # Start όλων των services
make docker-down # Stop όλων των services
```

## 📊 Environment Variables

Το project χρησιμοποιεί ένα ενιαίο `.env` αρχείο στο root:

```bash
# Database
DATABASE_URL="mysql://root:root@localhost:3306/cms_db"

# JWT Authentication
JWT_ACCESS_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-key"

# Server Configuration
API_PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

## ⚙️ Ρύθμιση

### Δημιουργία Admin Χρήστη

Μετά την πρώτη εκκίνηση, δημιουργήστε έναν admin χρήστη μέσω του API:

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword",
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin"
  }'
```

### Ρύθμιση Γλωσσών

Προσθέστε γλώσσες μέσω του admin panel ή API:

```bash
curl -X POST http://localhost:3001/api/v1/admin/locales \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ελληνικά",
    "locale": "el",
    "code": "el",
    "isDefault": true
  }'
```

## 📖 Χρήση

### Admin Panel

Το admin panel παρέχει πλήρη διαχείριση του CMS:

1. **Dashboard** - Επισκόπηση και στατιστικά
2. **Pages** - Δημιουργία και επεξεργασία σελίδων με SEO
3. **Blog** - Διαχείριση άρθρων, κατηγοριών και ετικετών
4. **Media** - Βιβλιοθήκη πολυμέσων με φακέλους και μεταφορτώσεις
5. **Appearance**
   - **Menus** - Ιεραρχική κατασκευή πλοήγησης
   - **Widgets** - Δυναμική τοποθέτηση περιεχομένου
6. **Settings** - Ρυθμίσεις συστήματος και γλωσσών
7. **Users** - Διαχείριση χρηστών και δικαιωμάτων

### Διαχείριση Περιεχομένου

#### Δημιουργία Σελίδας
```bash
curl -X POST http://localhost:3001/api/v1/pages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Καλώς Ήρθατε",
    "content": "<h1>Welcome to our CMS</h1>",
    "status": "published"
  }'
```

#### Δημιουργία Άρθρου Blog
```bash
curl -X POST http://localhost:3001/api/v1/blog/posts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Το Πρώτο μου Άρθρο",
    "description": "Περιγραφή άρθρου",
    "content": "<p>Περιεχόμενο άρθρου...</p>",
    "status": "published"
  }'
```

### Μεταφόρτωση Αρχείων
```bash
curl -X POST http://localhost:3001/api/v1/media/files/upload \
  -F "files=@image.jpg" \
  -F "folderId=0"
```

### API Endpoints

#### Authentication
```bash
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

#### Pages
```bash
GET    /api/v1/pages          # Λίστα σελίδων
POST   /api/v1/pages          # Δημιουργία σελίδας
GET    /api/v1/pages/:id      # Λεπτομέρειες σελίδας
PUT    /api/v1/pages/:id      # Ενημέρωση σελίδας
DELETE /api/v1/pages/:id      # Διαγραφή σελίδας
```

#### Blog
```bash
GET    /api/v1/blog/posts     # Λίστα άρθρων
POST   /api/v1/blog/posts     # Δημιουργία άρθρου
GET    /api/v1/blog/categories # Κατηγορίες
GET    /api/v1/blog/tags      # Ετικέτες
```

### Δημιουργία Περιεχομένου

#### Δημιουργία Σελίδας
```bash
curl -X POST http://localhost:3001/api/v1/pages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Καλώς Ήρθατε",
    "content": "<h1>Καλώς ήρθατε στο CMS μας</h1><p>Αυτό είναι ένα παράδειγμα σελίδας.</p>",
    "status": "published"
  }'
```

#### Δημιουργία Άρθρου Blog
```bash
curl -X POST http://localhost:3001/api/v1/blog/posts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Το Πρώτο μου Άρθρο",
    "description": "Περιγραφή του άρθρου",
    "content": "<p>Περιεχόμενο του άρθρου...</p>",
    "categoryIds": ["category-id"],
    "tagIds": ["tag-id"],
    "status": "published"
  }'
```

## 🔌 Plugins & Extensions

Το CMS υποστηρίζει plugin architecture για επεκτασιμότητα:

### Δημιουργία Plugin
```typescript
// packages/plugins/my-plugin/src/index.ts
import { PluginContract } from '@cms/core';

export const myPlugin: PluginContract = {
  name: 'my-plugin',
  version: '1.0.0',

  registerApiRoutes(router, ctx) {
    router.get('/my-feature', (req, res) => {
      res.json({ message: 'My custom feature' });
    });
  },

  getAdminNavigation() {
    return [{
      id: 'my-feature',
      label: 'My Feature',
      icon: 'ti ti-star',
      href: '/admin/my-feature',
    }];
  },
};
```

### Εγγραφή Plugin
```typescript
// apps/api/src/server.ts
import { myPlugin } from '@cms/my-plugin';

// Εγγραφή στο plugin router
if (myPlugin.registerApiRoutes) {
  myPlugin.registerApiRoutes(pluginRouter, { prisma });
}
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests με coverage
pnpm test:coverage

# API tests
cd apps/api && pnpm test

# Web app tests
cd apps/web && pnpm test
```

## 🚀 Deployment

### Docker Production (Συνιστάται)
```bash
# Build και εκκίνηση σε production
make docker-build
make docker-up

# Ή με docker-compose
docker-compose -f docker-compose.yml up -d

# Database migration σε production
docker-compose exec api pnpm prisma migrate deploy
```

### Manual Production Setup
```bash
# Build όλων των εφαρμογών
make build

# Ή ξεχωριστά
make build:api
make build:web

# Εκκίνηση σε production
NODE_ENV=production make start:api  # Terminal 1
NODE_ENV=production make start:web # Terminal 2
```

### Environment για Production
```bash
# .env για production
DATABASE_URL="mysql://user:pass@prod-db:3306/cms_prod"
JWT_ACCESS_SECRET="production-secret-key-here"
JWT_REFRESH_SECRET="production-refresh-key-here"
NODE_ENV=production
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api/v1"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Docker Services
Το `docker-compose.yml` περιλαμβάνει:
- **MySQL 8.0** - Βάση δεδομένων
- **Redis** - Cache και sessions
- **API Server** - Express.js backend
- **Web App** - Next.js frontend

### Scaling με Docker
```bash
# Scale API servers
docker-compose up -d --scale api=3

# Load balancer με nginx
docker-compose -f docker-compose.nginx.yml up -d
```

## 🛠️ Development Workflows

### Makefile Commands
Το project περιλαμβάνει ένα `Makefile` για εύκολη ανάπτυξη:

```bash
# Πρώτη εγκατάσταση
make setup           # Install + DB setup + seed

# Development
make dev             # API + Web servers
make dev-api         # Μόνο API
make dev-web         # Μόνο Web

# Database
make db-studio       # Prisma Studio GUI
make db-seed         # Δημιουργία δειγματικών δεδομένων
make db-reset        # Reset database

# Docker
make docker-up       # Start όλων των services
make docker-down     # Stop services
make docker-build    # Build images

# Production
make build           # Build all
make start:api       # Start API production
make start:web       # Start Web production

# Maintenance
make clean           # Καθαρισμός artifacts
make logs-api        # API container logs
make shell-api       # API container shell
```

### Project Structure
```
cms-expressjs-nextjs2/
├── packages/           # Shared packages
│   ├── core/          # Core business logic
│   └── plugins/       # Feature plugins
├── apps/              # Applications
│   ├── api/           # Express.js API
│   └── web/           # Next.js frontend
├── docker/            # Docker configuration
├── docs/              # Documentation
├── Makefile           # Development commands
├── docker-compose.yml # Docker orchestration
├── pnpm-workspace.yaml # Workspace config
└── turbo.json         # Build pipeline
```

### Monorepo με pnpm
Το project χρησιμοποιεί pnpm workspaces για διαχείριση dependencies:

```bash
# Install all dependencies
pnpm install

# Run command σε όλα τα packages
pnpm build          # Build all
pnpm dev           # Dev σε όλα τα packages
pnpm clean         # Καθαρισμός σε όλα

# Run σε συγκεκριμένο package
pnpm --filter=@cms/api dev
pnpm --filter=@cms/web build
```

## 🤝 Συμβολή

1. Fork το project
2. Δημιουργήστε feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit τις αλλαγές (`git commit -m 'Add some AmazingFeature'`)
4. Push στο branch (`git push origin feature/AmazingFeature`)
5. Ανοίξτε Pull Request

### Development Guidelines
- Χρησιμοποιήστε TypeScript για type safety
- Ακολουθήστε ESLint και Prettier rules
- Γράψτε tests για νέες λειτουργίες
- Update documentation
- Χρησιμοποιήστε conventional commits

### Plugin Development
Δημιουργήστε νέα plugins στο `packages/plugins/`:

```typescript
// packages/plugins/your-plugin/src/index.ts
export const yourPlugin: PluginContract = {
  name: 'your-plugin',
  registerApiRoutes(router) {
    // Add your API routes
  },
  getAdminNavigation() {
    // Return navigation items
  },
};
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MySQL container
make shell-db
mysql -u cms -p cms_db

# Reset database
make db-reset
```

**Port Already in Use**
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Permission Issues**
```bash
# Fix uploads directory permissions
sudo chown -R $USER:$USER uploads/
chmod 755 uploads/
```

### Logs & Debugging
```bash
# API logs
make logs-api

# Web app logs
make logs-web

# Database logs
make logs-db
```

## 📝 License

Αυτό το project είναι αδειοδοτημένο υπό την MIT License - δείτε το αρχείο [LICENSE](LICENSE) για λεπτομέρειες.

## 📞 Υποστήριξη

Για υποστήριξη και ερωτήσεις:
- Ανοίξτε issue στο GitHub
- Ελέγξτε την [τεκμηρίωση](docs/)
- Συμβουλευτείτε το [API documentation](docs/api.md)

## 🙏 Ευχαριστίες

- [Botble CMS](https://botble.com) για το αρχικό concept
- [Next.js](https://nextjs.org) για το εξαιρετικό framework
- [Prisma](https://prisma.io) για το ORM
- Όλη η open source κοινότητα

---

## 🎯 Key Features Summary

### ✅ **Complete CMS Solution**
- **Content Management**: Pages, Blog posts, Media library
- **Navigation**: Hierarchical menus with drag-and-drop
- **Widgets**: Dynamic content placement
- **Multi-language**: Built-in translation support
- **User Management**: Roles and permissions system

### ✅ **Modern Tech Stack**
- **Next.js 16**: Latest React framework with App Router
- **Express.js**: Scalable API server
- **TypeScript**: Full type safety
- **Prisma**: Modern database ORM
- **MySQL**: Reliable relational database

### ✅ **Developer Experience**
- **Monorepo**: Efficient package management
- **Docker**: Easy deployment and development
- **Makefile**: Simple development commands
- **Plugin Architecture**: Extensible and maintainable
- **Hot Reload**: Fast development cycles

### ✅ **Production Ready**
- **Security**: JWT auth, RBAC, input validation
- **Performance**: Optimized queries, caching
- **Scalability**: Microservices architecture
- **Monitoring**: Audit logs, error tracking
- **SEO**: Meta tags, sitemaps, friendly URLs

---

## 🚀 Quick Start Checklist

- [ ] Clone repository
- [ ] Copy `env.example` to `.env`
- [ ] Run `make setup` (or `make docker-up`)
- [ ] Visit http://localhost:3000/admin
- [ ] Login: admin@example.com / admin123
- [ ] Start creating content!

---

**🎉 Απολαύστε τη δημιουργία περιεχομένου με το νέο σας CMS!**

*Built with ❤️ using Next.js, Express.js, and TypeScript*
