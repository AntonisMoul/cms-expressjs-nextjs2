import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { z } from 'zod';

const createLanguageSchema = z.object({
  langName: z.string(),
  langCode: z.string().length(2),
  langFlag: z.string().optional(),
  langIsDefault: z.boolean().optional(),
  langIsRtl: z.boolean().optional(),
  langOrder: z.number().optional(),
});

export function languagesRoutes(db: PrismaClient): Router {
  const router = Router();

  // All routes require authentication
  router.use(requireAuth);

  // List languages
  router.get('/', async (req: AuthRequest, res: Response) => {
    try {
      const languages = await db.language.findMany({
        orderBy: { langOrder: 'asc' },
      });

      res.json({
        success: true,
        data: { languages },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Get language by code
  router.get('/:code', async (req: AuthRequest, res: Response) => {
    try {
      const language = await db.language.findUnique({
        where: { langCode: req.params.code },
      });

      if (!language) {
        return res.status(404).json({
          success: false,
          error: 'Language not found',
        });
      }

      res.json({
        success: true,
        data: { language },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Create language
  router.post(
    '/',
    requirePermission('languages.create'),
    async (req: AuthRequest, res: Response) => {
      try {
        const data = createLanguageSchema.parse(req.body);

        // If setting as default, unset other defaults
        if (data.langIsDefault) {
          await db.language.updateMany({
            where: { langIsDefault: true },
            data: { langIsDefault: false },
          });
        }

        const language = await db.language.create({
          data: {
            langName: data.langName,
            langCode: data.langCode,
            langFlag: data.langFlag,
            langIsDefault: data.langIsDefault || false,
            langIsRtl: data.langIsRtl || false,
            langOrder: data.langOrder || 0,
          },
        });

        res.status(201).json({
          success: true,
          data: { language },
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

  // Update language
  router.put(
    '/:code',
    requirePermission('languages.edit'),
    async (req: AuthRequest, res: Response) => {
      try {
        const data = createLanguageSchema.partial().parse(req.body);

        // If setting as default, unset other defaults
        if (data.langIsDefault) {
          await db.language.updateMany({
            where: {
              langIsDefault: true,
              langCode: { not: req.params.code },
            },
            data: { langIsDefault: false },
          });
        }

        const language = await db.language.update({
          where: { langCode: req.params.code },
          data,
        });

        res.json({
          success: true,
          data: { language },
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

  // Delete language
  router.delete(
    '/:code',
    requirePermission('languages.delete'),
    async (req: AuthRequest, res: Response) => {
      try {
        await db.language.delete({
          where: { langCode: req.params.code },
        });

        res.json({
          success: true,
          message: 'Language deleted successfully',
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

