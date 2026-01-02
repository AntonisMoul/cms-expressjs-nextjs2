import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { SlugService } from '@cms/core';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const checkAvailabilitySchema = z.object({
  slug: z.string(),
  prefix: z.string().optional(),
  locale: z.string().optional(),
  excludeId: z.number().optional(),
});

export function slugsRoutes(db: PrismaClient): Router {
  const router = Router();
  const slugService = new SlugService(db);

  // Check slug availability
  router.post(
    '/check',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const data = checkAvailabilitySchema.parse(req.body);

        const availability = await slugService.checkAvailability(
          data.slug,
          data.prefix || '',
          data.locale,
          data.excludeId
        );

        res.json({
          success: true,
          data: availability,
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: error.errors,
          });
        }

        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Generate slug
  router.post(
    '/generate',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const { text, model, prefix, locale, excludeId } = req.body;

        if (!text || !model) {
          return res.status(400).json({
            success: false,
            error: 'Text and model are required',
          });
        }

        const slug = await slugService.generate(text, model, {
          prefix,
          locale,
          excludeId,
        });

        res.json({
          success: true,
          data: { slug },
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

