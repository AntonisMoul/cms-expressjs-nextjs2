import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { PluginContext } from '@cms/shared';
import { z } from 'zod';
import { SlugService, AuditService } from '@cms/core';
import { generateUuid } from '@cms/shared/utils';

const createTagSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(400).optional(),
  status: z.enum(['published', 'draft']).default('published'),
  slug: z.string().optional(),
  locale: z.string().optional(),
  translationGroupId: z.string().optional(),
});

export function registerTagRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
) {
  const db = ctx.db as PrismaClient;
  const slugService = new SlugService(db);
  const auditService = ctx.audit as AuditService;

  // List tags
  router.get(
    '/blog/tags',
    requireAuth,
    requirePermission('blog.tags.index'),
    async (req: any, res: Response) => {
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

        const [tags, total] = await Promise.all([
          db.tag.findMany({
            where,
            include: {
              slug: true,
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
            orderBy: { name: 'asc' },
            skip,
            take: perPageNum,
          }),
          db.tag.count({ where }),
        ]);

        res.json({
          success: true,
          data: {
            tags,
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

  // Get tag by ID
  router.get(
    '/blog/tags/:id',
    requireAuth,
    requirePermission('blog.tags.index'),
    async (req: any, res: Response) => {
      try {
        const tag = await db.tag.findUnique({
          where: { id: parseInt(req.params.id) },
          include: {
            slug: true,
            translations: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });

        if (!tag) {
          return res.status(404).json({
            success: false,
            error: 'Tag not found',
          });
        }

        res.json({
          success: true,
          data: { tag },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Create tag
  router.post(
    '/blog/tags',
    requireAuth,
    requirePermission('blog.tags.create'),
    async (req: any, res: Response) => {
      try {
        const data = createTagSchema.parse(req.body);
        const userId = req.user!.id;

        const translationGroupId = data.translationGroupId || generateUuid();

        // Generate slug if not provided
        let slug = data.slug;
        if (!slug) {
          slug = await slugService.generate(data.name, 'Tag', {
            prefix: 'blog',
            locale: data.locale,
          });
        } else {
          const availability = await slugService.checkAvailability(
            slug,
            'blog',
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

        const tag = await db.tag.create({
          data: {
            name: data.name,
            description: data.description,
            status: data.status,
            authorId: userId,
            translationGroupId,
          },
        });

        // Create slug
        await slugService.create('Tag', tag.id, slug, 'blog', data.locale);

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'create_tag',
          referenceId: BigInt(tag.id),
          referenceName: tag.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.status(201).json({
          success: true,
          data: { tag },
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

  // Update tag
  router.put(
    '/blog/tags/:id',
    requireAuth,
    requirePermission('blog.tags.edit'),
    async (req: any, res: Response) => {
      try {
        const tagId = parseInt(req.params.id);
        const data = createTagSchema.partial().parse(req.body);
        const userId = req.user!.id;

        const tag = await db.tag.update({
          where: { id: tagId },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status && { status: data.status }),
          },
        });

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'update_tag',
          referenceId: BigInt(tag.id),
          referenceName: tag.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          data: { tag },
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

  // Delete tag
  router.delete(
    '/blog/tags/:id',
    requireAuth,
    requirePermission('blog.tags.delete'),
    async (req: any, res: Response) => {
      try {
        const tagId = parseInt(req.params.id);
        const userId = req.user!.id;

        const tag = await db.tag.findUnique({
          where: { id: tagId },
        });

        if (!tag) {
          return res.status(404).json({
            success: false,
            error: 'Tag not found',
          });
        }

        await db.tag.delete({
          where: { id: tagId },
        });

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'delete_tag',
          referenceId: BigInt(tagId),
          referenceName: tag.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          message: 'Tag deleted successfully',
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

