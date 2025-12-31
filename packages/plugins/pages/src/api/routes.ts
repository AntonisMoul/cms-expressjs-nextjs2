import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { PageService, SlugService, AuthMiddleware, AuditService } from '@cms/core';
import { PrismaClient } from '@cms/core';
import { ApiResponse, PaginatedResponse } from '@cms/shared';
import { PageCreateData, PageUpdateData, PageListOptions } from '../models/types';

const router = Router();
const prisma = new PrismaClient();
const pageService = new PageService(prisma);
const auditService = new AuditService(prisma);
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const createPageValidation = [
  body('name').isLength({ min: 1, max: 120 }),
  body('content').optional().isString(),
  body('status').optional().isIn(['published', 'draft', 'pending']),
  body('isFeatured').optional().isBoolean(),
  body('description').optional().isLength({ max: 400 }),
  body('image').optional().isString(),
  body('template').optional().isString(),
];

const updatePageValidation = [
  param('id').isInt(),
  body('name').optional().isLength({ min: 1, max: 120 }),
  body('content').optional().isString(),
  body('status').optional().isIn(['published', 'draft', 'pending']),
  body('isFeatured').optional().isBoolean(),
  body('description').optional().isLength({ max: 400 }),
  body('image').optional().isString(),
  body('template').optional().isString(),
];

const listPagesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('perPage').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['published', 'draft', 'pending']),
  query('search').optional().isString(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

// Routes

// GET /api/v1/pages - List pages
router.get('/',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.index'),
  listPagesValidation,
  async (req, res) => {
    try {
      const options: PageListOptions = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        perPage: req.query.perPage ? parseInt(req.query.perPage as string) : 15,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        filters: {
          status: req.query.status as string,
          search: req.query.search as string,
        },
      };

      const result = await pageService.list(options);

      res.json({
        success: true,
        data: {
          pages: result.pages,
          pagination: {
            currentPage: result.page,
            lastPage: result.totalPages,
            perPage: result.perPage,
            total: result.total,
          },
        },
      } as ApiResponse);
    } catch (error) {
      console.error('List pages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list pages',
      } as ApiResponse);
    }
  }
);

// GET /api/v1/pages/:id - Get single page
router.get('/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.edit'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const locale = req.query.locale as string || 'en';

      const page = await pageService.findById(id, locale);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { page },
      } as ApiResponse);
    } catch (error) {
      console.error('Get page error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get page',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/pages - Create page
router.post('/',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.create'),
  createPageValidation,
  async (req, res) => {
    try {
      const data: PageCreateData = {
        ...req.body,
        userId: req.user!.userId,
      };

      const locale = req.body.locale || 'en';
      const page = await pageService.create(data, locale);

      // Audit log
      await auditService.logCreate(
        req.user!.userId,
        'pages',
        page.id,
        page.name
      );

      res.status(201).json({
        success: true,
        data: { page },
        message: 'Page created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create page error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create page',
      } as ApiResponse);
    }
  }
);

// PUT /api/v1/pages/:id - Update page
router.put('/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.edit'),
  updatePageValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data: PageUpdateData = req.body;
      const locale = req.body.locale || 'en';

      const page = await pageService.update(id, data, locale);

      // Audit log
      await auditService.logUpdate(
        req.user!.userId,
        'pages',
        page.id,
        page.name
      );

      res.json({
        success: true,
        data: { page },
        message: 'Page updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Update page error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update page',
      } as ApiResponse);
    }
  }
);

// DELETE /api/v1/pages/:id - Delete page
router.delete('/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.delete'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await pageService.findById(id);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found',
        } as ApiResponse);
      }

      await pageService.delete(id);

      // Audit log
      await auditService.logDelete(
        req.user!.userId,
        'pages',
        id,
        page.name
      );

      res.json({
        success: true,
        message: 'Page deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Delete page error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete page',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/pages/:id/publish - Publish page
router.post('/:id/publish',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.publish'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await pageService.publish(id);

      // Audit log
      await auditService.logPublish(
        req.user!.userId,
        'pages',
        page.id,
        page.name
      );

      res.json({
        success: true,
        data: { page },
        message: 'Page published successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Publish page error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish page',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/pages/:id/unpublish - Unpublish page
router.post('/:id/unpublish',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.publish'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await pageService.unpublish(id);

      res.json({
        success: true,
        data: { page },
        message: 'Page unpublished successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Unpublish page error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unpublish page',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/pages/:id/translations - Create translation
router.post('/:id/translations',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.edit'),
  param('id').isInt(),
  body('locale').isLength({ min: 2, max: 20 }),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { locale } = req.body;

      const translation = await pageService.createTranslation(id, locale);

      res.status(201).json({
        success: true,
        data: { translation },
        message: 'Translation created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create translation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create translation',
      } as ApiResponse);
    }
  }
);

// GET /api/v1/pages/:id/translations - Get translations
router.get('/:id/translations',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('pages.edit'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const translations = await pageService.getTranslations(id);

      res.json({
        success: true,
        data: { translations },
      } as ApiResponse);
    } catch (error) {
      console.error('Get translations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get translations',
      } as ApiResponse);
    }
  }
);

export default router;
