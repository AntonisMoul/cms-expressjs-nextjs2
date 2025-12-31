"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_2.PrismaClient();
const pageService = new core_1.PageService(prisma);
const auditService = new core_1.AuditService(prisma);
const authMiddleware = new core_1.AuthMiddleware(prisma);
// Validation rules
const createPageValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('status').optional().isIn(['published', 'draft', 'pending']),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('image').optional().isString(),
    (0, express_validator_1.body)('template').optional().isString(),
];
const updatePageValidation = [
    (0, express_validator_1.param)('id').isInt(),
    (0, express_validator_1.body)('name').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('status').optional().isIn(['published', 'draft', 'pending']),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('image').optional().isString(),
    (0, express_validator_1.body)('template').optional().isString(),
];
const listPagesValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('perPage').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('status').optional().isIn(['published', 'draft', 'pending']),
    (0, express_validator_1.query)('search').optional().isString(),
    (0, express_validator_1.query)('sortBy').optional().isString(),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']),
];
// Routes
// GET /api/v1/pages - List pages
router.get('/', authMiddleware.authenticate, authMiddleware.requirePermission('pages.index'), listPagesValidation, async (req, res) => {
    try {
        const options = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            perPage: req.query.perPage ? parseInt(req.query.perPage) : 15,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
            filters: {
                status: req.query.status,
                search: req.query.search,
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
        });
    }
    catch (error) {
        console.error('List pages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list pages',
        });
    }
});
// GET /api/v1/pages/:id - Get single page
router.get('/:id', authMiddleware.authenticate, authMiddleware.requirePermission('pages.edit'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const locale = req.query.locale || 'en';
        const page = await pageService.findById(id, locale);
        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found',
            });
        }
        res.json({
            success: true,
            data: { page },
        });
    }
    catch (error) {
        console.error('Get page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get page',
        });
    }
});
// POST /api/v1/pages - Create page
router.post('/', authMiddleware.authenticate, authMiddleware.requirePermission('pages.create'), createPageValidation, async (req, res) => {
    try {
        const data = {
            ...req.body,
            userId: req.user.userId,
        };
        const locale = req.body.locale || 'en';
        const page = await pageService.create(data, locale);
        // Audit log
        await auditService.logCreate(req.user.userId, 'pages', page.id, page.name);
        res.status(201).json({
            success: true,
            data: { page },
            message: 'Page created successfully',
        });
    }
    catch (error) {
        console.error('Create page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create page',
        });
    }
});
// PUT /api/v1/pages/:id - Update page
router.put('/:id', authMiddleware.authenticate, authMiddleware.requirePermission('pages.edit'), updatePageValidation, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const locale = req.body.locale || 'en';
        const page = await pageService.update(id, data, locale);
        // Audit log
        await auditService.logUpdate(req.user.userId, 'pages', page.id, page.name);
        res.json({
            success: true,
            data: { page },
            message: 'Page updated successfully',
        });
    }
    catch (error) {
        console.error('Update page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update page',
        });
    }
});
// DELETE /api/v1/pages/:id - Delete page
router.delete('/:id', authMiddleware.authenticate, authMiddleware.requirePermission('pages.delete'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const page = await pageService.findById(id);
        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found',
            });
        }
        await pageService.delete(id);
        // Audit log
        await auditService.logDelete(req.user.userId, 'pages', id, page.name);
        res.json({
            success: true,
            message: 'Page deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete page',
        });
    }
});
// POST /api/v1/pages/:id/publish - Publish page
router.post('/:id/publish', authMiddleware.authenticate, authMiddleware.requirePermission('pages.publish'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const page = await pageService.publish(id);
        // Audit log
        await auditService.logPublish(req.user.userId, 'pages', page.id, page.name);
        res.json({
            success: true,
            data: { page },
            message: 'Page published successfully',
        });
    }
    catch (error) {
        console.error('Publish page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to publish page',
        });
    }
});
// POST /api/v1/pages/:id/unpublish - Unpublish page
router.post('/:id/unpublish', authMiddleware.authenticate, authMiddleware.requirePermission('pages.publish'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const page = await pageService.unpublish(id);
        res.json({
            success: true,
            data: { page },
            message: 'Page unpublished successfully',
        });
    }
    catch (error) {
        console.error('Unpublish page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unpublish page',
        });
    }
});
// POST /api/v1/pages/:id/translations - Create translation
router.post('/:id/translations', authMiddleware.authenticate, authMiddleware.requirePermission('pages.edit'), (0, express_validator_1.param)('id').isInt(), (0, express_validator_1.body)('locale').isLength({ min: 2, max: 20 }), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { locale } = req.body;
        const translation = await pageService.createTranslation(id, locale);
        res.status(201).json({
            success: true,
            data: { translation },
            message: 'Translation created successfully',
        });
    }
    catch (error) {
        console.error('Create translation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create translation',
        });
    }
});
// GET /api/v1/pages/:id/translations - Get translations
router.get('/:id/translations', authMiddleware.authenticate, authMiddleware.requirePermission('pages.edit'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const translations = await pageService.getTranslations(id);
        res.json({
            success: true,
            data: { translations },
        });
    }
    catch (error) {
        console.error('Get translations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get translations',
        });
    }
});
exports.default = router;
