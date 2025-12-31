import { Router } from 'express';
import { SystemService } from '../services/systemService';
import { RedirectService } from '../services/redirectService';
import { CacheService } from '../services/cacheService';
import { SitemapService } from '../services/sitemapService';
import { AuthMiddleware, PrismaClient } from '@cms/core';
import {
  CreateRedirectRequest,
  UpdateRedirectRequest,
  BulkRedirectUpdate,
  CreateSitemapEntryRequest,
  UpdateSitemapEntryRequest,
  LogSystemEventRequest
} from '../models/types';

const prisma = new PrismaClient();
const authMiddleware = new AuthMiddleware(prisma);
const systemService = new SystemService();
const redirectService = new RedirectService();
const cacheService = new CacheService();
const sitemapService = new SitemapService();

const router = Router();

// System information and stats
router.get('/info', authMiddleware.authenticate, authMiddleware.requirePermission('system.view'), async (req, res) => {
  try {
    const info = await systemService.getSystemInfo();
    res.json(info);
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({ error: 'Failed to fetch system information' });
  }
});

router.get('/stats', authMiddleware.authenticate, authMiddleware.requirePermission('system.view'), async (req, res) => {
  try {
    const stats = await systemService.getSystemStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system statistics' });
  }
});

router.get('/health', async (req, res) => {
  try {
    const health = await systemService.performHealthCheck();
    const statusCode = health.status === 'critical' ? 500 : health.status === 'warning' ? 200 : 200;
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('Error performing health check:', error);
    res.status(500).json({ status: 'critical', error: 'Health check failed' });
  }
});

// System logs
router.get('/logs', authMiddleware.authenticate, authMiddleware.requirePermission('system.view'), async (req, res) => {
  try {
    const options = {
      level: req.query.level as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
    };

    const logs = await systemService.getLogs(options);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch system logs' });
  }
});

router.post('/logs', authMiddleware.authenticate, async (req, res) => {
  try {
    const data: LogSystemEventRequest = req.body;
    await systemService.logEvent({
      ...data,
      user_id: req.user?.userId,
      ip_address: req.ip
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({ error: 'Failed to log event' });
  }
});

router.delete('/logs', authMiddleware.authenticate, authMiddleware.requirePermission('system.edit'), async (req, res) => {
  try {
    const daysToKeep = req.query.days ? parseInt(req.query.days as string) : 30;
    const removed = await systemService.clearOldLogs(daysToKeep);
    res.json({ success: true, removed });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ error: 'Failed to clear old logs' });
  }
});

// Maintenance tasks
router.get('/maintenance/tasks', authMiddleware.authenticate, authMiddleware.requirePermission('system.edit'), async (req, res) => {
  try {
    const tasks = systemService.getMaintenanceTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching maintenance tasks:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance tasks' });
  }
});

router.post('/maintenance/tasks/:taskId/run', authMiddleware.authenticate, authMiddleware.requirePermission('system.edit'), async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await systemService.runMaintenanceTask(taskId);
    res.json(result);
  } catch (error) {
    console.error('Error running maintenance task:', error);
    res.status(500).json({ error: 'Failed to run maintenance task' });
  }
});

// Redirect management
router.get('/redirects', authMiddleware.authenticate, authMiddleware.requirePermission('redirects.view'), async (req, res) => {
  try {
    const redirects = await redirectService.getRedirects();
    res.json(redirects);
  } catch (error) {
    console.error('Error fetching redirects:', error);
    res.status(500).json({ error: 'Failed to fetch redirects' });
  }
});

router.get('/redirects/stats', authMiddleware.authenticate, authMiddleware.requirePermission('redirects.view'), async (req, res) => {
  try {
    const stats = await redirectService.getRedirectStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching redirect stats:', error);
    res.status(500).json({ error: 'Failed to fetch redirect statistics' });
  }
});

router.post('/redirects', authMiddleware.authenticate, authMiddleware.requirePermission('redirects.create'), async (req, res) => {
  try {
    const data: CreateRedirectRequest = req.body;
    const redirect = await redirectService.createRedirect(data);
    res.status(201).json(redirect);
  } catch (error) {
    console.error('Error creating redirect:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create redirect' });
  }
});

router.put('/redirects/:id', authMiddleware.authenticate, authMiddleware.requirePermission('redirects.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateRedirectRequest = req.body;
    const redirect = await redirectService.updateRedirect(id, data);
    res.json(redirect);
  } catch (error) {
    console.error('Error updating redirect:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update redirect' });
  }
});

router.delete('/redirects/:id', authMiddleware.authenticate, authMiddleware.requirePermission('redirects.delete'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await redirectService.deleteRedirect(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting redirect:', error);
    res.status(500).json({ error: 'Failed to delete redirect' });
  }
});

