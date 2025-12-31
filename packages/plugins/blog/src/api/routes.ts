import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { PostService, CategoryService, TagService, AuthMiddleware, AuditService } from '@cms/core';
import { PrismaClient } from '@cms/core';
import { ApiResponse, PaginatedResponse } from '@cms/shared';
import { PostCreateData, PostUpdateData, CategoryCreateData, CategoryUpdateData, TagCreateData, TagUpdateData } from '../models/types';

const router = Router();
const prisma = new PrismaClient();
const postService = new PostService(prisma);
const categoryService = new CategoryService(prisma);
const tagService = new TagService(prisma);
const auditService = new AuditService(prisma);
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const createPostValidation = [
  body('name').isLength({ min: 1, max: 120 }),
  body('content').optional().isString(),
  body('status').optional().isIn(['published', 'draft', 'pending']),
  body('isFeatured').optional().isBoolean(),
  body('description').optional().isLength({ max: 400 }),
  body('image').optional().isString(),
  body('formatType').optional().isString(),
  body('categoryIds').optional().isArray(),
  body('tagIds').optional().isArray(),
];

const updatePostValidation = [
  param('id').isInt(),
  body('name').optional().isLength({ min: 1, max: 120 }),
  body('content').optional().isString(),
  body('status').optional().isIn(['published', 'draft', 'pending']),
  body('isFeatured').optional().isBoolean(),
  body('description').optional().isLength({ max: 400 }),
  body('image').optional().isString(),
  body('formatType').optional().isString(),
  body('categoryIds').optional().isArray(),
  body('tagIds').optional().isArray(),
];

const listPostsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('perPage').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['published', 'draft', 'pending']),
  query('categoryId').optional().isInt(),
  query('tagId').optional().isInt(),
  query('search').optional().isString(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

const createCategoryValidation = [
  body('name').isLength({ min: 1, max: 120 }),
  body('parentId').optional().isInt({ min: 0 }),
  body('description').optional().isLength({ max: 400 }),
  body('status').optional().isIn(['published', 'draft']),
  body('icon').optional().isString(),
  body('order').optional().isInt({ min: 0 }),
  body('isFeatured').optional().isBoolean(),
  body('isDefault').optional().isBoolean(),
];

const updateCategoryValidation = [
  param('id').isInt(),
  body('name').optional().isLength({ min: 1, max: 120 }),
  body('parentId').optional().isInt({ min: 0 }),
  body('description').optional().isLength({ max: 400 }),
  body('status').optional().isIn(['published', 'draft']),
  body('icon').optional().isString(),
  body('order').optional().isInt({ min: 0 }),
  body('isFeatured').optional().isBoolean(),
  body('isDefault').optional().isBoolean(),
];

const createTagValidation = [
  body('name').isLength({ min: 1, max: 120 }),
  body('description').optional().isLength({ max: 400 }),
  body('status').optional().isIn(['published', 'draft']),
];

// ==================== POSTS ROUTES ====================

// GET /api/v1/blog/posts - List posts
router.get('/posts',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('posts.index'),
  listPostsValidation,
  async (req, res) => {
    try {
      const options = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        perPage: req.query.perPage ? parseInt(req.query.perPage as string) : 15,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        filters: {
          status: req.query.status as string,
          categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
          tagId: req.query.tagId ? parseInt(req.query.tagId as string) : undefined,
          search: req.query.search as string,
        },
      };

      const result = await postService.list(options);

      res.json({
        success: true,
        data: {
          posts: result.posts,
          pagination: {
            currentPage: result.page,
            lastPage: result.totalPages,
            perPage: result.perPage,
            total: result.total,
          },
        },
      } as ApiResponse);
    } catch (error) {
      console.error('List posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list posts',
      } as ApiResponse);
    }
  }
);

// GET /api/v1/blog/posts/:id - Get single post
router.get('/posts/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('posts.edit'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const locale = req.query.locale as string || 'en';

      const post = await postService.findById(id, locale);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { post },
      } as ApiResponse);
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get post',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/blog/posts - Create post
router.post('/posts',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('posts.create'),
  createPostValidation,
  async (req, res) => {
    try {
      const data: PostCreateData = {
        ...req.body,
        authorId: req.user!.userId,
      };

      const locale = req.body.locale || 'en';
      const post = await postService.create(data, locale);

      // Audit log
      await auditService.logCreate(
        req.user!.userId,
        'posts',
        post.id,
        post.name
      );

      res.status(201).json({
        success: true,
        data: { post },
        message: 'Post created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post',
      } as ApiResponse);
    }
  }
);

// PUT /api/v1/blog/posts/:id - Update post
router.put('/posts/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('posts.edit'),
  updatePostValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data: PostUpdateData = req.body;
      const locale = req.body.locale || 'en';

      const post = await postService.update(id, data, locale);

      // Audit log
      await auditService.logUpdate(
        req.user!.userId,
        'posts',
        post.id,
        post.name
      );

      res.json({
        success: true,
        data: { post },
        message: 'Post updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update post',
      } as ApiResponse);
    }
  }
);

