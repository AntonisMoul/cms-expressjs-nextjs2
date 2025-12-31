# Botble CMS Parity Specification

This document outlines the complete feature set, data models, admin structure, and UX patterns from Botble CMS that must be replicated in the Next.js + Express.js reimplementation.

## Core Modules & Plugins

### 1. Authentication & Admin (ACL Core)
**Location:** `platform/core/acl/`

**Key Models & Migrations:**
- `users` table: id, first_name, last_name, username, email, password, avatar_id, super_user, manage_supers, permissions, last_login
- `activations` table: user_id, code, completed, completed_at
- `roles` table: id, slug, name, permissions, description, is_default, created_by, updated_by
- `role_users` table: user_id, role_id
- `user_meta` table: key, value, user_id

**Admin Routes:**
- `/admin/login`, `/admin/logout`
- `/admin/system/users` - CRUD users
- `/admin/system/roles` - CRUD roles

**Key Behaviors:**
- JWT access + refresh tokens in httpOnly cookies
- Role-based permissions system
- Super user functionality
- User activation system
- Password reset flow

### 2. Settings Store
**Location:** `platform/core/setting/`

**Key Models & Migrations:**
- `settings` table: id, key (unique), value

**Admin Routes:**
- `/admin/settings/general`
- `/admin/settings/email`
- `/admin/settings/media`
- Various other setting panels

**Key Behaviors:**
- Key-value storage for system configuration
- Categorized settings panels
- Dynamic setting forms

### 3. Audit/Activity Log
**Location:** `platform/plugins/audit-log/`

**Key Models & Migrations:**
- `audit_histories` table: user_id, module, request, action, user_agent, ip_address, reference_user, reference_id, reference_name, type

**Admin Routes:**
- Activity log viewing (likely under system)

**Key Behaviors:**
- Logs all admin actions (create/update/delete/publish)
- Tracks user actions with metadata

### 4. Pages
**Location:** `platform/packages/page/`

**Key Models & Migrations:**
- `pages` table: id, name, content, user_id, image, template, is_featured, description, status
- `pages_translations` table: (via language-advanced plugin)

**Admin Routes:**
- `/admin/pages` - List with filters, bulk actions, pagination
- `/admin/pages/create` - Create form
- `/admin/pages/[id]/edit` - Edit form
- `/admin/pages/[id]/visual-builder` - Visual page builder

**Key Behaviors & UX Rules:**
- **Create/Edit UI Layout:** 2-column responsive layout (desktop), stacked on mobile
- **Right Meta Boxes:**
  - Publish: status (draft/published), publish date, Save Draft/Publish/Update buttons
  - Permalink: slug field with auto-generation, uniqueness validation, live checking
  - Featured Image: single image upload
  - Gallery: multiple images
  - SEO: meta title, description, keywords
  - Language: locale selector
  - Translations: linked translations list with Create/Edit links
- **Slug System:** Auto-generated from title, manual editing, uniqueness validation, live availability checking
- **Visual Builder:** Drag-and-drop page builder with shortcodes
- **Status Workflow:** Draft → Publish with date scheduling

### 5. Blog (Posts, Categories, Tags)
**Location:** `platform/plugins/blog/`

**Key Models & Migrations:**
- `posts` table: id, name, description, content, status, author_id, author_type, is_featured, image, views, format_type
- `categories` table: id, name, parent_id, description, status, author_id, author_type, icon, order, is_featured, is_default
- `tags` table: id, name, author_id, author_type, description, status
- `post_tags` table: tag_id, post_id
- `post_categories` table: category_id, post_id
- `blog_translations` tables (via language-advanced)

**Admin Routes:**
- `/admin/blog/posts` - List with filters, bulk actions, pagination
- `/admin/blog/posts/create` - Create post
- `/admin/blog/posts/[id]/edit` - Edit post
- `/admin/blog/categories` - CRUD categories (hierarchical)
- `/admin/blog/tags` - CRUD tags
- `/admin/blog/reports` - Blog analytics

