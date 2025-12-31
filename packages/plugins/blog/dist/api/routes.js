"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_2.PrismaClient();
const postService = new core_1.PostService(prisma);
const categoryService = new core_1.CategoryService(prisma);
const tagService = new core_1.TagService(prisma);
const auditService = new core_1.AuditService(prisma);
const authMiddleware = new core_1.AuthMiddleware(prisma);
// Validation rules
const createPostValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('status').optional().isIn(['published', 'draft', 'pending']),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('image').optional().isString(),
    (0, express_validator_1.body)('formatType').optional().isString(),
    (0, express_validator_1.body)('categoryIds').optional().isArray(),
    (0, express_validator_1.body)('tagIds').optional().isArray(),
];
const updatePostValidation = [
    (0, express_validator_1.param)('id').isInt(),
    (0, express_validator_1.body)('name').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('status').optional().isIn(['published', 'draft', 'pending']),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('image').optional().isString(),
    (0, express_validator_1.body)('formatType').optional().isString(),
    (0, express_validator_1.body)('categoryIds').optional().isArray(),
    (0, express_validator_1.body)('tagIds').optional().isArray(),
];
const listPostsValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('perPage').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('status').optional().isIn(['published', 'draft', 'pending']),
    (0, express_validator_1.query)('categoryId').optional().isInt(),
    (0, express_validator_1.query)('tagId').optional().isInt(),
    (0, express_validator_1.query)('search').optional().isString(),
    (0, express_validator_1.query)('sortBy').optional().isString(),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']),
];
const createCategoryValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('parentId').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('status').optional().isIn(['published', 'draft']),
    (0, express_validator_1.body)('icon').optional().isString(),
    (0, express_validator_1.body)('order').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('isDefault').optional().isBoolean(),
];
const updateCategoryValidation = [
    (0, express_validator_1.param)('id').isInt(),
    (0, express_validator_1.body)('name').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('parentId').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('status').optional().isIn(['published', 'draft']),
    (0, express_validator_1.body)('icon').optional().isString(),
    (0, express_validator_1.body)('order').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('isDefault').optional().isBoolean(),
];
const createTagValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('status').optional().isIn(['published', 'draft']),
];
// ==================== POSTS ROUTES ====================
// GET /api/v1/blog/posts - List posts
router.get('/posts', authMiddleware.authenticate, authMiddleware.requirePermission('posts.index'), listPostsValidation, async (req, res) => {
    try {
        const options = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            perPage: req.query.perPage ? parseInt(req.query.perPage) : 15,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
            filters: {
                status: req.query.status,
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : undefined,
                tagId: req.query.tagId ? parseInt(req.query.tagId) : undefined,
                search: req.query.search,
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
        });
    }
    catch (error) {
        console.error('List posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list posts',
        });
    }
});
// GET /api/v1/blog/posts/:id - Get single post
router.get('/posts/:id', authMiddleware.authenticate, authMiddleware.requirePermission('posts.edit'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const locale = req.query.locale || 'en';
        const post = await postService.findById(id, locale);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }
        res.json({
            success: true,
            data: { post },
        });
    }
    catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get post',
        });
    }
});
// POST /api/v1/blog/posts - Create post
router.post('/posts', authMiddleware.authenticate, authMiddleware.requirePermission('posts.create'), createPostValidation, async (req, res) => {
    try {
        const data = {
            ...req.body,
            authorId: req.user.userId,
        };
        const locale = req.body.locale || 'en';
        const post = await postService.create(data, locale);
        // Audit log
        await auditService.logCreate(req.user.userId, 'posts', post.id, post.name);
        res.status(201).json({
            success: true,
            data: { post },
            message: 'Post created successfully',
        });
    }
    catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post',
        });
    }
});
// PUT /api/v1/blog/posts/:id - Update post
router.put('/posts/:id', authMiddleware.authenticate, authMiddleware.requirePermission('posts.edit'), updatePostValidation, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const locale = req.body.locale || 'en';
        const post = await postService.update(id, data, locale);
        // Audit log
        await auditService.logUpdate(req.user.userId, 'posts', post.id, post.name);
        res.json({
            success: true,
            data: { post },
            message: 'Post updated successfully',
        });
    }
    catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update post',
        });
    }
});
// DELETE /api/v1/blog/posts/:id - Delete post
router.delete('/posts/:id', authMiddleware.authenticate, authMiddleware.requirePermission('posts.delete'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const post = await postService.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }
        await postService.delete(id);
        // Audit log
        await auditService.logDelete(req.user.userId, 'posts', id, post.name);
        res.json({
            success: true,
            message: 'Post deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete post',
        });
    }
});
// POST /api/v1/blog/posts/:id/publish - Publish post
router.post('/posts/:id/publish', authMiddleware.authenticate, authMiddleware.requirePermission('posts.publish'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const post = await postService.publish(id);
        // Audit log
        await auditService.logPublish(req.user.userId, 'posts', post.id, post.name);
        res.json({
            success: true,
            data: { post },
            message: 'Post published successfully',
        });
    }
    catch (error) {
        console.error('Publish post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to publish post',
        });
    }
});
// POST /api/v1/blog/posts/:id/unpublish - Unpublish post
router.post('/posts/:id/unpublish', authMiddleware.authenticate, authMiddleware.requirePermission('posts.publish'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const post = await postService.unpublish(id);
        res.json({
            success: true,
            data: { post },
            message: 'Post unpublished successfully',
        });
    }
    catch (error) {
        console.error('Unpublish post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unpublish post',
        });
    }
});
// ==================== CATEGORIES ROUTES ====================
// GET /api/v1/blog/categories - List categories
router.get('/categories', authMiddleware.authenticate, authMiddleware.requirePermission('categories.index'), async (req, res) => {
    try {
        const options = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            perPage: req.query.perPage ? parseInt(req.query.perPage) : 15,
            sortBy: req.query.sortBy || 'order',
            sortOrder: req.query.sortOrder || 'asc',
            filters: {
                status: req.query.status,
                search: req.query.search,
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
        });
    }
    catch (error) {
        console.error('List categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list categories',
        });
    }
});
// GET /api/v1/blog/categories/tree - Get category tree
router.get('/categories/tree', authMiddleware.authenticate, authMiddleware.requirePermission('categories.index'), async (req, res) => {
    try {
        const tree = await categoryService.getTree();
        res.json({
            success: true,
            data: { categories: tree },
        });
    }
    catch (error) {
        console.error('Get category tree error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get category tree',
        });
    }
});
// POST /api/v1/blog/categories - Create category
router.post('/categories', authMiddleware.authenticate, authMiddleware.requirePermission('categories.create'), createCategoryValidation, async (req, res) => {
    try {
        const data = {
            ...req.body,
            authorId: req.user.userId,
        };
        const category = await categoryService.create(data);
        res.status(201).json({
            success: true,
            data: { category },
            message: 'Category created successfully',
        });
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
        });
    }
});
// PUT /api/v1/blog/categories/tree - Update category tree
router.put('/categories/tree', authMiddleware.authenticate, authMiddleware.requirePermission('categories.edit'), async (req, res) => {
    try {
        const updates = req.body.updates || [];
        await categoryService.updateTree(updates);
        res.json({
            success: true,
            message: 'Category tree updated successfully',
        });
    }
    catch (error) {
        console.error('Update category tree error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category tree',
        });
    }
});
// ==================== TAGS ROUTES ====================
// GET /api/v1/blog/tags - List tags
router.get('/tags', authMiddleware.authenticate, authMiddleware.requirePermission('tags.index'), async (req, res) => {
    try {
        const options = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            perPage: req.query.perPage ? parseInt(req.query.perPage) : 15,
            sortBy: req.query.sortBy || 'name',
            sortOrder: req.query.sortOrder || 'asc',
            filters: {
                status: req.query.status,
                search: req.query.search,
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
        });
    }
    catch (error) {
        console.error('List tags error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list tags',
        });
    }
});
// GET /api/v1/blog/tags/all - Get all tags
router.get('/tags/all', authMiddleware.authenticate, authMiddleware.requirePermission('tags.index'), async (req, res) => {
    try {
        const tags = await tagService.getAll();
        res.json({
            success: true,
            data: { tags },
        });
    }
    catch (error) {
        console.error('Get all tags error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get tags',
        });
    }
});
// POST /api/v1/blog/tags - Create tag
router.post('/tags', authMiddleware.authenticate, authMiddleware.requirePermission('tags.create'), createTagValidation, async (req, res) => {
    try {
        const data = {
            ...req.body,
            authorId: req.user.userId,
        };
        const tag = await tagService.create(data);
        res.status(201).json({
            success: true,
            data: { tag },
            message: 'Tag created successfully',
        });
    }
    catch (error) {
        console.error('Create tag error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create tag',
        });
    }
});
// GET /api/v1/blog/tags/search - Search tags
router.get('/tags/search', authMiddleware.authenticate, authMiddleware.requirePermission('tags.index'), (0, express_validator_1.query)('q').isLength({ min: 1 }), async (req, res) => {
    try {
        const query = req.query.q;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const tags = await tagService.search(query, limit);
        res.json({
            success: true,
            data: { tags },
        });
    }
    catch (error) {
        console.error('Search tags error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search tags',
        });
    }
});
exports.default = router;
