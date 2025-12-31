import { Router } from 'express';
import { query } from 'express-validator';
import { SlugService, AuthMiddleware } from '@cms/core';
import { PrismaClient } from '@cms/core';
import { ApiResponse, SlugCheckResponse } from '@cms/shared';

const router = Router();
const prisma = new PrismaClient();
const slugService = new SlugService(prisma);
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const checkSlugValidation = [
  query('entityType').isLength({ min: 1, max: 255 }),
  query('locale').isLength({ min: 2, max: 20 }),
  query('slug').isLength({ min: 1 }),
  query('excludeId').optional().isInt(),
];

// Routes
router.get('/check', checkSlugValidation,
  authMiddleware.authenticate,
  async (req, res) => {
    try {
      const { entityType, locale, slug, excludeId } = req.query as any;

      const result: SlugCheckResponse = await slugService.checkAvailability(
        entityType,
        locale,
        slug,
        undefined, // prefix
        excludeId ? parseInt(excludeId) : undefined
      );

      res.json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error) {
      console.error('Check slug error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check slug availability',
      } as ApiResponse);
    }
  }
);

// Generate slug from text (helper endpoint)
router.post('/generate',
  authMiddleware.authenticate,
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || typeof text !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Text is required',
        } as ApiResponse);
      }

      const slug = SlugService.transliterate(text);

      res.json({
        success: true,
        data: { slug },
      } as ApiResponse);
    } catch (error) {
      console.error('Generate slug error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate slug',
      } as ApiResponse);
    }
  }
);

export default router;
