# Botble CMS Queue & Background Jobs Specification

This document specifies all background tasks, queue jobs, triggers, payloads, retry logic, and idempotency requirements for the Botble CMS reference implementation. This serves as the specification for the MySQL-backed queue system in the Node.js/TypeScript re-implementation.

## Table of Contents

1. [Queue System Overview](#queue-system-overview)
2. [Queue Jobs](#queue-jobs)
3. [Scheduled Tasks](#scheduled-tasks)
4. [Job Specifications](#job-specifications)
5. [Queue Worker Requirements](#queue-worker-requirements)

---

## Queue System Overview

### Database Schema

Botble uses Laravel's database queue driver. The queue system uses two tables:

**`jobs` table** (Laravel standard):
- `id` - bigint, auto-increment primary key
- `queue` - varchar(191), queue name (default: 'default')
- `payload` - longtext, JSON-encoded job data
- `attempts` - tinyint, number of attempts (default: 0)
- `reserved_at` - timestamp, when job was reserved/claimed (nullable)
- `available_at` - timestamp, when job becomes available
- `created_at` - timestamp

**`failed_jobs` table**:
- `id` - bigint, auto-increment primary key
- `uuid` - varchar(191), unique job identifier
- `connection` - varchar(191), queue connection name
- `queue` - varchar(191), queue name
- `payload` - longtext, JSON-encoded job data
- `exception` - longtext, exception message/stack trace
- `failed_at` - timestamp

### Queue Configuration

- **Default queue**: `default`
- **Retry after**: 90 seconds (configurable)
- **Max attempts**: 3 (per job, configurable)
- **Queue driver**: `database` (MySQL)

---

## Queue Jobs

### 1. Sitemap Generation

**Job Name**: `sitemap.generate`

**Purpose**: Generate XML sitemap file for SEO.

**Triggers**:
1. **On content publish/update**: 
   - Event: `UpdatedContentEvent` or `CreatedContentEvent`
   - Models: Pages, Posts, Categories
   - Condition: Status changed to `published`
2. **Scheduled**: Daily at 02:00 (via scheduler)
3. **Manual**: Admin action from `/admin/sitemap/settings`

**Payload**:
```json
{
  "type": "sitemap.generate",
  "force": false
}
```

**Handler Logic**:
1. Query all published content:
   - Pages: `WHERE status = 'published'`
   - Posts: `WHERE status = 'published'`
   - Categories: `WHERE status = 'published'`
2. For each item:
   - Get slug from `slugs` table
   - Build URL: `{prefix}/{slug}`
   - Get `updated_at` timestamp
   - Set priority (pages: 0.8, posts: 0.7, categories: 0.6)
3. Generate XML sitemap:
   - Group by items per page (default: 1000 items per sitemap)
   - Create sitemap index if multiple sitemaps
   - Save to public directory or cache
4. Clear cache if needed
5. Dispatch `SitemapUpdatedEvent` on success

**Retry Logic**:
- **Max attempts**: 3
- **Backoff**: Exponential (60s, 120s, 240s)
- **Idempotent**: Yes (regenerating sitemap is safe)

**Error Handling**:
- Log errors to `failed_jobs` table
- Continue processing other items if one fails
- Notify admin if all attempts fail

**Dependencies**:
- Requires access to `slugs`, `pages`, `posts`, `categories` tables
- Requires file system write access for sitemap XML

---

### 2. IndexNow Submission

**Job Name**: `sitemap.indexnow`

**Purpose**: Submit sitemap URL to IndexNow API for faster search engine indexing.

**Triggers**:
1. **After sitemap generation**: 
   - Event: `SitemapUpdatedEvent`
   - Delay: 30 seconds after sitemap generation
2. **Scheduled**: Daily at 02:00 (via scheduler)

**Payload**:
```json
{
  "type": "sitemap.indexnow",
  "sitemapUrl": "https://example.com/sitemap.xml"
}
```

**Handler Logic**:
1. Check if IndexNow is enabled (setting: `indexnow_enabled`)
2. Check if API key exists (setting: `indexnow_api_key`)
3. If enabled and key exists:
   - POST to IndexNow API endpoint
   - Include API key in request
   - Submit sitemap URL
4. Log success/failure

**Retry Logic**:
- **Max attempts**: 3
- **Backoff**: 60 seconds (fixed)
- **Idempotent**: Yes (submitting same URL multiple times is safe)

**Error Handling**:
- If IndexNow disabled or key missing, skip silently
- Log API errors
- Don't fail sitemap generation if IndexNow fails

**Dependencies**:
- Requires IndexNow API key configured
- Requires HTTP client for API calls

---

### 3. Media Image Processing

**Job Name**: `media.processImage`

**Purpose**: Generate thumbnails and process uploaded images.

**Triggers**:
1. **On media upload**: 
   - Event: Media file uploaded
   - Condition: File is image (mime_type starts with `image/`)

**Payload**:
```json
{
  "type": "media.processImage",
  "mediaFileId": 123,
  "filePath": "/storage/media/2024/01/image.jpg",
  "mimeType": "image/jpeg"
}
```

**Handler Logic**:
1. Load media file record from database
2. Read image file
3. Generate thumbnails:
   - Small: 150x150 (crop)
   - Medium: 300x300 (crop)
   - Large: 800x800 (fit)
4. Generate responsive sizes (if configured)
5. Optimize image (compress if configured)
6. Store thumbnails in same directory with suffix (e.g., `image-thumb.jpg`)
7. Update `media_files.options` JSON with thumbnail paths and dimensions
8. Update `media_files` record with processed metadata

**Retry Logic**:
- **Max attempts**: 3
- **Backoff**: Exponential (30s, 60s, 120s)
- **Idempotent**: Yes (regenerating thumbnails is safe, but check if already processed)

**Error Handling**:
- If file doesn't exist, mark as failed
- If image processing library fails, log and retry
- If all attempts fail, mark media file with error flag

**Dependencies**:
- Requires image processing library (e.g., Sharp, ImageMagick)
- Requires file system read/write access
- Requires `media_files` table access

**Notes**:
- Should check if thumbnails already exist before processing
- Should handle various image formats (JPEG, PNG, GIF, WebP)
- Should preserve EXIF data if configured

---

### 4. Cache Clearing

**Job Name**: `cache.clear`

**Purpose**: Clear application cache.

**Triggers**:
1. **Manual**: Admin action from `/admin/system/cache`
2. **After settings update**: When critical settings change
3. **After theme activation**: When theme is changed

**Payload**:
```json
{
  "type": "cache.clear",
  "tags": ["pages", "posts", "sitemap"],
  "clearAll": false
}
```

**Handler Logic**:
1. If `clearAll = true`:
   - Clear all cache entries
2. Else if `tags` provided:
   - Clear cache entries matching tags
3. Else:
   - Clear default cache entries
4. Clear framework cache (Laravel cache)
5. Clear view cache (compiled views)
6. Clear config cache (if applicable)

**Retry Logic**:
- **Max attempts**: 1 (no retry needed, cache clearing is fast)
- **Idempotent**: Yes (clearing cache multiple times is safe)

**Error Handling**:
- Log errors but don't fail (cache clearing is best-effort)
- Continue even if some cache entries fail to clear

**Dependencies**:
- Requires cache driver access (file, Redis, database, etc.)
- Requires file system access for file-based cache

---

### 5. Email Sending

**Job Name**: `mail.send`

**Purpose**: Send email notifications.

**Triggers**:
1. **Contact form submission**: When contact form is submitted
2. **User registration**: When new user/member registers
3. **Password reset**: When password reset is requested
4. **Content published**: When content is published (if notifications enabled)

**Payload**:
```json
{
  "type": "mail.send",
  "to": "user@example.com",
  "subject": "Email Subject",
  "body": "Email body (HTML or text)",
  "from": "noreply@example.com",
  "attachments": []
}
```

**Handler Logic**:
1. Validate email addresses
2. Render email template (if template provided)
3. Send email via SMTP/Mail driver
4. Log email sent (if email logging enabled)

**Retry Logic**:
- **Max attempts**: 3
- **Backoff**: Exponential (60s, 300s, 900s)
- **Idempotent**: No (sending email multiple times is not desired, but may happen on retry)

**Error Handling**:
- If SMTP fails, retry with backoff
- If email address invalid, mark as failed immediately
- Log all email send attempts

**Dependencies**:
- Requires mail driver configuration (SMTP, SendMail, etc.)
- Requires email templates

**Notes**:
- Should rate-limit email sending to prevent spam
- Should handle bounces and invalid addresses

---

### 6. Backup Generation

**Job Name**: `backup.generate`

**Purpose**: Generate database and file backups.

**Triggers**:
1. **Scheduled**: Daily at 03:00 (via scheduler)
2. **Manual**: Admin action from backup plugin

**Payload**:
```json
{
  "type": "backup.generate",
  "includeFiles": true,
  "includeDatabase": true,
  "storage": "local"
}
```

**Handler Logic**:
1. If `includeDatabase = true`:
   - Export database to SQL file
   - Compress SQL file
2. If `includeFiles = true`:
   - Archive media files
   - Archive uploads directory
3. Combine into single backup archive
4. Store backup in configured storage (local, S3, etc.)
5. Clean up old backups (keep last N backups)
6. Send notification email if configured

**Retry Logic**:
- **Max attempts**: 2 (backups are large, don't retry too many times)
- **Backoff**: 3600 seconds (1 hour)
- **Idempotent**: Yes (generating backup is safe)

**Error Handling**:
- If database export fails, log and continue with files
- If storage fails, retry once
- Clean up partial backups on failure

**Dependencies**:
- Requires database access for export
- Requires file system access
- Requires storage driver (local, S3, etc.)

---

### 7. Analytics Data Processing

**Job Name**: `analytics.process`

**Purpose**: Process and aggregate analytics data.

**Triggers**:
1. **Scheduled**: Hourly (via scheduler)
2. **Manual**: Admin action

**Payload**:
```json
{
  "type": "analytics.process",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

**Handler Logic**:
1. Query raw analytics data (if stored)
2. Aggregate by:
   - Page views
   - Unique visitors
   - Referrers
   - Devices
   - Countries
3. Store aggregated data in analytics tables
4. Generate reports

**Retry Logic**:
- **Max attempts**: 3
- **Backoff**: Exponential (300s, 600s, 1200s)
- **Idempotent**: Yes (reprocessing is safe)

**Error Handling**:
- Continue processing even if some data fails
- Log aggregation errors

**Dependencies**:
- Requires analytics data source
- Requires analytics tables

---

## Scheduled Tasks

### Scheduler Configuration

Botble uses Laravel's task scheduler (cron-based). The scheduler runs every minute and executes scheduled tasks.

### Scheduled Jobs

1. **Sitemap Generation**
   - **Schedule**: Daily at 02:00
   - **Job**: `sitemap.generate`
   - **Payload**: `{ "type": "sitemap.generate", "force": false }`

2. **IndexNow Submission**
   - **Schedule**: Daily at 02:00 (after sitemap)
   - **Job**: `sitemap.indexnow`
   - **Payload**: `{ "type": "sitemap.indexnow", "sitemapUrl": null }`

3. **Cache Cleanup**
   - **Schedule**: Every 5 minutes
   - **Job**: `cache.clearExpired`
   - **Purpose**: Clear expired cache entries

4. **Backup Generation**
   - **Schedule**: Daily at 03:00
   - **Job**: `backup.generate`
   - **Payload**: `{ "type": "backup.generate", "includeFiles": true, "includeDatabase": true }`

5. **Analytics Processing**
   - **Schedule**: Hourly
   - **Job**: `analytics.process`
   - **Payload**: `{ "type": "analytics.process" }`

6. **Log Cleanup**
   - **Schedule**: Daily at 04:00
   - **Job**: `logs.cleanup`
   - **Purpose**: Clean old log files and audit logs

---

## Job Specifications

### Job Payload Structure

All jobs follow this structure:
```json
{
  "type": "job.name",
  "data": {
    // Job-specific data
  },
  "metadata": {
    "userId": 123,
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Job Status Flow

1. **Queued**: Job created, waiting to be processed
2. **Processing**: Job claimed by worker, being executed
3. **Completed**: Job finished successfully
4. **Failed**: Job failed after max attempts

### Retry Strategy

**Exponential Backoff Formula**:
```
delay = min(baseSeconds * (2 ^ attempts), maxSeconds)
```

**Default Values**:
- Base: 60 seconds
- Max: 3600 seconds (1 hour)
- Max attempts: 3

**Examples**:
- Attempt 1: 60 seconds
- Attempt 2: 120 seconds
- Attempt 3: 240 seconds

### Idempotency Requirements

**Idempotent Jobs** (safe to retry):
- `sitemap.generate` - Regenerating sitemap is safe
- `sitemap.indexnow` - Submitting same URL is safe
- `media.processImage` - Regenerating thumbnails is safe (check if exists)
- `cache.clear` - Clearing cache multiple times is safe
- `backup.generate` - Generating backup is safe
- `analytics.process` - Reprocessing data is safe

**Non-Idempotent Jobs** (may have side effects):
- `mail.send` - Sending email multiple times is not desired (but acceptable on retry)

**Idempotency Implementation**:
- Check if work already done before processing
- Use unique identifiers to prevent duplicates
- Log all attempts for audit

---

## Queue Worker Requirements

### Worker Process

The queue worker should:

1. **Poll for Jobs**:
   - Query `jobs` table for available jobs
   - Filter: `queue = 'default' AND available_at <= NOW() AND (reserved_at IS NULL OR reserved_at < NOW() - retry_after)`
   - Order by: `available_at ASC, id ASC`
   - Limit: 1 job per worker

2. **Claim Job** (Atomic Lock):
   - Start transaction
   - SELECT job with FOR UPDATE
   - UPDATE `reserved_at = NOW()`, `attempts = attempts + 1`
   - Commit transaction
   - If no job found, rollback and wait

3. **Execute Job**:
   - Load job handler by type
   - Execute handler with payload
   - Catch exceptions

4. **Handle Success**:
   - DELETE job from `jobs` table
   - Log success (optional)

5. **Handle Failure**:
   - If `attempts < max_attempts`:
     - Calculate backoff: `available_at = NOW() + backoff_seconds`
     - UPDATE job: `reserved_at = NULL`, `available_at = new_time`
   - Else:
     - INSERT into `failed_jobs` table
     - DELETE from `jobs` table
     - Log failure

6. **Worker Loop**:
   - Poll every N seconds (default: 3 seconds)
   - Process one job at a time
   - Handle graceful shutdown (SIGTERM, SIGINT)

### Worker Configuration

- **Poll interval**: 3 seconds
- **Max jobs per worker**: 1 (sequential processing)
- **Timeout**: 300 seconds (5 minutes) per job
- **Memory limit**: 512 MB per worker
- **Graceful shutdown**: Wait for current job to finish

### Multiple Workers

- Can run multiple worker processes
- Each worker processes jobs independently
- Atomic locking prevents duplicate processing
- Workers should have unique identifiers for `locked_by` field

---

## MySQL-Backed Queue Implementation Notes

### Required Schema Changes

For the Node.js implementation, the `jobs` table should be:

```sql
CREATE TABLE `jobs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `queue` VARCHAR(191) NOT NULL DEFAULT 'default',
  `name` VARCHAR(191) NOT NULL,  -- Job type/name
  `payload_json` LONGTEXT NOT NULL,  -- JSON payload
  `status` ENUM('queued', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'queued',
  `priority` INT NOT NULL DEFAULT 0,
  `run_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- When to run (available_at)
  `attempts` INT NOT NULL DEFAULT 0,
  `max_attempts` INT NOT NULL DEFAULT 3,
  `last_error` LONGTEXT NULL,
  `locked_at` DATETIME NULL,  -- When job was claimed
  `locked_by` VARCHAR(191) NULL,  -- Worker identifier
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status_run_priority` (`status`, `run_at`, `priority`),
  INDEX `idx_queue_status_run` (`queue`, `status`, `run_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Atomic Job Claiming

```sql
-- Claim next available job (atomic)
START TRANSACTION;

SELECT * FROM jobs
WHERE queue = 'default'
  AND status = 'queued'
  AND run_at <= NOW()
  AND (locked_at IS NULL OR locked_at < DATE_SUB(NOW(), INTERVAL 90 SECOND))
ORDER BY run_at ASC, priority DESC, id ASC
LIMIT 1
FOR UPDATE;

UPDATE jobs
SET status = 'processing',
    locked_at = NOW(),
    locked_by = ?,
    attempts = attempts + 1
WHERE id = ?;

COMMIT;
```

### Job Completion

```sql
-- On success
DELETE FROM jobs WHERE id = ?;

-- On failure (with retry)
UPDATE jobs
SET status = 'queued',
    locked_at = NULL,
    locked_by = NULL,
    run_at = DATE_ADD(NOW(), INTERVAL ? SECOND),  -- Backoff
    last_error = ?
WHERE id = ?;

-- On failure (max attempts reached)
INSERT INTO failed_jobs (uuid, connection, queue, payload, exception, failed_at)
VALUES (?, 'database', 'default', ?, ?, NOW());

DELETE FROM jobs WHERE id = ?;
```

---

## Summary

### Job Types

1. **sitemap.generate** - Generate XML sitemap
2. **sitemap.indexnow** - Submit to IndexNow API
3. **media.processImage** - Process images and generate thumbnails
4. **cache.clear** - Clear application cache
5. **mail.send** - Send email notifications
6. **backup.generate** - Generate backups
7. **analytics.process** - Process analytics data
8. **cache.clearExpired** - Clear expired cache entries
9. **logs.cleanup** - Clean old log files

### Scheduled Tasks

- Sitemap generation: Daily at 02:00
- IndexNow submission: Daily at 02:00
- Cache cleanup: Every 5 minutes
- Backup generation: Daily at 03:00
- Analytics processing: Hourly
- Log cleanup: Daily at 04:00

### Key Requirements

- MySQL-backed queue (no Redis required)
- Atomic job claiming with locking
- Exponential backoff for retries
- Idempotent job handlers where possible
- Graceful worker shutdown
- Multiple worker support
- Job status tracking
- Failed job logging

