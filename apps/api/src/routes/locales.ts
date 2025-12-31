import { Router } from 'express';
import { body, param } from 'express-validator';
import { LocaleService, AuthMiddleware } from '@cms/core';
import { PrismaClient } from '@cms/core';
import { ApiResponse } from '@cms/shared';

const router = Router();
const prisma = new PrismaClient();
const localeService = new LocaleService(prisma);
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const createLocaleValidation = [
  body('code').isLength({ min: 2, max: 20 }).isAlphanumeric(),
  body('name').isLength({ min: 1, max: 120 }),
  body('flag').optional().isLength({ min: 2, max: 20 }),
  body('isDefault').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  body('isRtl').optional().isBoolean(),
];

const updateLocaleValidation = [
  param('locale').isInt(),
  body('name').optional().isLength({ min: 1, max: 120 }),
  body('flag').optional().isLength({ min: 2, max: 20 }),
  body('isDefault').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  body('isRtl').optional().isBoolean(),
];

// Routes
router.get('/',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('locales.index'),
  async (req, res) => {
    try {
      const locales = await localeService.getAll();

      res.json({
        success: true,
        data: { locales },
      } as ApiResponse);
    } catch (error) {
      console.error('Get locales error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get locales',
      } as ApiResponse);
    }
  }
);

router.get('/active', async (req, res) => {
  try {
    const locales = await localeService.getActive();

    res.json({
      success: true,
      data: { locales },
    } as ApiResponse);
  } catch (error) {
    console.error('Get active locales error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active locales',
    } as ApiResponse);
  }
});

router.get('/default', async (req, res) => {
  try {
    const locale = await localeService.getDefault();

    res.json({
      success: true,
      data: { locale },
    } as ApiResponse);
  } catch (error) {
    console.error('Get default locale error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get default locale',
    } as ApiResponse);
  }
});

router.get('/:locale',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('locales.edit'),
  param('locale').isInt(),
  async (req, res) => {
    try {
      const localeId = parseInt(req.params.locale);
      const locale = await localeService.getByCode(req.params.locale) ||
                     await prisma.language.findUnique({ where: { id: localeId } });

      if (!locale) {
        return res.status(404).json({
          success: false,
          message: 'Locale not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { locale },
      } as ApiResponse);
    } catch (error) {
      console.error('Get locale error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get locale',
      } as ApiResponse);
    }
  }
);

router.post('/', createLocaleValidation,
  authMiddleware.authenticate,
  authMiddleware.requirePermission('locales.create'),
  async (req, res) => {
    try {
      const locale = await localeService.create(req.body);

      res.status(201).json({
        success: true,
        data: { locale },
        message: 'Locale created successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('Create locale error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'Locale code already exists',
        } as ApiResponse);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create locale',
      } as ApiResponse);
    }
  }
);

router.put('/:locale', updateLocaleValidation,
  authMiddleware.authenticate,
  authMiddleware.requirePermission('locales.edit'),
  async (req, res) => {
    try {
      const localeId = parseInt(req.params.locale);
      const locale = await localeService.update(localeId, req.body);

      res.json({
        success: true,
        data: { locale },
        message: 'Locale updated successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('Update locale error:', error);

      if (error.message === 'Cannot delete default locale') {
        return res.status(400).json({
          success: false,
          message: error.message,
        } as ApiResponse);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update locale',
      } as ApiResponse);
    }
  }
);

router.delete('/:locale',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('locales.delete'),
  param('locale').isInt(),
  async (req, res) => {
    try {
      const localeId = parseInt(req.params.locale);
      await localeService.delete(localeId);

      res.json({
        success: true,
        message: 'Locale deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('Delete locale error:', error);

      if (error.message === 'Cannot delete default locale') {
        return res.status(400).json({
          success: false,
          message: error.message,
        } as ApiResponse);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete locale',
      } as ApiResponse);
    }
  }
);

router.put('/:locale/default',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('locales.edit'),
  param('locale').isInt(),
  async (req, res) => {
    try {
      const localeId = parseInt(req.params.locale);
      await localeService.setDefault(localeId);

      res.json({
        success: true,
        message: 'Default locale updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Set default locale error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to set default locale',
      } as ApiResponse);
    }
  }
);

export default router;
