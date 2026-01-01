# Botble CMS Parity Specification

This document outlines the modules, data models, admin routes, and key behaviors that must be replicated in the Next.js + Express.js re-implementation to achieve feature parity with Botble CMS.

## Core Modules

### 1. Authentication & Admin (platform/core/acl)

**Data Models:**
- `users` table: id, first_name, last_name, username, email, password, avatar_id, super_user, manage_supers, permissions, last_login, timestamps
- `roles` table: id, slug, name, permissions, description, is_default, created_by, updated_by, timestamps
- `role_users` table: id, user_id, role_id, timestamps
- `user_meta` table: id, key, value, user_id, timestamps
- `activations` table: id, user_id, code, completed, completed_at, timestamps

**Admin Routes:**
- `/admin/users` - User management
- `/admin/roles` - Role management
- `/admin/profile` - User profile

**Key Behaviors:**
- JWT access + refresh tokens in httpOnly cookies
- Super admin permissions system
- Role-based access control (RBAC)
- User activation system

### 2. Settings Store (platform/core/setting)

**Data Models:**
- `settings` table: id, key (unique), value, timestamps

**Admin Routes:**
- `/admin/settings` - Global settings management

**Key Behaviors:**
- Key-value store for application configuration
- Cached settings retrieval

### 3. Audit/Activity Log (platform/plugins/audit-log)

**Data Models:**
- `audit_histories` table: id, user_id, module, request, action, user_agent, ip_address, reference_user, reference_id, reference_name, type, timestamps

**Admin Routes:**
- `/admin/system/audit-logs` - Activity log viewer

**Key Behaviors:**
- Automatic logging of admin actions (create/update/delete/publish)
- IP address and user agent tracking
- Reference entity tracking

### 4. Media Manager (platform/core/media)

**Data Models:**
- `media_folders` table: id, user_id, name, slug, parent_id, timestamps, soft_deletes
- `media_files` table: id, user_id, name, folder_id, mime_type, size, url, options, timestamps, soft_deletes
- `media_settings` table: id, key, value, media_id, user_id, timestamps

**Admin Routes:**
- `/admin/media` - Media library with folder structure

**Key Behaviors:**
- Hierarchical folder structure
- Multiple storage drivers (S3, local, etc.)
- Image thumbnails and metadata
- Bulk operations

## Content Modules

### 5. Pages (platform/packages/page)

**Data Models:**
- `pages` table: id, name, content, user_id, image, template, is_featured, description, status, timestamps
- `pages_translations` table: lang_code, pages_id, name, description, content (composite primary key)

**Admin Routes:**
- `/admin/pages` - Page listing with filters/pagination/bulk actions
- `/admin/pages/create` - Page creation form
- `/admin/pages/{id}` - Page edit form
- `/admin/pages/{id}/visual-builder` - Visual page builder

**Admin UI Structure:**
- **List Screen:** Table with columns (Name, Author, Status, Created Date, Actions)
- **Create/Edit Screen:** 2-column layout on desktop, stacked on mobile
  - **Left Column:** Content editor with title, content (rich text/visual builder)
  - **Right Column:** Meta boxes stacked vertically:
    - **Publish Box:** Status (Draft/Published), Publish Date, Save Draft/Publish/Update buttons
    - **Permalink Box:** Auto-generated slug from title, manual edit with uniqueness validation
    - **Featured Image Box:** Single image upload/selection
    - **Gallery Box:** Multiple images for page gallery
    - **SEO Box:** Meta title, meta description, meta keywords
    - **Language Box:** Current language selector
    - **Translations Box:** Links to create/edit translations in other languages

**Key Behaviors:**
- Visual page builder with drag-and-drop shortcodes
- Multilingual content with linked translations
- SEO meta fields
- Status workflow (draft → published)
- Author attribution

### 6. Blog Posts (platform/plugins/blog)

