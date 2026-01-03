"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPageRoutes = registerPageRoutes;
const zod_1 = require("zod");
const core_1 = require("@cms/core");
const utils_1 = require("@cms/shared/utils");
const createPageSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120),
    content: zod_1.z.string().optional(),
    description: zod_1.z.string().max(400).optional(),
    status: zod_1.z.enum(['published', 'draft']).default('draft'),
    template: zod_1.z.string().max(60).optional(),
    image: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    locale: zod_1.z.string().optional(),
    translationGroupId: zod_1.z.string().optional(), // For creating translation
    // Meta boxes
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
    seoKeywords: zod_1.z.string().optional(),
    seoImage: zod_1.z.string().optional(),
    banner: zod_1.z.string().optional(),
    gallery: zod_1.z.array(zod_1.z.string()).optional(),
});
function registerPageRoutes(router, ctx, requireAuth, requirePermission) {
    const db = ctx.db;
    const slugService = new core_1.SlugService(db);
    const queueService = ctx.queue;
    const auditService = ctx.audit;
    // List pages
    router.get('/pages', requireAuth, requirePermission('pages.index'), async (req, res) => {
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
            const [pages, total] = await Promise.all([
                db.page.findMany({
                    where,
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: perPageNum,
                }),
                db.page.count({ where }),
            ]);
            res.json({
                success: true,
                data: {
                    pages,
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
    // Get page by ID
    router.get('/pages/:id', requireAuth, requirePermission('pages.index'), async (req, res) => {
        try {
            const page = await db.page.findUnique({
                where: { id: parseInt(req.params.id) },
                include: {
                    translations: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
            if (!page) {
                return res.status(404).json({
                    success: false,
                    error: 'Page not found',
                });
            }
            // Get meta boxes (SEO, Gallery, etc.)
            const metaBoxes = await db.metaBox.findMany({
                where: {
                    referenceType: 'Page',
                    referenceId: page.id,
                },
            });
            const meta = {};
            for (const metaBox of metaBoxes) {
                meta[metaBox.metaKey] = metaBox.metaValue;
            }
            // Get linked translations
            let linkedTranslations = [];
            if (page.translationGroupId) {
                linkedTranslations = await db.page.findMany({
                    where: {
                        translationGroupId: page.translationGroupId,
                        id: { not: page.id },
                    },
                });
            }
            res.json({
                success: true,
                data: {
                    page: {
                        ...page,
                        meta,
                        linkedTranslations,
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
    // Create page
    router.post('/pages', requireAuth, requirePermission('pages.create'), async (req, res) => {
        try {
            const data = createPageSchema.parse(req.body);
            const userId = req.user.id;
            // Generate translation group ID if not provided
            const translationGroupId = data.translationGroupId || (0, utils_1.generateUuid)();
            // Generate slug if not provided
            let slug = data.slug;
            if (!slug) {
                slug = await slugService.generate(data.name, 'Page', {
                    prefix: '',
                    locale: data.locale,
                });
            }
            else {
                // Check slug availability
                const availability = await slugService.checkAvailability(slug, '', data.locale);
                if (!availability.available) {
                    return res.status(400).json({
                        success: false,
                        error: 'Slug is already taken',
                        suggested: availability.suggested,
                    });
                }
            }
            // Create page
            const page = await db.page.create({
                data: {
                    name: data.name,
                    content: data.content,
                    description: data.description,
                    status: data.status,
                    template: data.template,
                    image: data.image,
                    userId,
                    translationGroupId,
                },
            });
            // Create slug
            await slugService.create('Page', page.id, slug, '', data.locale);
            // Create meta boxes
            const metaBoxes = [];
            if (data.seoTitle) {
                metaBoxes.push({
                    referenceType: 'Page',
                    referenceId: page.id,
                    metaKey: 'seo_title',
                    metaValue: data.seoTitle,
                });
            }
            if (data.seoDescription) {
                metaBoxes.push({
                    referenceType: 'Page',
                    referenceId: page.id,
                    metaKey: 'seo_description',
                    metaValue: data.seoDescription,
                });
            }
            if (data.seoKeywords) {
                metaBoxes.push({
                    referenceType: 'Page',
                    referenceId: page.id,
                    metaKey: 'seo_keywords',
                    metaValue: data.seoKeywords,
                });
            }
            if (data.seoImage) {
                metaBoxes.push({
                    referenceType: 'Page',
                    referenceId: page.id,
                    metaKey: 'seo_image',
                    metaValue: data.seoImage,
                });
            }
            if (data.banner) {
                metaBoxes.push({
                    referenceType: 'Page',
                    referenceId: page.id,
                    metaKey: 'banner',
                    metaValue: data.banner,
                });
            }
            if (data.gallery && data.gallery.length > 0) {
                metaBoxes.push({
                    referenceType: 'Page',
                    referenceId: page.id,
                    metaKey: 'gallery',
                    metaValue: JSON.stringify(data.gallery),
                });
            }
            if (metaBoxes.length > 0) {
                await db.metaBox.createMany({
                    data: metaBoxes,
                });
            }
            // Create translation if locale provided and different from default
            if (data.locale) {
                const defaultLocale = await ctx.i18n.getDefaultLocale();
                if (data.locale !== defaultLocale) {
                    await db.pageTranslation.create({
                        data: {
                            langCode: data.locale,
                            pagesId: page.id,
                            name: data.name,
                            description: data.description,
                            content: data.content,
                        },
                    });
                }
            }
            // Enqueue sitemap generation if published
            if (data.status === 'published') {
                await queueService.enqueue('sitemap.generate', {});
            }
            // Audit log
            await auditService.log({
                userId,
                module: 'pages',
                action: 'create',
                referenceId: BigInt(page.id),
                referenceName: page.name,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.status(201).json({
                success: true,
                data: { page },
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
    // Update page
    router.put('/pages/:id', requireAuth, requirePermission('pages.edit'), async (req, res) => {
        try {
            const pageId = parseInt(req.params.id);
            const data = createPageSchema.partial().parse(req.body);
            const userId = req.user.id;
            const existingPage = await db.page.findUnique({
                where: { id: pageId },
            });
            if (!existingPage) {
                return res.status(404).json({
                    success: false,
                    error: 'Page not found',
                });
            }
            // Check slug if changed
            if (data.slug && data.slug !== existingPage.name) {
                const slugRecord = await slugService.getByEntity('Page', pageId);
                if (slugRecord && slugRecord.key !== data.slug) {
                    const availability = await slugService.checkAvailability(data.slug, '', data.locale, slugRecord.id);
                    if (!availability.available) {
                        return res.status(400).json({
                            success: false,
                            error: 'Slug is already taken',
                            suggested: availability.suggested,
                        });
                    }
                    // Update slug
                    await slugService.update(slugRecord.id, data.slug, '', data.locale);
                }
            }
            // Update page
            const page = await db.page.update({
                where: { id: pageId },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.content !== undefined && { content: data.content }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.status && { status: data.status }),
                    ...(data.template !== undefined && { template: data.template }),
                    ...(data.image !== undefined && { image: data.image }),
                },
            });
            // Update meta boxes
            if (data.seoTitle !== undefined) {
                const existing = await db.metaBox.findFirst({
                    where: {
                        referenceType: 'Page',
                        referenceId: pageId,
                        metaKey: 'seo_title',
                    },
                });
                if (existing) {
                    await db.metaBox.update({
                        where: { id: existing.id },
                        data: { metaValue: data.seoTitle },
                    });
                }
                else {
                    await db.metaBox.create({
                        data: {
                            referenceType: 'Page',
                            referenceId: pageId,
                            metaKey: 'seo_title',
                            metaValue: data.seoTitle,
                        },
                    });
                }
            }
            // Similar for other meta boxes...
            // Enqueue sitemap generation if status changed to published
            if (data.status === 'published' && existingPage.status !== 'published') {
                await queueService.enqueue('sitemap.generate', {});
            }
            // Audit log
            await auditService.log({
                userId,
                module: 'pages',
                action: 'update',
                referenceId: BigInt(page.id),
                referenceName: page.name,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.json({
                success: true,
                data: { page },
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
    // Delete page
    router.delete('/pages/:id', requireAuth, requirePermission('pages.delete'), async (req, res) => {
        try {
            const pageId = parseInt(req.params.id);
            const userId = req.user.id;
            const page = await db.page.findUnique({
                where: { id: pageId },
            });
            if (!page) {
                return res.status(404).json({
                    success: false,
                    error: 'Page not found',
                });
            }
            await db.page.delete({
                where: { id: pageId },
            });
            // Enqueue sitemap generation
            await queueService.enqueue('sitemap.generate', {});
            // Audit log
            await auditService.log({
                userId,
                module: 'pages',
                action: 'delete',
                referenceId: BigInt(pageId),
                referenceName: page.name,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.json({
                success: true,
                message: 'Page deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Check slug availability
    router.post('/pages/slug/check', requireAuth, async (req, res) => {
        try {
            const { slug, prefix = '', locale, excludeId } = req.body;
            if (!slug) {
                return res.status(400).json({
                    success: false,
                    error: 'Slug is required',
                });
            }
            const availability = await slugService.checkAvailability(slug, prefix, locale, excludeId);
            res.json({
                success: true,
                data: availability,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Create translation
    router.post('/pages/:id/translations', requireAuth, requirePermission('pages.create'), async (req, res) => {
        try {
            const { createPageTranslation } = await Promise.resolve().then(() => __importStar(require('./routes/create-translation')));
            const sourcePageId = parseInt(req.params.id);
            const userId = req.user.id;
            const data = zod_1.z.object({
                targetLocale: zod_1.z.string(),
                name: zod_1.z.string().optional(),
                content: zod_1.z.string().optional(),
                description: zod_1.z.string().optional(),
                slug: zod_1.z.string().optional(),
            }).parse(req.body);
            const translatedPage = await createPageTranslation(db, slugService, queueService, auditService, userId, {
                sourcePageId,
                ...data,
            });
            res.status(201).json({
                success: true,
                data: { page: translatedPage },
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
//# sourceMappingURL=routes.js.map