// DELETE /api/v1/blog/posts/:id - Delete post
router.delete('/posts/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('posts.delete'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await postService.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        } as ApiResponse);
      }

      await postService.delete(id);

      // Audit log
      await auditService.logDelete(
        req.user!.userId,
        'posts',
        id,
        post.name
      );

      res.json({
        success: true,
        message: 'Post deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete post',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/blog/posts/:id/publish - Publish post
router.post('/posts/:id/publish',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('posts.publish'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await postService.publish(id);

      // Audit log
      await auditService.logPublish(
        req.user!.userId,
        'posts',
        post.id,
        post.name
      );

      res.json({
        success: true,
        data: { post },
        message: 'Post published successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Publish post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish post',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/blog/posts/:id/unpublish - Unpublish post
router.post('/posts/:id/unpublish',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('posts.publish'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await postService.unpublish(id);

      res.json({
        success: true,
        data: { post },
        message: 'Post unpublished successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Unpublish post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unpublish post',
      } as ApiResponse);
    }
  }
);

// ==================== CATEGORIES ROUTES ====================

// GET /api/v1/blog/categories - List categories
router.get('/categories',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('categories.index'),
  async (req, res) => {
    try {
      const options = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        perPage: req.query.perPage ? parseInt(req.query.perPage as string) : 15,
        sortBy: req.query.sortBy as string || 'order',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
        filters: {
          status: req.query.status as string,
          search: req.query.search as string,
        },
      };

      const result = await categoryService.list(options);

      res.json({
        success: true,
        data: {
          categories: result.categories,
          pagination: {
            currentPage: result.page,
            lastPage: result.totalPages,
            perPage: result.perPage,
            total: result.total,
          },
        },
      } as ApiResponse);
    } catch (error) {
      console.error('List categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list categories',
      } as ApiResponse);
    }
  }
);

// GET /api/v1/blog/categories/tree - Get category tree
router.get('/categories/tree',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('categories.index'),
  async (req, res) => {
    try {
      const tree = await categoryService.getTree();

      res.json({
        success: true,
        data: { categories: tree },
      } as ApiResponse);
    } catch (error) {
      console.error('Get category tree error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get category tree',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/blog/categories - Create category
router.post('/categories',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('categories.create'),
  createCategoryValidation,
  async (req, res) => {
    try {
      const data: CategoryCreateData = {
        ...req.body,
        authorId: req.user!.userId,
      };

      const category = await categoryService.create(data);

      res.status(201).json({
        success: true,
        data: { category },
        message: 'Category created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
      } as ApiResponse);
    }
  }
);

// PUT /api/v1/blog/categories/tree - Update category tree
router.put('/categories/tree',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('categories.edit'),
  async (req, res) => {
    try {
      const updates = req.body.updates || [];
      await categoryService.updateTree(updates);

      res.json({
        success: true,
        message: 'Category tree updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Update category tree error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update category tree',
      } as ApiResponse);
    }
  }
);

// ==================== TAGS ROUTES ====================

// GET /api/v1/blog/tags - List tags
router.get('/tags',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('tags.index'),
  async (req, res) => {
    try {
      const options = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        perPage: req.query.perPage ? parseInt(req.query.perPage as string) : 15,
        sortBy: req.query.sortBy as string || 'name',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
        filters: {
          status: req.query.status as string,
          search: req.query.search as string,
        },
      };

      const result = await tagService.list(options);

      res.json({
        success: true,
        data: {
          tags: result.tags,
          pagination: {
            currentPage: result.page,
            lastPage: result.totalPages,
            perPage: result.perPage,
            total: result.total,
          },
        },
      } as ApiResponse);
    } catch (error) {
      console.error('List tags error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list tags',
      } as ApiResponse);
    }
  }
);

// GET /api/v1/blog/tags/all - Get all tags
router.get('/tags/all',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('tags.index'),
  async (req, res) => {
    try {
      const tags = await tagService.getAll();

      res.json({
        success: true,
        data: { tags },
      } as ApiResponse);
    } catch (error) {
      console.error('Get all tags error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get tags',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/blog/tags - Create tag
router.post('/tags',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('tags.create'),
  createTagValidation,
  async (req, res) => {
    try {
      const data: TagCreateData = {
        ...req.body,
        authorId: req.user!.userId,
      };

      const tag = await tagService.create(data);

      res.status(201).json({
        success: true,
        data: { tag },
        message: 'Tag created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create tag error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create tag',
      } as ApiResponse);
    }
  }
);

// GET /api/v1/blog/tags/search - Search tags
router.get('/tags/search',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('tags.index'),
  query('q').isLength({ min: 1 }),
  async (req, res) => {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const tags = await tagService.search(query, limit);

      res.json({
        success: true,
        data: { tags },
      } as ApiResponse);
    } catch (error) {
      console.error('Search tags error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search tags',
      } as ApiResponse);
    }
  }
);

export default router;
