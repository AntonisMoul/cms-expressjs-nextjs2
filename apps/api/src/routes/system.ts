import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { QueueService } from '@cms/core';
import { SettingsService } from '@cms/core';

export function systemRoutes(db: PrismaClient, queueService: QueueService, settingsService: SettingsService): Router {
  const router = Router();

  router.use(requireAuth);
  router.use(requirePermission('settings.index'));

  // Cache management
  router.post(
    '/system/cache/clear',
    requirePermission('settings.options'),
    async (req: AuthRequest, res: Response) => {
      try {
        // Enqueue cache clear job
        await queueService.enqueue('cache.clear', {
          clearAll: true,
        });

        res.json({
          success: true,
          message: 'Cache clear job enqueued',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Sitemap management
  router.get(
    '/system/sitemap',
    async (req: AuthRequest, res: Response) => {
      try {
        const enabled = await settingsService.get('sitemap_enabled');
        const itemsPerPage = await settingsService.get('sitemap_items_per_page');
        const lastGenerated = await settingsService.get('sitemap_last_generated');

        res.json({
          success: true,
          data: {
            enabled: enabled === '1',
            itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 1000,
            lastGenerated,
          },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  router.post(
    '/system/sitemap/generate',
    requirePermission('sitemap.generate'),
    async (req: AuthRequest, res: Response) => {
      try {
        // Enqueue sitemap generation
        await queueService.enqueue('sitemap.generate', {});

        // Update last generated timestamp
        await settingsService.set('sitemap_last_generated', new Date().toISOString());

        res.json({
          success: true,
          message: 'Sitemap generation job enqueued',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Queue jobs dashboard
  router.get(
    '/system/jobs',
    async (req: AuthRequest, res: Response) => {
      try {
        const { status, limit = '50' } = req.query;

        const jobs = await queueService.getJobs({
          status: status as any,
          limit: parseInt(limit as string),
        });

        const failedJobs = await queueService.getFailedJobs({
          limit: 20,
        });

        res.json({
          success: true,
          data: {
            jobs,
            failedJobs,
          },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  return router;
}