**Data Models:**
- `posts` table: id, name, description, content, status, author_id, author_type, is_featured, image, views, format_type, timestamps
- `categories` table: id, name, parent_id, description, status, author_id, author_type, icon, order, is_featured, is_default, timestamps
- `tags` table: id, name, author_id, author_type, description, status, timestamps
- `post_tags` table: tag_id, post_id (composite key)
- `post_categories` table: category_id, post_id (composite key)
- `posts_translations` table: lang_code, posts_id, name, description, content (composite primary key)
- `categories_translations` table: lang_code, categories_id, name, description (composite primary key)
- `tags_translations` table: lang_code, tags_id, name, description (composite primary key)

**Admin Routes:**
- `/admin/blog/posts` - Post listing
- `/admin/blog/posts/create` - Post creation
- `/admin/blog/posts/{id}` - Post editing
- `/admin/blog/categories` - Category management
- `/admin/blog/tags` - Tag management
- `/admin/blog/reports` - Blog analytics/reports

**Admin UI Structure:**
- Same 2-column layout as Pages but with additional meta boxes:
  - **Categories Box:** Multi-select category assignment
  - **Tags Box:** Tag input with autocomplete/suggestions
- **Category Management:** Tree structure for hierarchical categories
- **Tag Management:** Simple list with usage counts

**Key Behaviors:**
- Hierarchical categories with parent-child relationships
- Many-to-many tag relationships
- Post format types (standard, video, gallery, etc.)
- Author attribution with polymorphic relationship
- View counting
- Featured posts

### 7. Media Manager (see above - integrated with content)

### 8. Menus (platform/packages/menu)

**Data Models:**
- `menus` table: id, name, slug, status, timestamps
- `menu_nodes` table: id, menu_id, parent_id, reference_id, reference_type, url, icon_font, position, title, css_class, target, has_child, timestamps
- `menu_locations` table: id, menu_id, location, timestamps

**Admin Routes:**
- `/admin/appearance/menus` - Menu management
- `/admin/appearance/menus/create` - Menu creation
- `/admin/appearance/menus/{id}` - Menu editing

**Key Behaviors:**
- Hierarchical menu structure with drag-and-drop ordering
- Multiple menu locations (header, footer, etc.)
- Reference to any content type (pages, posts, categories, custom URLs)
- Menu caching for performance

### 9. Widgets (platform/packages/widget)

**Data Models:**
- `widgets` table: id, widget_id, sidebar_id, theme, position, data, timestamps

**Admin Routes:**
- `/admin/appearance/widgets` - Widget management

**Key Behaviors:**
- Widget placement in sidebars/areas
- Theme-specific widget areas
- Configurable widget data
- Core widgets: Text, Custom Menu, etc.

### 10. Theme System (platform/packages/theme)

**Data Models:**
- Theme options stored in settings table with theme-specific keys

**Admin Routes:**
- `/admin/appearance/themes` - Theme selection
- `/admin/appearance/theme-options` - Theme configuration
- `/admin/appearance/custom-css` - Custom CSS editor
- `/admin/appearance/custom-js` - Custom JS editor
- `/admin/appearance/robots-txt` - Robots.txt editor

**Key Behaviors:**
- Theme activation/deactivation
- Theme options panels
- Custom CSS/JS injection
- Robots.txt management

## System Modules

### 11. Slug/Permalink System (platform/packages/slug)

**Data Models:**
- `slugs` table: id, key, reference_id, reference_type, prefix, timestamps

**Key Behaviors:**
- Automatic slug generation from titles
- Module-specific prefixes (blog/, page/, etc.)
- Slug uniqueness validation
- 301 redirects on slug changes
- Frontend slug resolution to content

### 12. Locales & Content Translations (platform/plugins/language)

**Data Models:**
- `languages` table: lang_id, lang_name, lang_locale, lang_code, lang_flag, lang_is_default, lang_order, lang_is_rtl
- `language_meta` table: lang_meta_id, lang_meta_code, lang_meta_origin, reference_id, reference_type

