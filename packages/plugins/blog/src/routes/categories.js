"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCategoryRoutes = registerCategoryRoutes;
const zod_1 = require("zod");
const core_1 = require("@cms/core");
const utils_1 = require("@cms/shared/utils");
const createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120),
    parentId: zod_1.z.number().default(0),
    description: zod_1.z.string().max(400).optional(),
    status: zod_1.z.enum(['published', 'draft']).default('published'),
    icon: zod_1.z.string().max(60).optional(),
    order: zod_1.z.number().default(0),
    isFeatured: zod_1.z.boolean().optional(),
    isDefault: zod_1.z.boolean().optional(),
    slug: zod_1.z.string().optional(),
    locale: zod_1.z.string().optional(),
    translationGroupId: zod_1.z.string().optional(),
});
function registerCategoryRoutes(router, ctx, requireAuth, requirePermission) {
    const db = ctx.db;
    const slugService = new core_1.SlugService(db);
    const queueService = ctx.queue;
    const auditService = ctx.audit;
    // List categories (tree structure)
    router.get('/blog/categories', requireAuth, requirePermission('blog.categories.index'), async (req, res) => {
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
            const buildTree = (parentId = 0) => {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Get category by ID
    router.get('/blog/categories/:id', requireAuth, requirePermission('blog.categories.index'), async (req, res) => {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Create category
    router.post('/blog/categories', requireAuth, requirePermission('blog.categories.create'), async (req, res) => {
        try {
            const data = createCategorySchema.parse(req.body);
            const userId = req.user.id;
            const translationGroupId = data.translationGroupId || (0, utils_1.generateUuid)();
            // Generate slug if not provided
            let slug = data.slug;
            if (!slug) {
                slug = await slugService.generate(data.name, 'Category', {
                    prefix: 'blog',
                    locale: data.locale,
                });
            }
            else {
                const availability = await slugService.checkAvailability(slug, 'blog', data.locale);
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
    });
    // Update category
    router.put('/blog/categories/:id', requireAuth, requirePermission('blog.categories.edit'), async (req, res) => {
        try {
            const categoryId = parseInt(req.params.id);
            const data = createCategorySchema.partial().parse(req.body);
            const userId = req.user.id;
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
    });
    // Update category tree (reorder)
    router.put('/blog/categories/update-tree', requireAuth, requirePermission('blog.categories.edit'), async (req, res) => {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Delete category
    router.delete('/blog/categories/:id', requireAuth, requirePermission('blog.categories.delete'), async (req, res) => {
        try {
            const categoryId = parseInt(req.params.id);
            const userId = req.user.id;
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Search categories
    router.get('/blog/categories/search', requireAuth, requirePermission('blog.categories.index'), async (req, res) => {
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
                    name: { contains: q },
                    status: 'published',
                },
                take: 20,
                orderBy: { name: 'asc' },
            });
            res.json({
                success: true,
                data: { categories },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
}
//# sourceMappingURL=categories.js.map