router.post('/redirects/bulk', authMiddleware.authenticate, authMiddleware.requirePermission('redirects.edit'), async (req, res) => {
  try {
    const data: BulkRedirectUpdate = req.body;
    await redirectService.bulkUpdateRedirects(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error bulk updating redirects:', error);
    res.status(500).json({ error: 'Failed to bulk update redirects' });
  }
});

router.delete('/redirects/bulk', authMiddleware.authenticate, authMiddleware.requirePermission('redirects.delete'), async (req, res) => {
  try {
    const ids = req.body.ids.map((id: any) => parseInt(id));
    await redirectService.bulkDeleteRedirects(ids);
    res.json({ success: true, deleted: ids.length });
  } catch (error) {
    console.error('Error bulk deleting redirects:', error);
    res.status(500).json({ error: 'Failed to bulk delete redirects' });
  }
});

// Cache management
router.get('/cache/stats', authMiddleware.authenticate, authMiddleware.requirePermission('cache.view'), async (req, res) => {
  try {
    const stats = await cacheService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({ error: 'Failed to fetch cache statistics' });
  }
});

router.delete('/cache', authMiddleware.authenticate, authMiddleware.requirePermission('cache.edit'), async (req, res) => {
  try {
    const options = {
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      pattern: req.query.pattern as string
    };

    const removed = await cacheService.clear(options);
    res.json({ success: true, removed });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

router.delete('/cache/expired', authMiddleware.authenticate, authMiddleware.requirePermission('cache.edit'), async (req, res) => {
  try {
    const removed = await cacheService.clearExpired();
    res.json({ success: true, removed });
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    res.status(500).json({ error: 'Failed to clear expired cache' });
  }
});

// Sitemap management
router.get('/sitemap/entries', authMiddleware.authenticate, authMiddleware.requirePermission('sitemap.view'), async (req, res) => {
  try {
    const entries = await sitemapService.getSitemapEntries();
    res.json(entries);
  } catch (error) {
    console.error('Error fetching sitemap entries:', error);
    res.status(500).json({ error: 'Failed to fetch sitemap entries' });
  }
});

router.get('/sitemap/stats', authMiddleware.authenticate, authMiddleware.requirePermission('sitemap.view'), async (req, res) => {
  try {
    const stats = await sitemapService.getSitemapStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching sitemap stats:', error);
    res.status(500).json({ error: 'Failed to fetch sitemap statistics' });
  }
});

router.post('/sitemap/entries', authMiddleware.authenticate, authMiddleware.requirePermission('sitemap.edit'), async (req, res) => {
  try {
    const data: CreateSitemapEntryRequest = req.body;
    const entry = await sitemapService.createSitemapEntry(data);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating sitemap entry:', error);
    res.status(500).json({ error: 'Failed to create sitemap entry' });
  }
});

router.put('/sitemap/entries/:id', authMiddleware.authenticate, authMiddleware.requirePermission('sitemap.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateSitemapEntryRequest = req.body;
    const entry = await sitemapService.updateSitemapEntry(id, data);
    res.json(entry);
  } catch (error) {
    console.error('Error updating sitemap entry:', error);
    res.status(500).json({ error: 'Failed to update sitemap entry' });
  }
});

router.delete('/sitemap/entries/:id', authMiddleware.authenticate, authMiddleware.requirePermission('sitemap.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await sitemapService.deleteSitemapEntry(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting sitemap entry:', error);
    res.status(500).json({ error: 'Failed to delete sitemap entry' });
  }
});

router.get('/sitemap/generate', authMiddleware.authenticate, authMiddleware.requirePermission('sitemap.edit'), async (req, res) => {
  try {
    const baseUrl = req.query.baseUrl as string || process.env.SITE_URL || 'http://localhost:3000';
    const sitemap = await sitemapService.generateSitemap(baseUrl);

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

router.post('/sitemap/populate', authMiddleware.authenticate, authMiddleware.requirePermission('sitemap.edit'), async (req, res) => {
  try {
    const baseUrl = req.body.baseUrl || process.env.SITE_URL || 'http://localhost:3000';
    await sitemapService.populateFromContent(baseUrl);
    res.json({ success: true, message: 'Sitemap populated from content' });
  } catch (error) {
    console.error('Error populating sitemap:', error);
    res.status(500).json({ error: 'Failed to populate sitemap' });
  }
});

// Public redirect handler (middleware for the main app)
router.get('/redirect/*', async (req, res, next) => {
  try {
    const fromUrl = '/' + req.params[0];
    const redirect = await redirectService.processRedirect(fromUrl);

    if (redirect) {
      const statusCode = redirect.status_code || 301;
      res.redirect(statusCode, redirect.to_url);
      return;
    }

    next();
  } catch (error) {
    console.error('Error processing redirect:', error);
    next();
  }
});

// Public sitemap endpoint
router.get('/sitemap.xml', async (req, res) => {
  try {
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const sitemap = await sitemapService.generateSitemap(baseUrl);

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