**Key Behaviors & UX Rules:**
- **Same Editor UX as Pages:** Identical 2-column layout, meta boxes, slug system
- **Category Hierarchy:** Nested categories with drag-and-drop ordering
- **Post-Tag Relationships:** Many-to-many with autocomplete
- **Featured Posts:** Special designation
- **Post Formats:** Standard, video, gallery, etc.
- **Author Attribution:** Links to users
- **Bulk Operations:** Publish/unpublish, category assignment, deletion

### 6. Media Manager (Gallery)
**Location:** `platform/plugins/gallery/`

**Key Models & Migrations:**
- `galleries` table: id, name, description, is_featured, images (JSON), user_id, slug

**Admin Routes:**
- `/admin/galleries` - CRUD galleries
- Media upload/management interface

**Key Behaviors:**
- Image galleries with multiple images
- Featured galleries
- Media library integration

### 7. Menus
**Location:** `platform/packages/menu/`

**Key Models & Migrations:**
- `menus` table: id, name, slug, status
- `menu_nodes` table: id, menu_id, parent_id, reference_id, reference_type, url, icon_font, position, title, css_class, target
- `menu_locations` table: menu_id, location

**Admin Routes:**
- `/admin/menus` - CRUD menus
- Drag-and-drop menu builder interface

**Key Behaviors:**
- Hierarchical menu structure
- Menu locations (header, footer, etc.)
- Link to pages, posts, categories, custom URLs
- Menu item customization (CSS classes, target)

### 8. Widgets
**Location:** `platform/packages/widget/`

**Key Models & Migrations:**
- `widgets` table: id, widget_id, sidebar_id, theme, position, data

**Admin Routes:**
- `/admin/widgets` - Widget management interface

**Key Behaviors:**
- Widget system with placements
- Core widgets: Text, Simple Menu
- Widget data storage as JSON
- Theme-specific sidebar support

### 9. Theme System & Theme Options
**Location:** `platform/packages/theme/`

**Admin Routes:**
- `/admin/themes` - Theme management
- `/admin/theme/options` - Theme options
- `/admin/appearance/custom-css` - Custom CSS
- `/admin/appearance/custom-js` - Custom JS
- `/admin/appearance/custom-html` - Custom HTML

**Key Behaviors:**
- Theme activation/deactivation
- Theme options per theme
- Custom CSS/JS/HTML injection
- Theme assets management

### 10. Slug/Permalink System
**Location:** `platform/packages/slug/`

**Key Models & Migrations:**
- `slugs` table: id, key, reference_id, reference_type, prefix

**Key Behaviors:**
- **Critical for Botble parity:** Exact slug behavior must match
- **Prefix system:** `pages` (no prefix), `blog` (blog prefix)
- **Auto-generation:** From title with transliteration (Greek → Latin)
- **Uniqueness:** Per entity type, with conflict resolution
- **Redirects:** 301 redirects on slug changes
- **Admin UI:** Permalink field with live validation

### 11. Language/Locales & Content Translations
**Location:** `platform/plugins/language/`, `platform/plugins/language-advanced/`

**Key Models & Migrations:**
- `languages` table: lang_id, lang_name, lang_locale, lang_code, lang_flag, lang_is_default, lang_order, lang_is_rtl
- `language_meta` table: reference_id, reference_type, lang_meta_code, lang_meta_origin
- Translation tables for each translatable model (pages_translations, blog_translations, etc.)

**Admin Routes:**
- `/admin/system/languages` - CRUD languages
- Translation management per content item

**Key Behaviors:**
- **Content Translations:** Linked translations (one translation group per locale)
- **Translation Workflow:** Create translation copies source content, regenerates slug
- **Language Switcher:** Frontend language switching
- **Default Language:** Configurable default locale

### 12. String Translations
**Location:** `platform/plugins/translation/`

