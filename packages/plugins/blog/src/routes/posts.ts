import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { PluginContext } from '@cms/shared';
import { z } from 'zod';
import { SlugService, QueueService, AuditService } from '@cms/core';
import { generateUuid } from '@cms/shared/utils';

const createPostSchema = z.object({
  name: z.string().min(1),
  content: z.string().optional(),
  description: z.string().max(400).optional(),
  status: z.enum(['published', 'draft']).default('draft'),
  formatType: z.string().max(30).optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  slug: z.string().optional(),
  locale: z.string().optional(),
  categoryIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
  tagNames: z.array(z.string()).optional(), // For creating tags on-the-fly
  translationGroupId: z.string().optional(),
  // Meta boxes
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoImage: z.string().optional(),
  banner: z.string().optional(),
  gallery: z.array(z.string()).optional(),
});

export function registerPostRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
) {
  const db = ctx.db as PrismaClient;
  const slugService = new SlugService(db);
  const queueService = ctx.queue as QueueService;
  const auditService = ctx.audit as AuditService;

  // List posts
  router.get(
    '/blog/posts',
    requireAuth,
    requirePermission('blog.posts.index'),
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

        const [posts, total] = await Promise.all([
          db.post.findMany({
            where,
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              categories: {
                include: {
                  category: true,
                },
              },
              tags: {
                include: {
                  tag: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: perPageNum,
          }),
          db.post.count({ where }),
        ]);

        res.json({
          success: true,
          data: {
            posts,
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

  // Get post by ID
  router.get(
    '/blog/posts/:id',
    requireAuth,
    requirePermission('blog.posts.index'),
    async (req: any, res: Response) => {
      try {
        const post = await db.post.findUnique({
          where: { id: parseInt(req.params.id) },
          include: {
            translations: true,
            categories: {
              include: {
                category: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
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

        if (!post) {
          return res.status(404).json({
            success: false,
            error: 'Post not found',
          });
        }

        // Get meta boxes
        const metaBoxes = await db.metaBox.findMany({
          where: {
            referenceType: 'Post',
            referenceId: post.id,
          },
        });

        const meta: Record<string, any> = {};
        for (const metaBox of metaBoxes) {
          meta[metaBox.metaKey] = metaBox.metaValue;
        }

        // Get linked translations
        let linkedTranslations: any[] = [];
        if (post.translationGroupId) {
          linkedTranslations = await db.post.findMany({
            where: {
              translationGroupId: post.translationGroupId,
              id: { not: post.id },
            },
          });
        }

        res.json({
          success: true,
          data: {
            post: {
              ...post,
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

  // Create post
  router.post(
    '/blog/posts',
    requireAuth,
    requirePermission('blog.posts.create'),
    async (req: any, res: Response) => {
      try {
        const data = createPostSchema.parse(req.body);
        const userId = req.user!.id;

        // Generate translation group ID if not provided
        const translationGroupId = data.translationGroupId || generateUuid();

        // Generate slug if not provided (with "blog" prefix)
        let slug = data.slug;
        if (!slug) {
          slug = await slugService.generate(data.name, 'Post', {
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

        // Create tags if tagNames provided
        const tagIds: number[] = [...(data.tagIds || [])];
        if (data.tagNames && data.tagNames.length > 0) {
          for (const tagName of data.tagNames) {
            const existingTag = await db.tag.findFirst({
              where: { name: tagName },
            });
            if (existingTag) {
              tagIds.push(existingTag.id);
            } else {
              const newTag = await db.tag.create({
                data: {
                  name: tagName,
                  authorId: userId,
                  status: 'published',
                },
              });
              tagIds.push(newTag.id);
            }
          }
        }

        // Create post
        const post = await db.post.create({
          data: {
            name: data.name,
            content: data.content,
            description: data.description,
            status: data.status,
            formatType: data.formatType,
            image: data.image,
            isFeatured: data.isFeatured || false,
            authorId: userId,
            translationGroupId,
          },
        });

        // Create slug
        await slugService.create('Post', post.id, slug, 'blog', data.locale);

        // Attach categories
        if (data.categoryIds && data.categoryIds.length > 0) {
          await db.postCategory.createMany({
            data: data.categoryIds.map((catId) => ({
              postId: post.id,
              categoryId: catId,
            })),
          });
        }

        // Attach tags
        if (tagIds.length > 0) {
          await db.postTag.createMany({
            data: tagIds.map((tagId) => ({
              postId: post.id,
              tagId,
            })),
          });
        }

        // Create meta boxes
        const metaBoxes = [];
        if (data.seoTitle) {
          metaBoxes.push({
            referenceType: 'Post',
            referenceId: post.id,
            metaKey: 'seo_title',
            metaValue: data.seoTitle,
          });
        }
        if (data.seoDescription) {
          metaBoxes.push({
            referenceType: 'Post',
            referenceId: post.id,
            metaKey: 'seo_description',
            metaValue: data.seoDescription,
          });
        }
        if (data.banner) {
          metaBoxes.push({
            referenceType: 'Post',
            referenceId: post.id,
            metaKey: 'banner',
            metaValue: data.banner,
          });
        }
        if (data.gallery && data.gallery.length > 0) {
          metaBoxes.push({
            referenceType: 'Post',
            referenceId: post.id,
            metaKey: 'gallery',
            metaValue: JSON.stringify(data.gallery),
          });
        }

        if (metaBoxes.length > 0) {
          await db.metaBox.createMany({
            data: metaBoxes,
          });
        }

        // Enqueue sitemap generation if published
        if (data.status === 'published') {
          await queueService.enqueue('sitemap.generate', {});
        }

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'create',
          referenceId: BigInt(post.id),
          referenceName: post.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.status(201).json({
          success: true,
          data: { post },
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

  // Update post
  router.put(
    '/blog/posts/:id',
    requireAuth,
    requirePermission('blog.posts.edit'),
    async (req: any, res: Response) => {
      try {
        const postId = parseInt(req.params.id);
        const data = createPostSchema.partial().parse(req.body);
        const userId = req.user!.id;

        const existingPost = await db.post.findUnique({
          where: { id: postId },
        });

        if (!existingPost) {
          return res.status(404).json({
            success: false,
            error: 'Post not found',
          });
        }

        // Check slug if changed
        if (data.slug) {
          const slugRecord = await slugService.getByEntity('Post', postId);
          if (slugRecord && slugRecord.key !== data.slug) {
            const availability = await slugService.checkAvailability(
              data.slug,
              'blog',
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
            await slugService.update(slugRecord.id, data.slug, 'blog', data.locale);
          }
        }

        // Update post
        const post = await db.post.update({
          where: { id: postId },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status && { status: data.status }),
            ...(data.formatType !== undefined && { formatType: data.formatType }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
          },
        });

        // Update categories
        if (data.categoryIds) {
          await db.postCategory.deleteMany({
            where: { postId },
          });
          if (data.categoryIds.length > 0) {
            await db.postCategory.createMany({
              data: data.categoryIds.map((catId) => ({
                postId,
                categoryId: catId,
              })),
            });
          }
        }

        // Update tags
        if (data.tagIds || data.tagNames) {
          await db.postTag.deleteMany({
            where: { postId },
          });
          
          const tagIds: number[] = [...(data.tagIds || [])];
          if (data.tagNames && data.tagNames.length > 0) {
            for (const tagName of data.tagNames) {
              const existingTag = await db.tag.findFirst({
                where: { name: tagName },
              });
              if (existingTag) {
                tagIds.push(existingTag.id);
              } else {
                const newTag = await db.tag.create({
                  data: {
                    name: tagName,
                    authorId: userId,
                    status: 'published',
                  },
                });
                tagIds.push(newTag.id);
              }
            }
          }

          if (tagIds.length > 0) {
            await db.postTag.createMany({
              data: tagIds.map((tagId) => ({
                postId,
                tagId,
              })),
            });
          }
        }

        // Enqueue sitemap generation if status changed to published
        if (data.status === 'published' && existingPost.status !== 'published') {
          await queueService.enqueue('sitemap.generate', {});
        }

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'update',
          referenceId: BigInt(post.id),
          referenceName: post.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          data: { post },
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

  // Delete post
  router.delete(
    '/blog/posts/:id',
    requireAuth,
    requirePermission('blog.posts.delete'),
    async (req: any, res: Response) => {
      try {
        const postId = parseInt(req.params.id);
        const userId = req.user!.id;

        const post = await db.post.findUnique({
          where: { id: postId },
        });

        if (!post) {
          return res.status(404).json({
            success: false,
            error: 'Post not found',
          });
        }

        await db.post.delete({
          where: { id: postId },
        });

        // Enqueue sitemap generation
        await queueService.enqueue('sitemap.generate', {});

        // Audit log
        await auditService.log({
          userId,
          module: 'blog',
          action: 'delete',
          referenceId: BigInt(postId),
          referenceName: post.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          message: 'Post deleted successfully',
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
    '/blog/posts/slug/check',
    requireAuth,
    async (req: any, res: Response) => {
      try {
        const { slug, locale, excludeId } = req.body;

        if (!slug) {
          return res.status(400).json({
            success: false,
            error: 'Slug is required',
          });
        }

        const availability = await slugService.checkAvailability(
          slug,
          'blog',
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
}

