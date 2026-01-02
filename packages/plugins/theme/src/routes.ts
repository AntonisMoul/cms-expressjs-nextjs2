import { Router, Response } from 'express';
import { PluginContext } from '@cms/shared';
import { SettingsService } from '@cms/core';
import { z } from 'zod';

export function registerThemeRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
) {
  const settingsService = ctx.settings as SettingsService;

  // Get theme options
  router.get(
    '/theme/options',
    requireAuth,
    requirePermission('theme.options'),
    async (req: any, res: Response) => {
      try {
        // Get all theme settings (prefixed with theme_)
        const allSettings = await settingsService.getAll();
        const themeSettings: Record<string, string> = {};

        for (const [key, value] of Object.entries(allSettings)) {
          if (key.startsWith('theme_')) {
            themeSettings[key] = value;
          }
        }

        res.json({
          success: true,
          data: { settings: themeSettings },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Update theme options
  router.post(
    '/theme/options',
    requireAuth,
    requirePermission('theme.options'),
    async (req: any, res: Response) => {
      try {
        const settings = req.body;

        // Update theme settings (all keys should be prefixed with theme_)
        const themeSettings: Record<string, string> = {};
        for (const [key, value] of Object.entries(settings)) {
          const settingKey = key.startsWith('theme_') ? key : `theme_${key}`;
          themeSettings[settingKey] = typeof value === 'string' ? value : JSON.stringify(value);
        }

        await settingsService.setMany(themeSettings);

        res.json({
          success: true,
          message: 'Theme options updated successfully',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );
}

