import { Router, Response, Request } from 'express';
import { PrismaClient } from '@cms/shared';
import { PluginContext } from '@cms/shared';
import { z } from 'zod';
import { SlugService, QueueService, AuditService } from '@cms/core';
import { generateUuid } from '@cms/shared/utils';

// Auth middleware types (will be passed from API)
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    superUser: boolean;
  };
}

export type AuthMiddleware = (req: AuthRequest, res: Response, next: () => void) => void;
export type PermissionMiddleware = (permission: string) => AuthMiddleware;

const createPageSchema = z.object({
  name: z.string().min(1).max(120),
  content: z.string().optional(),
  description: z.string().max(400).optional(),
  status: z.enum(['published', 'draft']).default('draft'),
  template: z.string().max(60).optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
  locale: z.string().optional(),
  translationGroupId: z.string().optional(), // For creating translation
  // Meta boxes
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoImage: z.string().optional(),
  banner: z.string().optional(),
  gallery: z.array(z.string()).optional(),
});

export function registerPageRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: AuthMiddleware,
  requirePermission: PermissionMiddleware
): void {
  const db = ctx.db as PrismaClient;
  const slugService = new SlugService(db);
  const queueService = ctx.queue as QueueService;
  const auditService = ctx.audit as AuditService;

  // List pages
  router.get(
    '/pages',
    requireAuth,
    requirePermission('pages.index'),
    async (req: AuthRequest, res: Response) => {
      try {
        const { page = '1', perPage = '20', search, status } = req.query;
        const pageNum = parseInt(page as string);
        const perPageNum = parseInt(perPage as string);
        const skip = (pageNum - 1) * perPageNum;

        const where: any = {};
        if (search) {
          where.name = { contains: search as string };
        }
        if (status) {
          where.status = status;
        }

        const [pages, total] = await Promise.all([
          db.page.findMany({
            where,
            include: {
              slug: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: perPageNum,
          }),
          db.page.count({ where }),
        ]);

        res.json({
          success: true,
          data: {
            pages,
            meta: {
              currentPage: pageNum,
              perPage: perPageNum,
              total,
              lastPage: Math.ceil(total / perPageNum),
            },
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

  // Get page by ID
  router.get(
    '/pages/:id',
    requireAuth,
    requirePermission('pages.index'),
    async (req: AuthRequest, res: Response) => {
      try {
        const page = await db.page.findUnique({
          where: { id: parseInt(req.params.id) },
          include: {
            slug: true,
            translations: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });

        if (!page) {
          return res.status(404).json({
            success: false,
            error: 'Page not found',
          });
        }

        // Get meta boxes (SEO, Gallery, etc.)
        const metaBoxes = await db.metaBox.findMany({
          where: {
            referenceType: 'Page',
            referenceId: page.id,
          },
        });

        const meta: Record<string, any> = {};
        for (const metaBox of metaBoxes) {
          meta[metaBox.metaKey] = metaBox.metaValue;
        }

        // Get linked translations
        let linkedTranslations: any[] = [];
        if (page.translationGroupId) {
          linkedTranslations = await db.page.findMany({
            where: {
              translationGroupId: page.translationGroupId,
              id: { not: page.id },
            },
            include: {
              slug: true,
            },
          });
        }

        res.json({
          success: true,
          data: {
            page: {
              ...page,
              meta,
              linkedTranslations,
            },
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

  // Create page
  router.post(
    '/pages',
    requireAuth,
    requirePermission('pages.create'),
    async (req: AuthRequest, res: Response) => {
      try {
        const data = createPageSchema.parse(req.body);
        const userId = req.user!.id;

        // Generate translation group ID if not provided
        const translationGroupId = data.translationGroupId || generateUuid();

        // Generate slug if not provided
        let slug = data.slug;
        if (!slug) {
          slug = await slugService.generate(data.name, 'Page', {
            prefix: '',
            locale: data.locale,
          });
        } else {
          // Check slug availability
          const availability = await slugService.checkAvailability(
            slug,
            '',
            data.locale
          );
          if (!availability.available) {
            return res.status(400).json({
              success: false,
              error: 'Slug is already taken',
              suggested: availability.suggested,
            });
          }
        }

        // Create page
        const page = await db.page.create({
          data: {
            name: data.name,
            content: data.content,
            description: data.description,
            status: data.status,
            template: data.template,
            image: data.image,
            userId,
            translationGroupId,
          },
        });

        // Create slug
        await slugService.create('Page', page.id, slug, '', data.locale);

        // Create meta boxes
        const metaBoxes = [];
        if (data.seoTitle) {
          metaBoxes.push({
            referenceType: 'Page',
            referenceId: page.id,
            metaKey: 'seo_title',
            metaValue: data.seoTitle,
          });
        }
        if (data.seoDescription) {
          metaBoxes.push({
            referenceType: 'Page',
            referenceId: page.id,
            metaKey: 'seo_description',
            metaValue: data.seoDescription,
          });
        }
        if (data.seoKeywords) {
          metaBoxes.push({
            referenceType: 'Page',
            referenceId: page.id,
            metaKey: 'seo_keywords',
            metaValue: data.seoKeywords,
          });
        }
        if (data.seoImage) {
          metaBoxes.push({
            referenceType: 'Page',
            referenceId: page.id,
            metaKey: 'seo_image',
            metaValue: data.seoImage,
          });
        }
        if (data.banner) {
          metaBoxes.push({
            referenceType: 'Page',
            referenceId: page.id,
            metaKey: 'banner',
            metaValue: data.banner,
          });
        }
        if (data.gallery && data.gallery.length > 0) {
          metaBoxes.push({
            referenceType: 'Page',
            referenceId: page.id,
            metaKey: 'gallery',
            metaValue: JSON.stringify(data.gallery),
          });
        }

        if (metaBoxes.length > 0) {
          await db.metaBox.createMany({
            data: metaBoxes,
          });
        }

        // Create translation if locale provided and different from default
        if (data.locale) {
          const defaultLocale = await (ctx.i18n as any).getDefaultLocale();
          if (data.locale !== defaultLocale) {
            await db.pageTranslation.create({
              data: {
                langCode: data.locale,
                pagesId: page.id,
                name: data.name,
                description: data.description,
                content: data.content,
              },
            });
          }
        }

        // Enqueue sitemap generation if published
        if (data.status === 'published') {
          await queueService.enqueue('sitemap.generate', {});
        }

        // Audit log
        await auditService.log({
          userId,
          module: 'pages',
          action: 'create',
          referenceId: BigInt(page.id),
          referenceName: page.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.status(201).json({
          success: true,
          data: { page },
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

  // Update page
  router.put(
    '/pages/:id',
    requireAuth,
    requirePermission('pages.edit'),
    async (req: AuthRequest, res: Response) => {
      try {
        const pageId = parseInt(req.params.id);
        const data = createPageSchema.partial().parse(req.body);
        const userId = req.user!.id;

        const existingPage = await db.page.findUnique({
          where: { id: pageId },
        });

        if (!existingPage) {
          return res.status(404).json({
            success: false,
            error: 'Page not found',
          });
        }

        // Check slug if changed
        if (data.slug && data.slug !== existingPage.name) {
          const slugRecord = await slugService.getByEntity('Page', pageId);
          if (slugRecord && slugRecord.key !== data.slug) {
            const availability = await slugService.checkAvailability(
              data.slug,
              '',
              data.locale,
              slugRecord.id
            );
            if (!availability.available) {
              return res.status(400).json({
                success: false,
                error: 'Slug is already taken',
                suggested: availability.suggested,
              });
            }

            // Update slug
            await slugService.update(slugRecord.id, data.slug, '', data.locale);
          }
        }

        // Update page
        const page = await db.page.update({
          where: { id: pageId },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status && { status: data.status }),
            ...(data.template !== undefined && { template: data.template }),
            ...(data.image !== undefined && { image: data.image }),
          },
        });

        // Update meta boxes
        if (data.seoTitle !== undefined) {
          const existing = await db.metaBox.findFirst({
            where: {
              referenceType: 'Page',
              referenceId: pageId,
              metaKey: 'seo_title',
            },
          });
          if (existing) {
            await db.metaBox.update({
              where: { id: existing.id },
              data: { metaValue: data.seoTitle },
            });
          } else {
            await db.metaBox.create({
              data: {
                referenceType: 'Page',
                referenceId: pageId,
                metaKey: 'seo_title',
                metaValue: data.seoTitle,
              },
            });
          }
        }

        // Similar for other meta boxes...

        // Enqueue sitemap generation if status changed to published
        if (data.status === 'published' && existingPage.status !== 'published') {
          await queueService.enqueue('sitemap.generate', {});
        }

        // Audit log
        await auditService.log({
          userId,
          module: 'pages',
          action: 'update',
          referenceId: BigInt(page.id),
          referenceName: page.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          data: { page },
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

  // Delete page
  router.delete(
    '/pages/:id',
    requireAuth,
    requirePermission('pages.delete'),
    async (req: AuthRequest, res: Response) => {
      try {
        const pageId = parseInt(req.params.id);
        const userId = req.user!.id;

        const page = await db.page.findUnique({
          where: { id: pageId },
        });

        if (!page) {
          return res.status(404).json({
            success: false,
            error: 'Page not found',
          });
        }

        await db.page.delete({
          where: { id: pageId },
        });

        // Enqueue sitemap generation
        await queueService.enqueue('sitemap.generate', {});

        // Audit log
        await auditService.log({
          userId,
          module: 'pages',
          action: 'delete',
          referenceId: BigInt(pageId),
          referenceName: page.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          message: 'Page deleted successfully',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Check slug availability
  router.post(
    '/pages/slug/check',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const { slug, prefix = '', locale, excludeId } = req.body;

        if (!slug) {
          return res.status(400).json({
            success: false,
            error: 'Slug is required',
          });
        }

        const availability = await slugService.checkAvailability(
          slug,
          prefix,
          locale,
          excludeId
        );

        res.json({
          success: true,
          data: availability,
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Create translation
  router.post(
    '/pages/:id/translations',
    requireAuth,
    requirePermission('pages.create'),
    async (req: AuthRequest, res: Response) => {
      try {
        const { createPageTranslation } = await import('./routes/create-translation');
        const sourcePageId = parseInt(req.params.id);
        const userId = req.user!.id;

        const data = z.object({
          targetLocale: z.string(),
          name: z.string().optional(),
          content: z.string().optional(),
          description: z.string().optional(),
          slug: z.string().optional(),
        }).parse(req.body);

        const translatedPage = await createPageTranslation(
          db,
          slugService,
          queueService,
          auditService,
          userId,
          {
            sourcePageId,
            ...data,
          }
        );

        res.status(201).json({
          success: true,
          data: { page: translatedPage },
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

