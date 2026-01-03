import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { PluginContext } from '@cms/shared';
import { z } from 'zod';
import { SlugService, QueueService, AuditService } from '@cms/core';
import { generateUuid } from '@cms/shared/utils';

const createCategorySchema = z.object({
  name: z.string().min(1).max(120),
  parentId: z.number().default(0),
  description: z.string().max(400).optional(),
  status: z.enum(['published', 'draft']).default('published'),
  icon: z.string().max(60).optional(),
  order: z.number().default(0),
  isFeatured: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  slug: z.string().optional(),
  locale: z.string().optional(),
  translationGroupId: z.string().optional(),
});

export function registerCategoryRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
) {
  const db = ctx.db as PrismaClient;
  const slugService = new SlugService(db);
  const queueService = ctx.queue as QueueService;
  const auditService = ctx.audit as AuditService;

  // List categories (tree structure)
  router.get(
    '/blog/categories',
    requireAuth,
    requirePermission('blog.categories.index'),
    async (req: any, res: Response) => {
      try {
        const categories = await db.category.findMany({
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        });

        // Build tree structure
        const buildTree = (parentId: number = 0): any[] => {
          return categories
            .filter((cat) => cat.parentId === parentId)
            .map((cat) => ({
              ...cat,
              children: buildTree(cat.id),
            }));
        };

        const tree = buildTree();

        res.json({
          success: true,
          data: { categories: tree },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Get category by ID
  router.get(
    '/blog/categories/:id',
    requireAuth,
    requirePermission('blog.categories.index'),
    async (req: any, res: Response) => {
      try {
        const category = await db.category.findUnique({
          where: { id: parseInt(req.params.id) },
          include: {
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

        if (!category) {
          return res.status(404).json({
            success: false,
            error: 'Category not found',
          });
        }

        res.json({
          success: true,
          data: { category },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Create category
  router.post(
    '/blog/categories',
    requireAuth,
    requirePermission('blog.categories.create'),
    async (req: any, res: Response) => {
      try {
        const data = createCategorySchema.parse(req.body);
        const userId = req.user!.id;

        const translationGroupId = data.translationGroupId || generateUuid();

        // Generate slug if not provided
        let slug = data.slug;
        if (!slug) {
          slug = await slugService.generate(data.name, 'Category', {
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

        const category = await db.category.create({
          data: {
            name: data.name,
            parentId: data.parentId,
            description: data.description,
            status: data.status,
            icon: data.icon,
            order: data.order,
            isFeatured: data.isFeatured || false,
            isDefault: data.isDefault || false,
            authorId: userId,
            translationGroupId,
          },
        });

        // Create slug
        await slugService.create('Category', category.id, slug, 'blog', data.locale);

        // Enqueue sitemap generation if published
        if (data.status === 'published') {
          await queueService.enqueue('sitemap.generate', {});
        }

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'create_category',
          referenceId: BigInt(category.id),
          referenceName: category.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.status(201).json({
          success: true,
          data: { category },
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

  // Update category
  router.put(
    '/blog/categories/:id',
    requireAuth,
    requirePermission('blog.categories.edit'),
    async (req: any, res: Response) => {
      try {
        const categoryId = parseInt(req.params.id);
        const data = createCategorySchema.partial().parse(req.body);
        const userId = req.user!.id;

        const category = await db.category.update({
          where: { id: categoryId },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.parentId !== undefined && { parentId: data.parentId }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status && { status: data.status }),
            ...(data.icon !== undefined && { icon: data.icon }),
            ...(data.order !== undefined && { order: data.order }),
            ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
            ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
          },
        });

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'update_category',
          referenceId: BigInt(category.id),
          referenceName: category.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          data: { category },
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

  // Update category tree (reorder)
  router.put(
    '/blog/categories/update-tree',
    requireAuth,
    requirePermission('blog.categories.edit'),
    async (req: any, res: Response) => {
      try {
        const { tree } = req.body; // Array of { id, parentId, order }

        if (!Array.isArray(tree)) {
          return res.status(400).json({
            success: false,
            error: 'Tree must be an array',
          });
        }

        // Update each category
        for (const item of tree) {
          await db.category.update({
            where: { id: item.id },
            data: {
              parentId: item.parentId || 0,
              order: item.order || 0,
            },
          });
        }

        res.json({
          success: true,
          message: 'Category tree updated successfully',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Delete category
  router.delete(
    '/blog/categories/:id',
    requireAuth,
    requirePermission('blog.categories.delete'),
    async (req: any, res: Response) => {
      try {
        const categoryId = parseInt(req.params.id);
        const userId = req.user!.id;

        const category = await db.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            error: 'Category not found',
          });
        }

        await db.category.delete({
          where: { id: categoryId },
        });

        // Enqueue sitemap generation
        await queueService.enqueue('sitemap.generate', {});

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'delete_category',
          referenceId: BigInt(categoryId),
          referenceName: category.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          message: 'Category deleted successfully',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Search categories
  router.get(
    '/blog/categories/search',
    requireAuth,
    requirePermission('blog.categories.index'),
    async (req: any, res: Response) => {
      try {
        const { q } = req.query;

        if (!q) {
          return res.json({
            success: true,
            data: { categories: [] },
          });
        }

        const categories = await db.category.findMany({
          where: {
            name: { contains: q as string },
            status: 'published',
          },
          take: 20,
          orderBy: { name: 'asc' },
        });

        res.json({
          success: true,
          data: { categories },
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

