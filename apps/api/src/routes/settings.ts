import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { SettingsService } from '@cms/core';
import { requireAuth, requirePermission, AuthRequest } from '../middleware/auth';

export function settingsRoutes(db: PrismaClient): Router {
  const router = Router();
  const settingsService = new SettingsService(db);

  router.use(requireAuth);

  // Get setting
  router.get('/:key', async (req: AuthRequest, res: Response) => {
    try {
      const value = await settingsService.get(req.params.key);
      res.json({
        success: true,
        data: { key: req.params.key, value },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Set setting
  router.put(
    '/:key',
    requirePermission('settings.options'),
    async (req: AuthRequest, res: Response) => {
      try {
        const { value } = req.body;
        await settingsService.set(req.params.key, value);
        res.json({
          success: true,
          message: 'Setting updated successfully',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Get all settings
  router.get(
    '/',
    requirePermission('settings.index'),
    async (req: AuthRequest, res: Response) => {
      try {
        const settings = await settingsService.getAll();
        res.json({
          success: true,
          data: { settings },
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