**Key Models & Migrations:**
- `translations` table: id, status, locale, group, key, value

**Admin Routes:**
- `/admin/system/translations` - Translation management
- Theme translations
- Export/import functionality

**Key Behaviors:**
- Key-value translation storage
- Grouped translations (admin, theme, etc.)
- Bulk import/export
- Translation management UI

### 13. Cache & Sitemap
**Location:** `platform/packages/sitemap/`, core cache system

**Admin Routes:**
- Cache management (likely under system)
- Sitemap generation

**Key Behaviors:**
- Automatic sitemap generation
- Cache management for performance

## Admin Navigation Structure

Based on DashboardMenu registrations:

### Top Level Items (Priority Order):
1. **Dashboard** - Main dashboard
2. **Pages** (priority: 2) - `packages/page::pages.menu_name`
3. **Blog** (priority: 3) - `plugins/blog::base.menu_name`
   - Posts (priority: 10) - `plugins/blog::posts.menu_name`
   - Categories (priority: 20) - `plugins/blog::categories.menu_name`
   - Tags (priority: 30) - `plugins/blog::tags.menu_name`
   - Reports (priority: 40) - `plugins/blog::reports.name`
4. **Media** (priority: 5) - `plugins/gallery::gallery.menu_name`
5. **Menus** (priority: 2, under Appearance) - `packages/menu::menu.name`
6. **Widgets** (priority: 3, under Appearance) - `packages/widget::widget.name`
7. **Appearance** (priority: 2000) - `packages/theme::theme.appearance`
   - Themes (priority: 1)
   - Theme Options (priority: 4)
   - Custom CSS (priority: 5)
   - Custom JS (priority: 6)
   - Custom HTML (priority: 6)
   - Robots.txt (priority: 6)
8. **Settings** (top-level, priority: 10000) - System settings
9. **System** (priority: 10000) - Platform admin
   - Languages/Locales
   - Translations
   - Users
   - Roles
   - Other system tools

## Critical UX Patterns to Replicate

### 1. Admin List Screens
- **Table Layout:** Consistent table with sortable columns, filters, search
- **Bulk Actions:** Checkbox selection with bulk operations
- **Pagination:** Standard pagination controls
- **Filters:** Status filters, date ranges, author filters
- **Actions:** Edit, Delete, Clone buttons per row

### 2. Create/Edit Forms
- **2-Column Layout:** Content editor (left), meta boxes (right)
- **Responsive:** Stacked on mobile
- **Meta Boxes:** Collapsible panels with consistent styling
- **Action Buttons:** Save Draft, Publish/Update, Preview
- **Status Management:** Draft/Published with scheduling

### 3. Slug/Permalink Field
- **Auto-generation:** From title input
- **Manual Editing:** Direct slug editing
- **Live Validation:** AJAX uniqueness checking
- **Visual Feedback:** Available/unavailable indicators
- **Transliteration:** Greek characters to Latin equivalents

### 4. Translation Management
- **Linked Translations:** One content item per locale in translation group
- **Translation UI:** Language tabs or selector
- **Copy Source:** Create translation copies content from source
- **Slug Regeneration:** New slug generated for target locale

### 5. Media Management
- **Upload Interface:** Drag-and-drop, multiple file support
- **Gallery Integration:** Multiple image selection
- **Featured Image:** Single image selection

## Implementation Priority

1. **Core Infrastructure:** Auth, RBAC, Settings, Audit Log
2. **Slug System:** Critical for URL management
3. **Language/Locales:** For multilingual support
4. **Pages:** With exact Botble editor UX
5. **Blog:** Same patterns as Pages
6. **Media/Gallery:** File management
7. **Menus & Widgets:** Site structure
8. **Themes & Appearance:** Visual customization
9. **String Translations:** Complete i18n
10. **Cache & Sitemap:** Performance optimization

This specification ensures the Next.js implementation maintains complete behavioral and UX parity with Botble CMS.
