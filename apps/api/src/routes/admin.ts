import { Router } from 'express';
import { PrismaClient } from '@cms/shared';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { QueueService } from '@cms/core';
import { SettingsService } from '@cms/core';
import { AuditService } from '@cms/core';
import { SlugService } from '@cms/core';
import { I18nService } from '@cms/core';
import { languagesRoutes } from './languages';
import { slugsRoutes } from './slugs';
import { settingsRoutes } from './settings';
import { auditRoutes } from './audit';
import { queueRoutes } from './queue';
import { systemRoutes } from './system';
import { PagePlugin } from '@cms/plugin-page';
import { BlogPlugin } from '@cms/plugin-blog';
import { MediaPlugin } from '@cms/plugin-media';
import { MenuPlugin } from '@cms/plugin-menu';
import { WidgetPlugin } from '@cms/plugin-widget';
import { ThemePlugin } from '@cms/plugin-theme';
import { SitemapPlugin } from '@cms/plugin-sitemap';

/**
 * Admin routes - all routes under /api/v1/admin require authentication
 * This router is mounted with requireAuth middleware at the mount point
 */
export function setupAdminRoutes(db: PrismaClient): Router {
  const adminRouter = Router();

  // Initialize core services
  const queueService = new QueueService(db);
  const settingsService = new SettingsService(db);
  const auditService = new AuditService(db);
  const slugService = new SlugService(db);
  const i18nService = new I18nService(db);

  // Core admin routes
  adminRouter.use('/languages', languagesRoutes(db));
  adminRouter.use('/slugs', slugsRoutes(db));
  adminRouter.use('/settings', settingsRoutes(db));
  adminRouter.use('/audit', auditRoutes(db));
  adminRouter.use('/queue', queueRoutes(db));
  adminRouter.use('/system', systemRoutes(db, queueService, settingsService));

  // Plugin context for plugins
  const pluginContext = {
    db,
    queue: queueService,
    events: null as any,
    settings: settingsService,
    auth: null as any,
    rbac: null as any,
    slug: slugService,
    i18n: i18nService,
    plugins: null as any,
    apiApp: null as any,
    webApp: null as any,
    audit: auditService,
  };

  // Register plugins - they will inherit the requireAuth from the mount point
  // Plugins can still add requirePermission for specific routes
  const pagePlugin = new PagePlugin();
  if (pagePlugin.registerRoutes) {
    // Plugins register routes directly on adminRouter
    // requireAuth is already applied at mount point, but we pass it for per-route use if needed
    pagePlugin.registerRoutes(adminRouter, pluginContext, requireAuth, requirePermission);
  }

  const blogPlugin = new BlogPlugin();
  if (blogPlugin.registerRoutes) {
    blogPlugin.registerRoutes(adminRouter, pluginContext, requireAuth, requirePermission);
  }

  const mediaPlugin = new MediaPlugin();
  if (mediaPlugin.registerRoutes) {
    mediaPlugin.registerRoutes(adminRouter, pluginContext, requireAuth, requirePermission);
  }

  const menuPlugin = new MenuPlugin();
  if (menuPlugin.registerRoutes) {
    menuPlugin.registerRoutes(adminRouter, pluginContext, requireAuth, requirePermission);
  }

  const widgetPlugin = new WidgetPlugin();
  if (widgetPlugin.registerRoutes) {
    widgetPlugin.registerRoutes(adminRouter, pluginContext, requireAuth, requirePermission);
  }

  const themePlugin = new ThemePlugin();
  if (themePlugin.registerRoutes) {
    themePlugin.registerRoutes(adminRouter, pluginContext, requireAuth, requirePermission);
  }

  // Sitemap plugin (no routes, just job handlers)
  const sitemapPlugin = new SitemapPlugin();

  return adminRouter;
}