**Admin Routes:**
- `/admin/settings/languages` - Language management

**Key Behaviors:**
- Multiple active languages
- Default language designation
- RTL language support
- URL prefixing for non-default languages
- Content translation linking

### 13. String Translations (platform/plugins/translation)

**Data Models:**
- `translations` table: id, status, locale, group, key, value, timestamps

**Admin Routes:**
- `/admin/system/translations` - Translation management

**Key Behaviors:**
- Key-value translation storage
- Grouped translations (admin, theme, plugin-specific)
- Import/export functionality
- Missing translation detection

### 14. Cache Management (platform/core/base)

**Admin Routes:**
- `/admin/system/cache` - Cache clearing tools

**Key Behaviors:**
- Multiple cache types (view, config, route, etc.)
- Bulk cache clearing

### 15. Sitemap (platform/packages/sitemap)

**Admin Routes:**
- `/admin/settings/sitemap` - Sitemap configuration

**Key Behaviors:**
- Automatic sitemap generation
- Search engine submission
- Configurable inclusion rules

## Admin Navigation Structure

Based on service provider registrations, the admin navigation should be organized as follows:

### Top Level Items (in priority order):
1. **Dashboard** (`/admin/dashboard`) - priority -9999
2. **Pages** (`/admin/pages`) - priority 2
3. **Blog** (parent menu) - priority 3
   - Posts (`/admin/blog/posts`)
   - Categories (`/admin/blog/categories`)
   - Tags (`/admin/blog/tags`)
   - Reports (`/admin/blog/reports`)
4. **Media** (`/admin/media`) - priority 999
5. **Appearance** (parent menu) - priority 2000
   - Themes (`/admin/appearance/themes`)
   - Theme Options (`/admin/appearance/theme-options`)
   - Menus (`/admin/appearance/menus`)
   - Widgets (`/admin/appearance/widgets`)
   - Custom CSS (`/admin/appearance/custom-css`)
   - Custom JS (`/admin/appearance/custom-js`)
   - Robots.txt (`/admin/appearance/robots-txt`)
6. **Settings** (top-level) - priority varies by module
7. **System** (panel section group) - various system tools
   - Languages (`/admin/settings/languages`)
   - Translations (`/admin/system/translations`)
   - Audit Logs (`/admin/system/audit-logs`)
   - Cache management
   - Sitemap settings

## Critical UX Rules

### Page/Post Editor Layout:
- **Responsive Design:** 2-column desktop, single column mobile
- **Meta Boxes:** Right sidebar with stacked boxes
- **Publish Box:** Always at top of right sidebar with primary action buttons
- **Permalink Field:** Auto-generates from title, validates uniqueness client and server-side
- **Status Workflow:** Draft → Published with scheduled publishing support
- **Translations:** Linked translations with copy-from-source functionality

### List Screens:
- **Consistent Structure:** Name, Author, Status, Date, Actions columns
- **Filters:** Status, Author, Date range
- **Bulk Actions:** Delete, Change Status, etc.
- **Pagination:** Standard with page size options

### Slug System:
- **Auto-generation:** Transliterate special characters (especially Greek to Latin)
- **Validation:** Real-time uniqueness checking
- **Redirects:** 301 redirects created when slugs change
- **Prefixes:** Module-specific (blog/, page/, etc.)

### Multilingual Support:
- **Content Translations:** Separate records linked by translation group
- **URL Structure:** Language prefixes for non-default locales
- **Fallbacks:** Default language fallback for missing translations

## Implementation Priorities

1. **Phase 1:** Core auth, RBAC, settings, audit log
2. **Phase 2:** Slug system, locales, media manager
3. **Phase 3:** Pages with full editor UX parity
4. **Phase 4:** Blog with categories/tags
5. **Phase 5:** Menus, widgets, theme system
6. **Phase 6:** Translation system, sitemap, remaining system tools

