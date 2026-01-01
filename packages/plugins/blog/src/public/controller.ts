import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BlogService } from '../service';

const prisma = new PrismaClient();
const blogService = new BlogService(prisma);

export class BlogPublicController {
  static async getPosts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const tag = req.query.tag as string;

      // Get published posts with relations
      const posts = await prisma.post.findMany({
        where: {
          status: 'published',
          ...(category && {
            categories: {
              some: {
                categoryId: category,
              },
            },
          }),
          ...(tag && {
            tags: {
              some: {
                tagId: tag,
              },
            },
          }),
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
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
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      const formattedPosts = posts.map(post => ({
        id: post.id,
        name: post.name,
        description: post.description,
        content: post.content,
        status: post.status,
        authorId: post.authorId,
        authorType: post.authorType,
        isFeatured: post.isFeatured,
        image: post.image,
        views: post.views,
        formatType: post.formatType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag),
      }));

      res.json({
        success: true,
        data: { posts: formattedPosts },
      });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getPost(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      // For now, we'll use the slug parameter directly
      // In a full implementation, this would resolve the slug through the SlugService
      const post = await prisma.post.findFirst({
        where: {
          id: slug, // This is a temporary implementation
          status: 'published',
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
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
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Increment view count
      await blogService.incrementPostViews(post.id);

      const formattedPost = {
        id: post.id,
        name: post.name,
        description: post.description,
        content: post.content,
        status: post.status,
        authorId: post.authorId,
        authorType: post.authorType,
        isFeatured: post.isFeatured,
        image: post.image,
        views: post.views + 1, // Include the incremented view
        formatType: post.formatType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag),
      };

      res.json({
        success: true,
        data: { post: formattedPost },
      });
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          status: 'published',
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      });

      const formattedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        parentId: category.parentId,
        description: category.description,
        status: category.status,
        authorId: category.authorId,
        authorType: category.authorType,
        icon: category.icon,
        order: category.order,
        isFeatured: category.isFeatured,
        isDefault: category.isDefault,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        postCount: category._count.posts,
      }));

      res.json({
        success: true,
        data: { categories: formattedCategories },
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getTags(req: Request, res: Response) {
    try {
      const tags = await prisma.tag.findMany({
        where: {
          status: 'published',
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        authorId: tag.authorId,
        authorType: tag.authorType,
        description: tag.description,
        status: tag.status,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        postCount: tag._count.posts,
      }));

      res.json({
        success: true,
        data: { tags: formattedTags },
      });
    } catch (error) {
      console.error('Get tags error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getFeaturedPosts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 5;

      const posts = await prisma.post.findMany({
        where: {
          status: 'published',
          isFeatured: true,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
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
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      const formattedPosts = posts.map(post => ({
        id: post.id,
        name: post.name,
        description: post.description,
        content: post.content,
        status: post.status,
        authorId: post.authorId,
        authorType: post.authorType,
        isFeatured: post.isFeatured,
        image: post.image,
        views: post.views,
        formatType: post.formatType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag),
      }));

      res.json({
        success: true,
        data: { posts: formattedPosts },
      });
    } catch (error) {
      console.error('Get featured posts error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getPostsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const posts = await prisma.post.findMany({
        where: {
          status: 'published',
          categories: {
            some: {
              categoryId,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
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
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      const formattedPosts = posts.map(post => ({
        id: post.id,
        name: post.name,
        description: post.description,
        content: post.content,
        status: post.status,
        authorId: post.authorId,
        authorType: post.authorType,
        isFeatured: post.isFeatured,
        image: post.image,
        views: post.views,
        formatType: post.formatType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag),
      }));

      res.json({
        success: true,
        data: { posts: formattedPosts },
      });
    } catch (error) {
      console.error('Get posts by category error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getPostsByTag(req: Request, res: Response) {
    try {
      const { tagId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const posts = await prisma.post.findMany({
        where: {
          status: 'published',
          tags: {
            some: {
              tagId,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
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
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      const formattedPosts = posts.map(post => ({
        id: post.id,
        name: post.name,
        description: post.description,
        content: post.content,
        status: post.status,
        authorId: post.authorId,
        authorType: post.authorType,
        isFeatured: post.isFeatured,
        image: post.image,
        views: post.views,
        formatType: post.formatType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag),
      }));

      res.json({
        success: true,
        data: { posts: formattedPosts },
      });
    } catch (error) {
      console.error('Get posts by tag error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

