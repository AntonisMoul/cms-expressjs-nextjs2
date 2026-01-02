# Botble CMS Parity Specification

This document inventories all modules, plugins, database schemas, admin routes, UX flows, and key behaviors in the Botble CMS reference implementation. This serves as the behavioral specification for the Node.js/TypeScript re-implementation.

## Table of Contents

1. [Core Modules](#core-modules)
2. [Packages](#packages)
3. [Plugins](#plugins)
4. [Database Schema](#database-schema)
5. [Admin Routes & UX Flows](#admin-routes--ux-flows)
6. [Key Behaviors](#key-behaviors)

---

## Core Modules

### ACL (Access Control List)

**Purpose**: Role-based access control (RBAC) system for admin users.

**Database Tables**:
- `users`: Admin users
  - `id`, `first_name`, `last_name`, `username` (unique, nullable), `email`, `password` (nullable), `avatar_id`, `super_user` (boolean), `manage_supers` (boolean), `permissions` (text/json), `last_login`, `created_at`, `updated_at`
- `roles`: User roles
  - `id`, `slug` (unique), `name`, `permissions` (text/json), `description`, `is_default` (tinyint), `created_by`, `updated_by`, `created_at`, `updated_at`
- `role_users`: Many-to-many relationship
  - `id`, `user_id`, `role_id`, `created_at`, `updated_at`
- `activations`: User activation codes
  - `id`, `user_id`, `code`, `completed` (boolean), `completed_at`, `created_at`, `updated_at`
- `user_meta`: User metadata key-value store
  - `id`, `key`, `value` (text), `user_id`, `created_at`, `updated_at`

**Admin Routes**:
- `/admin/users` - List users
- `/admin/users/create` - Create user
- `/admin/users/{id}` - Edit user
- `/admin/roles` - List roles
- `/admin/roles/create` - Create role
- `/admin/roles/{id}` - Edit role

**Key Behaviors**:
- Super users (`super_user=1`) bypass all permission checks
- Permissions stored as JSON/text in `roles.permissions` and `users.permissions`
- Permission format: `module.action` (e.g., `pages.create`, `blog.posts.index`)
- Default roles can be set (`is_default=1`)
- Users can have multiple roles via `role_users` table

---

### Base

**Purpose**: Core foundation providing base models, helpers, events, and admin UI components.

**Database Tables**: None (provides base functionality)

**Key Features**:
- Base model class with common behaviors
- Event system: `CreatedContentEvent`, `UpdatedContentEvent`, `DeletedContentEvent`
- Admin UI components (forms, tables, cards)
- Breadcrumb system
- Flash messages
- HTTP response helpers
- Meta boxes system for content editing

**Key Behaviors**:
- Content events trigger hooks for slugs, SEO, sitemap, etc.
- Meta boxes can be registered per content type
- Admin forms use consistent validation and error handling

---

### Dashboard

**Purpose**: Admin dashboard with customizable widgets.

**Database Tables**:
- `dashboard_widgets`: Available widget types
  - `id`, `name`, `created_at`, `updated_at`
- `dashboard_widget_settings`: User-specific widget configurations
  - `id`, `settings` (text/json), `user_id`, `widget_id`, `order` (tinyint), `status` (tinyint), `created_at`, `updated_at`

**Admin Routes**:
- `/admin` - Dashboard (main admin page)
- `/admin/widgets/hide` - Hide widget
- `/admin/widgets/hides` - Hide multiple widgets (POST)
- `/admin/widgets/order` - Update widget order (POST)
- `/admin/widgets/setting-item` - Edit widget setting (POST)

**Key Behaviors**:
- Widgets are user-specific (per `user_id`)
- Widgets can be hidden, reordered, and configured per user
- Widget order stored in `order` column (0-127)

---

### Media

**Purpose**: Media library for file uploads and management.

**Database Tables**:
- `media_folders`: Folder structure
  - `id`, `user_id`, `name`, `slug`, `parent_id` (default 0), `created_at`, `updated_at`, `deleted_at` (soft deletes)
- `media_files`: Files
  - `id`, `user_id`, `name`, `folder_id` (default 0), `mime_type`, `size` (integer), `url`, `options` (text/json), `alt` (nullable), `visibility` (nullable), `created_at`, `updated_at`, `deleted_at` (soft deletes)
- `media_settings`: Media settings
  - `id`, `key`, `value` (text), `media_id` (nullable), `user_id` (nullable), `created_at`, `updated_at`

**Admin Routes**:
- `/admin/media` - Media library (AJAX-based UI)
- `/admin/media/upload` - Upload files
- `/admin/media/folders` - Manage folders

**Key Behaviors**:
- Hierarchical folder structure via `parent_id`
- Files support soft deletes
- `options` JSON field stores metadata (dimensions, thumbnails, etc.)
- `visibility` field controls public/private access
- Media can be organized by user (`user_id`)

**Queue Jobs** (expected):
- `media.processImage` - Generate thumbnails and process images after upload

---

### Setting

**Purpose**: System-wide settings key-value store.

**Database Tables**:
- `settings`: Settings storage
  - `id`, `key` (unique), `value` (text), `created_at`, `updated_at`

**Admin Routes**:
- `/admin/settings` - Settings index
- `/admin/settings/options` - General settings
- `/admin/settings/general` - General settings (GET/PUT)
- `/admin/settings/admin-appearance` - Admin UI appearance (GET/PUT)
- `/admin/settings/cache` - Cache management

**Key Behaviors**:
- Settings stored as key-value pairs
- Keys are unique
- Values stored as text (can contain JSON)
- Settings can be grouped by prefix (e.g., `media_*`, `sitemap_*`)

---

## Packages

### Page

**Purpose**: Static page management with translations and SEO.

**Database Tables**:
- `pages`: Pages
  - `id`, `name` (varchar 120), `content` (longtext), `user_id` (nullable), `image` (nullable), `template` (varchar 60, nullable), `description` (varchar 400, nullable), `status` (varchar 60, default 'published'), `created_at`, `updated_at`
- `pages_translations`: Page translations (when language-advanced plugin active)
  - `lang_code` (varchar 20), `pages_id`, `name`, `description`, `content`
  - Primary key: `(lang_code, pages_id)`

**Admin Routes**:
- `/admin/pages` - List pages
- `/admin/pages/create` - Create page
- `/admin/pages/{id}` - Edit page
- `/admin/pages/{id}/visual-builder` - Visual page builder
- `/admin/pages/{id}/preview` - Preview page (GET/POST)

**UX Flow - Create/Edit Page**:
1. Form fields:
   - **Left column**: Name, Content (rich text editor), Description
   - **Right meta boxes**:
     - **Publish**: Status dropdown (published/draft), Template selector
     - **Permalink**: Slug input with live availability check, prefix display
     - **Banner**: Image upload/selector
     - **Gallery**: Multiple image selector
     - **SEO**: Meta title, description, keywords, image
     - **Language**: Current locale selector
     - **Translations**: List linked translations, "Create translation" button
2. Slug generation:
   - Auto-generated from `name` field on create
   - Greek/non-Latin characters transliterated to Latin (e.g., "Ελλάδα" → "ellada")
   - Live availability check via AJAX
   - If taken, suggests `slug-2`, `slug-3`, etc.
   - Block publish/update if slug is taken
3. Translations:
   - When "Create translation" clicked, opens new page form
   - Copies content, SEO, banner, gallery from source
   - Slug generated/validated for target locale
   - Linked via `translationGroupId` (stored in meta or separate table)
   - Translation group + locale must be unique

**Key Behaviors**:
- Status: `published` or `draft`
- Pages have slugs via `slugs` table (reference_type=`Botble\Page\Models\Page`)
- Slug prefix: configurable via settings (default empty for pages)
- Visual builder: Optional drag-and-drop page builder using shortcodes
- Preview: Renders page in theme context before publishing

**Queue Jobs**:
- On publish: Enqueue `sitemap.generate` job

---

### Blog

**Purpose**: Blog posts, categories, and tags management.

**Database Tables**:
- `posts`: Blog posts
  - `id`, `name`, `description` (varchar 400), `content` (longtext), `status` (varchar 60, default 'published'), `author_id`, `author_type` (varchar 191), `is_featured` (tinyint), `image` (nullable), `views` (integer, default 0), `format_type` (varchar 30, nullable), `created_at`, `updated_at`
- `posts_translations`: Post translations
  - `lang_code`, `posts_id`, `name`, `description`, `content`
  - Primary key: `(lang_code, posts_id)`
- `categories`: Blog categories (hierarchical)
  - `id`, `name` (varchar 120), `parent_id` (default 0), `description` (varchar 400), `status` (varchar 60), `author_id`, `author_type`, `icon` (varchar 60), `order` (tinyint), `is_featured` (tinyint), `is_default` (tinyint), `created_at`, `updated_at`
- `categories_translations`: Category translations
  - `lang_code`, `categories_id`, `name`, `description`
- `tags`: Blog tags
  - `id`, `name` (varchar 120), `author_id`, `author_type`, `description` (varchar 400), `status` (varchar 60), `created_at`, `updated_at`
- `tags_translations`: Tag translations
  - `lang_code`, `tags_id`, `name`, `description`
- `post_categories`: Many-to-many posts ↔ categories
  - `category_id`, `post_id`
- `post_tags`: Many-to-many posts ↔ tags
  - `tag_id`, `post_id`

**Admin Routes**:
- `/admin/blog/posts` - List posts
- `/admin/blog/posts/create` - Create post
- `/admin/blog/posts/{id}` - Edit post
- `/admin/blog/categories` - List categories
- `/admin/blog/categories/create` - Create category
- `/admin/blog/categories/{id}` - Edit category
- `/admin/blog/categories/update-tree` - Update category hierarchy (PUT)
- `/admin/blog/categories/search` - Search categories (AJAX)
- `/admin/blog/tags` - List tags
- `/admin/blog/tags/create` - Create tag
- `/admin/blog/tags/{id}` - Edit tag
- `/admin/blog/reports` - Blog reports/analytics

**UX Flow - Create/Edit Post**:
- Similar to Pages: Name, Content, Description
- Additional fields:
  - Categories: Multi-select with tree view
  - Tags: Autocomplete input (creates tags on-the-fly)
  - Featured image
  - Format type (standard, video, gallery, etc.)
- Meta boxes: Publish, Permalink (prefix: "blog"), Banner, Gallery, SEO, Language, Translations

**Key Behaviors**:
- Slug prefix: `blog` (configurable via settings)
- Categories are hierarchical (`parent_id`)
- Categories can be reordered via drag-and-drop (`order` field)
- Posts can have multiple categories and tags
- Views counter (`views` field)
- Featured posts (`is_featured=1`)

**Queue Jobs**:
- On publish: Enqueue `sitemap.generate` job

---

### Slug

**Purpose**: Permalink/slug management system.

**Database Tables**:
- `slugs`: Slugs
  - `id`, `key` (varchar 191, the slug string), `reference_id` (bigint), `reference_type` (varchar 191, model class), `prefix` (varchar 120, default ''), `created_at`, `updated_at`
- `slugs_translations`: Slug translations
  - `lang_code` (varchar 20), `slugs_id`, `key`, `prefix`
  - Primary key: `(lang_code, slugs_id)`

**Key Behaviors**:
- Slugs link to any model via `reference_type` + `reference_id`
- Prefixes are model-specific (e.g., `blog` for posts, empty for pages)
- Uniqueness: `(key, prefix)` must be unique
- Slug generation:
  - Auto-transliterates non-Latin to Latin (unless setting disabled)
  - If slug exists, appends `-2`, `-3`, etc.
  - Can be manually edited
- Slug changes: Old slug should redirect to new slug (301 redirect)
- Translations: Each locale can have different slug for same content

**Admin Routes**:
- No direct admin UI (used by other modules)
- AJAX endpoint for slug availability check

---

### Menu

**Purpose**: Menu builder for navigation menus.

**Database Tables**:
- `menus`: Menu containers
  - `id`, `name` (varchar 120), `slug` (varchar 120, unique, nullable), `status` (varchar 60, default 'published'), `created_at`, `updated_at`
- `menu_nodes`: Menu items (hierarchical)
  - `id`, `menu_id`, `parent_id` (default 0), `reference_id` (nullable), `reference_type` (nullable), `url` (varchar 120, nullable), `icon_font` (varchar 50, nullable), `position` (tinyint, default 0), `title` (varchar 120, nullable), `css_class` (varchar 120, nullable), `target` (varchar 20, default '_self'), `has_child` (tinyint, default 0), `created_at`, `updated_at`
- `menu_locations`: Menu-to-location assignments
  - `id`, `menu_id`, `location` (varchar 120), `created_at`, `updated_at`

**Admin Routes**:
- `/admin/menus` - List menus
- `/admin/menus/create` - Create menu
- `/admin/menus/{id}` - Edit menu (drag-and-drop builder)
- `/admin/menus/ajax/get-node` - Get menu node data (AJAX)

**UX Flow - Menu Builder**:
1. Create/edit menu: Enter name, slug
2. Menu builder interface:
   - Drag-and-drop tree structure
   - Add items: Custom link, Page, Category, Tag, etc.
   - Items can reference content (`reference_type` + `reference_id`)
   - Items can have icons, CSS classes, target (_self/_blank)
   - Items can be nested (via `parent_id`)
   - Position stored in `position` field

**Key Behaviors**:
- Menus can be assigned to locations (e.g., "header", "footer")
- Menu items can reference pages, posts, categories, or be custom links
- Hierarchical structure via `parent_id`
- `has_child` flag indicates if node has children

---

### Widget

**Purpose**: Widget system for theme sidebars.

**Database Tables**:
- `widgets`: Widget instances
  - `id`, `widget_id` (varchar 120, widget type), `sidebar_id` (varchar 120), `theme` (varchar 120), `position` (tinyint, default 0), `data` (text/json), `created_at`, `updated_at`

**Admin Routes**:
- `/admin/widgets` - Widget management page
- `/admin/widgets/load-widget` - Load widget form (AJAX)
- `/admin/widgets/get-widget-form` - Get widget configuration form (AJAX)
- `/admin/widgets/save-widgets-to-sidebar` - Save widgets to sidebar (POST)
- `/admin/widgets/delete` - Delete widget (DELETE)

**UX Flow - Widget Management**:
1. Widget page shows available sidebars (defined by theme)
2. Drag widgets from "Available Widgets" to sidebars
3. Click widget to configure (opens modal/form)
4. Widget data stored in `data` JSON field
5. Position in sidebar stored in `position` field

**Key Behaviors**:
- Widgets are theme-specific (`theme` field)
- Widgets can be locale-specific (theme name + locale suffix)
- Widget data is JSON (widget-specific configuration)
- Position determines order in sidebar (0 = first)

---

### Theme

**Purpose**: Theme management and theme options.

**Database Tables**: None (themes are file-based, options stored in `settings` table)

**Admin Routes**:
- `/admin/theme/all` - List available themes
- `/admin/theme/active` - Activate theme (POST)
- `/admin/theme/remove` - Remove theme (POST)
- `/admin/theme/options/{id?}` - Theme options page (GET/POST)
- `/admin/theme/custom-css` - Custom CSS editor (GET/POST)

**UX Flow - Theme Options**:
1. Theme options organized in sections/tabs
2. Each section has form fields (text, textarea, image, color, etc.)
3. Options saved to `settings` table with prefix (e.g., `theme_*`)
4. Custom CSS: Editor for theme-specific CSS file

**Key Behaviors**:
- Themes stored in `platform/themes/` directory
- Active theme stored in settings
- Theme options can be registered by theme or plugins
- Options are key-value pairs in `settings` table

---

### Sitemap

**Purpose**: XML sitemap generation for SEO.

**Database Tables**: None (sitemap is generated dynamically)

**Admin Routes**:
- `/admin/sitemap/settings` - Sitemap settings
- Public: `/sitemap.xml` - Generated sitemap

**Key Behaviors**:
- Sitemap generated on-demand or cached
- Includes: Pages, Posts, Categories (published only)
- Items per page configurable (default 1000)
- Can be enabled/disabled via settings
- Triggers:
  - On content publish/update (via event listener)
  - Scheduled daily (via scheduler)
  - Manual generation from admin

**Queue Jobs**:
- `sitemap.generate` - Generate sitemap XML
- `sitemap.indexnow` - Submit to IndexNow API (if enabled)

---

### SEO Helper

**Purpose**: SEO meta tags management.

**Database Tables**:
- `meta_boxes`: SEO metadata
  - `id`, `reference_id`, `reference_type`, `meta_key` (varchar 191), `meta_value` (text), `created_at`, `updated_at`

**Key Behaviors**:
- SEO data stored per content item via `meta_boxes` table
- Meta keys: `seo_title`, `seo_description`, `seo_keywords`, `seo_image`
- Automatically saved on content create/update
- Used by themes to render `<meta>` tags

---

### Translation

**Purpose**: String translation management (UI strings, not content).

**Database Tables**: None (translations stored in `lang/` files)

**Admin Routes**:
- `/admin/translations` - Translation management
- `/admin/translations/group/edit` - Edit translation group (POST)

**UX Flow**:
1. List all translation keys grouped by file/group
2. Show default locale (English) and target locale columns
3. Inline editing: Click value to edit
4. Translations saved to `lang/{locale}/{group}.php` files

**Key Behaviors**:
- Translations organized by groups (files)
- Keys can be nested (dot notation: `group.key.subkey`)
- Default locale: English (`en`)
- Supports import/export

---

## Plugins

### Language

**Purpose**: Multi-language support (locale management).

**Database Tables**:
- `languages`: Available locales
  - `id`, `lang_name`, `lang_code` (varchar 20), `lang_flag` (varchar 20), `lang_is_default` (tinyint), `lang_is_rtl` (tinyint), `lang_order` (tinyint), `created_at`, `updated_at`

**Admin Routes**:
- `/admin/languages` - List languages
- `/admin/languages/create` - Create language
- `/admin/languages/{id}` - Edit language

**Key Behaviors**:
- One default language (`lang_is_default=1`)
- Languages can be RTL (`lang_is_rtl=1`)
- Language order determines display order
- Language switcher in admin and frontend

---

### Language Advanced

**Purpose**: Content translations (linked translations).

**Database Tables**: Creates `*_translations` tables for translatable models.

**Key Behaviors**:
- Enables translation tables for: Pages, Posts, Categories, Tags, Galleries, Blocks
- Translation group ID links translations together
- When creating translation, copies content from source
- Each locale has separate slug (via `slugs_translations`)

---

### Audit Log

**Purpose**: Activity logging for admin actions.

**Database Tables**:
- `audit_histories`: Audit log entries
  - `id`, `user_id`, `module` (varchar 60), `request` (text/json), `action` (varchar 120), `user_agent` (text), `ip_address` (varchar 45), `reference_user` (bigint), `reference_id` (bigint), `reference_name` (varchar 255), `type` (varchar 20), `created_at`, `updated_at`

**Admin Routes**:
- `/admin/audit-logs` - View audit logs

**Key Behaviors**:
- Logs all admin actions (create, update, delete)
- Stores request data, user agent, IP address
- Can filter by module, user, date range

---

### Gallery

**Purpose**: Image gallery management.

**Database Tables**:
- `galleries`: Gallery containers
  - `id`, `name` (varchar 120), `description` (varchar 400), `image` (varchar 191), `user_id` (nullable), `is_featured` (tinyint), `order` (tinyint), `status` (varchar 60), `created_at`, `updated_at`
- `gallery_meta`: Gallery images (many-to-many via meta)
  - Uses `meta_boxes` table with `reference_type='Botble\Gallery\Models\Gallery'`
- `galleries_translations`: Gallery translations
  - `lang_code`, `galleries_id`, `name`, `description`

**Admin Routes**:
- `/admin/galleries` - List galleries
- `/admin/galleries/create` - Create gallery
- `/admin/galleries/{id}` - Edit gallery

**Key Behaviors**:
- Galleries contain multiple images (stored as meta)
- Galleries can be featured, ordered
- Supports translations

---

### Member

**Purpose**: Frontend user/member management.

**Database Tables**:
- `members`: Frontend users
  - `id`, `first_name`, `last_name`, `email` (unique), `password`, `avatar_id`, `dob` (date), `phone` (varchar 20), `description` (text), `status` (varchar 60), `created_at`, `updated_at`
- `member_activity_logs`: Member activity
  - `id`, `member_id`, `action` (varchar 120), `reference_url` (text), `reference_name` (varchar 255), `ip_address` (varchar 45), `user_agent` (text), `created_at`, `updated_at`
- `member_password_resets`: Password reset tokens
  - `email`, `token`, `created_at`

**Admin Routes**:
- `/admin/members` - List members
- `/admin/members/create` - Create member
- `/admin/members/{id}` - Edit member

**Key Behaviors**:
- Separate from admin users
- Members can register/login on frontend
- Activity logging for member actions

---

### Contact

**Purpose**: Contact form submissions.

**Database Tables**:
- `contacts`: Contact submissions
  - `id`, `name` (varchar 60), `email` (varchar 60), `phone` (varchar 60), `address` (text), `subject` (varchar 120), `content` (text), `status` (varchar 60), `created_at`, `updated_at`

**Admin Routes**:
- `/admin/contacts` - List contact submissions
- `/admin/contacts/{id}` - View contact

**Key Behaviors**:
- Contact forms on frontend submit to admin
- Status: `read`, `unread`
- Can send email notifications

---

### Custom Field

**Purpose**: Custom fields for content types.

**Database Tables**:
- `custom_fields`: Field definitions
  - `id`, `use_for` (varchar 60), `use_for_id` (bigint, nullable), `field_item_id` (bigint, nullable), `slug` (varchar 191), `type` (varchar 60), `value` (text), `order` (tinyint), `status` (varchar 60), `created_at`, `updated_at`
- `custom_field_items`: Field items (for repeater fields)
  - `id`, `custom_field_id`, `field_item_id` (bigint, nullable), `parent_id` (bigint, nullable), `title` (varchar 191), `slug` (varchar 191), `type` (varchar 60), `value` (text), `order` (tinyint), `created_at`, `updated_at`
- `custom_fields_translations`: Field translations
  - `lang_code`, `custom_fields_id`, `value`

**Key Behaviors**:
- Custom fields can be attached to any content type
- Supports various field types (text, textarea, image, repeater, etc.)
- Fields can be grouped and ordered

---

## Database Schema Summary

### Core Tables

- `users` - Admin users
- `roles` - User roles
- `role_users` - User-role assignments
- `activations` - User activation codes
- `user_meta` - User metadata
- `settings` - System settings (key-value)
- `sessions` - User sessions
- `cache` - Cache storage
- `jobs` - Queue jobs (Laravel)
- `failed_jobs` - Failed queue jobs
- `migrations` - Migration tracking

### Content Tables

- `pages` - Static pages
- `pages_translations` - Page translations
- `posts` - Blog posts
- `posts_translations` - Post translations
- `categories` - Blog categories
- `categories_translations` - Category translations
- `tags` - Blog tags
- `tags_translations` - Tag translations
- `post_categories` - Post-category relationships
- `post_tags` - Post-tag relationships

### System Tables

- `slugs` - Permalinks/slugs
- `slugs_translations` - Slug translations
- `menus` - Menu containers
- `menu_nodes` - Menu items
- `menu_locations` - Menu location assignments
- `widgets` - Widget instances
- `meta_boxes` - SEO and custom metadata
- `revisions` - Content revision history

### Media Tables

- `media_folders` - Media folders
- `media_files` - Media files
- `media_settings` - Media settings

### Plugin Tables

- `languages` - Available locales
- `audit_histories` - Audit logs
- `galleries` - Galleries
- `galleries_translations` - Gallery translations
- `members` - Frontend users
- `member_activity_logs` - Member activity
- `contacts` - Contact submissions
- `custom_fields` - Custom field definitions
- `custom_field_items` - Custom field items
- `custom_fields_translations` - Custom field translations

---

## Admin Routes & UX Flows

### Common Admin Patterns

1. **List View**: Table with pagination, search, filters, bulk actions
2. **Create/Edit**: Same form component, right-side meta boxes
3. **Meta Boxes**: Publish, Permalink, Banner, Gallery, SEO, Language, Translations
4. **Slug Management**: Live availability check, auto-generation, manual override
5. **Translation Linking**: Create translation button, linked translations list

### Key Admin Routes

```
/admin - Dashboard
/admin/users - User management
/admin/roles - Role management
/admin/pages - Page management
/admin/blog/posts - Post management
/admin/blog/categories - Category management
/admin/blog/tags - Tag management
/admin/menus - Menu builder
/admin/widgets - Widget management
/admin/theme/options - Theme options
/admin/settings - Settings
/admin/media - Media library
/admin/languages - Language management
/admin/translations - String translations
/admin/audit-logs - Audit logs
/admin/galleries - Gallery management
/admin/members - Member management
/admin/contacts - Contact submissions
/admin/sitemap/settings - Sitemap settings
```

---

## Key Behaviors

### Slug System

1. **Generation**:
   - Auto-generated from title/name field
   - Non-Latin characters transliterated to Latin (Greek → Latin)
   - Uniqueness: `(key, prefix)` must be unique
   - If taken, appends `-2`, `-3`, etc.

2. **Prefixes**:
   - Model-specific (e.g., `blog` for posts, empty for pages)
   - Configurable via settings
   - Stored in `slugs.prefix`

3. **Translations**:
   - Each locale can have different slug
   - Stored in `slugs_translations` table

4. **Redirects**:
   - When slug changes, old slug should redirect to new (301)

5. **Availability Check**:
   - Live AJAX check during editing
   - Blocks publish/update if slug is taken

### Translation System

1. **Content Translations** (Language Advanced plugin):
   - Translation group ID links translations
   - Each locale has separate record in `*_translations` table
   - Creating translation copies content from source
   - Slug generated separately for each locale

2. **String Translations** (Translation plugin):
   - UI strings stored in `lang/{locale}/{group}.php` files
   - Admin UI for editing translations
   - Supports import/export

### Theme System

1. **Theme Structure**:
   - Themes in `platform/themes/{theme-name}/`
   - Each theme can have views, assets, options

2. **Theme Options**:
   - Options stored in `settings` table with `theme_*` prefix
   - Options organized in sections/tabs
   - Custom CSS editor

3. **Widgets**:
   - Widgets assigned to sidebars (theme-defined)
   - Widget data stored as JSON
   - Position determines order

### Queue System

- Uses Laravel's database queue driver
- Jobs stored in `jobs` table
- Failed jobs in `failed_jobs` table
- See `docs/botble-queues-spec.md` for details

---

## Notes

- All timestamps use `created_at`, `updated_at` (Laravel convention)
- Soft deletes use `deleted_at` (nullable timestamp)
- Status fields typically: `published`, `draft`, `pending`
- Many content types support `is_featured` flag
- Author tracking: `author_id` + `author_type` (polymorphic)
- Translations use composite primary keys: `(lang_code, {model}_id)`

