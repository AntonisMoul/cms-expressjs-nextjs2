"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTagRoutes = registerTagRoutes;
const zod_1 = require("zod");
const core_1 = require("@cms/core");
const utils_1 = require("@cms/shared/utils");
const createTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120),
    description: zod_1.z.string().max(400).optional(),
    status: zod_1.z.enum(['published', 'draft']).default('published'),
    slug: zod_1.z.string().optional(),
    locale: zod_1.z.string().optional(),
    translationGroupId: zod_1.z.string().optional(),
});
function registerTagRoutes(router, ctx, requireAuth, requirePermission) {
    const db = ctx.db;
    const slugService = new core_1.SlugService(db);
    const auditService = ctx.audit;
    // List tags
    router.get('/blog/tags', requireAuth, requirePermission('blog.tags.index'), async (req, res) => {
        try {
            const { page = '1', perPage = '20', search, status } = req.query;
            const pageNum = parseInt(page);
            const perPageNum = parseInt(perPage);
            const skip = (pageNum - 1) * perPageNum;
            const where = {};
            if (search) {
                where.name = { contains: search };
            }
            if (status) {
                where.status = status;
            }
            const [tags, total] = await Promise.all([
                db.tag.findMany({
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Get tag by ID
    router.get('/blog/tags/:id', requireAuth, requirePermission('blog.tags.index'), async (req, res) => {
        try {
            const tag = await db.tag.findUnique({
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Create tag
    router.post('/blog/tags', requireAuth, requirePermission('blog.tags.create'), async (req, res) => {
        try {
            const data = createTagSchema.parse(req.body);
            const userId = req.user.id;
            const translationGroupId = data.translationGroupId || (0, utils_1.generateUuid)();
            // Generate slug if not provided
            let slug = data.slug;
            if (!slug) {
                slug = await slugService.generate(data.name, 'Tag', {
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
    // Update tag
    router.put('/blog/tags/:id', requireAuth, requirePermission('blog.tags.edit'), async (req, res) => {
        try {
            const tagId = parseInt(req.params.id);
            const data = createTagSchema.partial().parse(req.body);
            const userId = req.user.id;
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
    // Delete tag
    router.delete('/blog/tags/:id', requireAuth, requirePermission('blog.tags.delete'), async (req, res) => {
        try {
            const tagId = parseInt(req.params.id);
            const userId = req.user.id;
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
}
//# sourceMappingURL=tags.js.map