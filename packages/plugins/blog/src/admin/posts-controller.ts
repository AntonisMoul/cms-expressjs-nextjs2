import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BlogService } from '../service';
import { AuditService, SlugService } from '@cms/core';

const prisma = new PrismaClient();
const blogService = new BlogService(prisma);
const auditService = new AuditService(prisma);
const slugService = new SlugService(prisma);

export class BlogPostsAdminController {
  static async index(req: Request, res: Response) {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
        status: req.query.status as string,
        author: req.query.author as string,
        category: req.query.category as string,
        tag: req.query.tag as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await blogService.getPosts(options);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Blog posts index error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const authorId = req.user!.id;

      const post = await blogService.createPost(data, authorId);

      // Create slug for the post
      await slugService.createSlugForEntity('post', post.id, post.name, 'blog');

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'create_post',
        post.id,
        post.name,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({
        success: true,
        data: { post },
        message: 'Post created successfully',
      });
    } catch (error: any) {
      console.error('Post create error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Post name already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await blogService.getPostWithRelations(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      res.json({
        success: true,
        data: { post },
      });
    } catch (error) {
      console.error('Post show error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const authorId = req.user!.id;

      const existingPost = await blogService.getPostById(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      const post = await blogService.updatePost(id, data);

      // Update slug if name changed
      if (data.name && data.name !== existingPost.name) {
        await slugService.updateSlugForEntity('post', post.id, post.name, 'blog');
      }

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'update_post',
        post.id,
        post.name,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { post },
        message: 'Post updated successfully',
      });
    } catch (error: any) {
      console.error('Post update error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Post name already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authorId = req.user!.id;

      const post = await blogService.getPostById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      await blogService.deletePost(id);

      // Deactivate slug
      await slugService.deactivateSlug(id);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'delete_post',
        post.id,
        post.name,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      console.error('Post delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Translation methods
  static async createTranslation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { langCode, name, description, content } = req.body;
      const authorId = req.user!.id;

      await blogService.createPostTranslation(id, langCode, {
        name,
        description,
        content,
      });

      const post = await blogService.getPostById(id);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'create_post_translation',
        post!.id,
        `${post!.name} (${langCode})`,
        { langCode, name },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation created successfully',
      });
    } catch (error) {
      console.error('Create post translation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async updateTranslation(req: Request, res: Response) {
    try {
      const { id, langCode } = req.params;
      const { name, description, content } = req.body;
      const authorId = req.user!.id;

      await blogService.updatePostTranslation(id, langCode, {
        name,
        description,
        content,
      });

      const post = await blogService.getPostById(id);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'update_post_translation',
        post!.id,
        `${post!.name} (${langCode})`,
        { langCode, name },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation updated successfully',
      });
    } catch (error) {
      console.error('Update post translation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async deleteTranslation(req: Request, res: Response) {
    try {
      const { id, langCode } = req.params;
      const authorId = req.user!.id;

      const post = await blogService.getPostById(id);

      await blogService.deletePostTranslation(id, langCode);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'delete_post_translation',
        post!.id,
        `${post!.name} (${langCode})`,
        { langCode },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation deleted successfully',
      });
    } catch (error) {
      console.error('Delete post translation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

