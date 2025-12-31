import { Router } from 'express';
import { body } from 'express-validator';
import { SettingsService, AuthMiddleware } from '@cms/core';
import { PrismaClient } from '@cms/core';
import { ApiResponse } from '@cms/shared';

const router = Router();
const prisma = new PrismaClient();
const settingsService = new SettingsService(prisma);
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const setSettingValidation = [
  body('key').isLength({ min: 1, max: 255 }),
  body('value').optional().isString(),
];

// Routes
router.get('/',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('settings.index'),
  async (req, res) => {
    try {
      const settings = await settingsService.getAll();

      res.json({
        success: true,
        data: { settings },
      } as ApiResponse);
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get settings',
      } as ApiResponse);
    }
  }
);

router.get('/:key',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('settings.index'),
  async (req, res) => {
    try {
      const { key } = req.params;
      const value = await settingsService.get(key);

      res.json({
        success: true,
        data: { key, value },
      } as ApiResponse);
    } catch (error) {
      console.error('Get setting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get setting',
      } as ApiResponse);
    }
  }
);

router.post('/', setSettingValidation,
  authMiddleware.authenticate,
  authMiddleware.requirePermission('settings.edit'),
  async (req, res) => {
    try {
      const { key, value } = req.body;

      const setting = await settingsService.set(key, value);

      res.json({
        success: true,
        data: { setting },
        message: 'Setting updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Set setting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update setting',
      } as ApiResponse);
    }
  }
);

router.put('/bulk',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('settings.edit'),
  async (req, res) => {
    try {
      const settings = req.body;

      if (typeof settings !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Settings must be an object',
        } as ApiResponse);
      }

      await settingsService.setMultiple(settings);

      res.json({
        success: true,
        message: 'Settings updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Bulk set settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update settings',
      } as ApiResponse);
    }
  }
);

router.delete('/:key',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('settings.edit'),
  async (req, res) => {
    try {
      const { key } = req.params;

      await settingsService.delete(key);

      res.json({
        success: true,
        message: 'Setting deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Delete setting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete setting',
      } as ApiResponse);
    }
  }
);

export default router;
