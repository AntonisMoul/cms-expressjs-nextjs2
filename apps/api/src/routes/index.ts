import { Router } from 'express';
import { PrismaClient } from '@cms/shared';
import { authRoutes } from './auth';
import { languagesRoutes } from './languages';
import { slugsRoutes } from './slugs';
import { settingsRoutes } from './settings';
import { auditRoutes } from './audit';
import { queueRoutes } from './queue';
import { systemRoutes } from './system';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { QueueService } from '@cms/core';
import { SettingsService } from '@cms/core';
import { AuditService } from '@cms/core';
import { SlugService } from '@cms/core';
import { I18nService } from '@cms/core';
import { PagePlugin } from '@cms/plugin-page';
import { BlogPlugin } from '@cms/plugin-blog';
import { MediaPlugin } from '@cms/plugin-media';
import { MenuPlugin } from '@cms/plugin-menu';
import { WidgetPlugin } from '@cms/plugin-widget';
import { ThemePlugin } from '@cms/plugin-theme';
import { SitemapPlugin } from '@cms/plugin-sitemap';

export function setupRoutes(db: PrismaClient): Router {
  const router = Router();

  // Auth routes (no auth required)
  router.use('/auth', authRoutes(db));

  // Protected routes
  router.use('/languages', languagesRoutes(db));
  router.use('/slugs', slugsRoutes(db));
  router.use('/settings', settingsRoutes(db));
  router.use('/audit', auditRoutes(db));
  router.use('/queue', queueRoutes(db));
  
  // Initialize core services for system routes
  const queueService = new QueueService(db);
  const settingsService = new SettingsService(db);
  router.use('/system', systemRoutes(db, queueService, settingsService));

  // Initialize core services (reuse from above)
  const queueService = new QueueService(db);
  const settingsService = new SettingsService(db);
  const auditService = new AuditService(db);
  const slugService = new SlugService(db);
  const i18nService = new I18nService(db);

  // Register plugins
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
  
  // Page plugin
  const pagePlugin = new PagePlugin();
  if (pagePlugin.registerRoutes) {
    pagePlugin.registerRoutes(router, pluginContext, requireAuth, requirePermission);
  }

  // Blog plugin
  const blogPlugin = new BlogPlugin();
  if (blogPlugin.registerRoutes) {
    blogPlugin.registerRoutes(router, pluginContext, requireAuth, requirePermission);
  }

  // Media plugin
  const mediaPlugin = new MediaPlugin();
  if (mediaPlugin.registerRoutes) {
    mediaPlugin.registerRoutes(router, pluginContext, requireAuth, requirePermission);
  }

  // Menu plugin
  const menuPlugin = new MenuPlugin();
  if (menuPlugin.registerRoutes) {
    menuPlugin.registerRoutes(router, pluginContext, requireAuth, requirePermission);
  }

  // Widget plugin
  const widgetPlugin = new WidgetPlugin();
  if (widgetPlugin.registerRoutes) {
    widgetPlugin.registerRoutes(router, pluginContext, requireAuth, requirePermission);
  }

  // Theme plugin
  const themePlugin = new ThemePlugin();
  if (themePlugin.registerRoutes) {
    themePlugin.registerRoutes(router, pluginContext, requireAuth, requirePermission);
  }

  // Sitemap plugin (no routes, just job handlers)
  const sitemapPlugin = new SitemapPlugin();

  return router;
}

