"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageService = void 0;
const crypto_1 = require("crypto");
const types_1 = require("../models/types");
const core_1 = require("@cms/core");
class PageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, locale = 'en') {
        const { meta, ...pageData } = data;
        // Generate translation group ID if not provided
        const translationGroupId = pageData.translationGroupId || (0, crypto_1.randomUUID)();
        // Create the page
        const page = await this.prisma.page.create({
            data: {
                ...pageData,
                translationGroupId,
            },
            include: {
                user: true,
                translations: true,
                meta: true,
            },
        });
        // Create translation for the current locale
        if (locale !== 'en') {
            await this.prisma.pageTranslation.create({
                data: {
                    langCode: locale,
                    pagesId: page.id,
                    name: pageData.name,
                    description: pageData.description,
                    content: pageData.content,
                },
            });
        }
        // Create meta data if provided
        if (meta) {
            await this.createMeta(page.id, meta);
        }
        // Generate slug
        await this.generateSlug(page.id, page.name, locale);
        return page;
    }
    async update(id, data, locale = 'en') {
        const { meta, ...pageData } = data;
        // Update the page
        const page = await this.prisma.page.update({
            where: { id },
            data: pageData,
            include: {
                user: true,
                translations: true,
                meta: true,
            },
        });
        // Update or create translation
        await this.prisma.pageTranslation.upsert({
            where: {
                langCode_pagesId: {
                    langCode: locale,
                    pagesId: id,
                },
            },
            update: {
                name: pageData.name,
                description: pageData.description,
                content: pageData.content,
            },
            create: {
                langCode: locale,
                pagesId: id,
                name: pageData.name,
                description: pageData.description,
                content: pageData.content,
            },
        });
        // Update meta data if provided
        if (meta) {
            await this.updateMeta(id, meta);
        }
        // Update slug if name changed
        if (pageData.name) {
            await this.updateSlug(id, pageData.name, locale);
        }
        return page;
    }
    async delete(id) {
        // Delete meta data
        await this.prisma.pageMeta.deleteMany({
            where: { pageId: id },
        });
        // Delete translations
        await this.prisma.pageTranslation.deleteMany({
            where: { pagesId: id },
        });
        // Delete the page
        await this.prisma.page.delete({
            where: { id },
        });
    }
    async findById(id, locale) {
        const page = await this.prisma.page.findUnique({
            where: { id },
            include: {
                user: true,
                translations: locale ? {
                    where: { langCode: locale },
                } : true,
                meta: true,
            },
        });
        if (!page)
            return null;
        // If we have a translation for the requested locale, merge it
        if (locale && page.translations.length > 0) {
            const translation = page.translations[0];
            return {
                ...page,
                name: translation.name || page.name,
                description: translation.description || page.description,
                content: translation.content || page.content,
            };
        }
        return page;
    }
    async findBySlug(slug, locale = 'en') {
        // Find slug record
        const slugRecord = await this.prisma.slug.findFirst({
            where: {
                key: slug,
                referenceType: 'Page',
                prefix: null, // Pages don't use prefix
                isActive: true,
            },
        });
        if (!slugRecord)
            return null;
        return this.findById(slugRecord.referenceId, locale);
    }
    async list(options = {}) {
        const { page = 1, perPage = 15, sortBy = 'createdAt', sortOrder = 'desc', filters = {}, } = options;
        const where = {};
        // Apply filters
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.userId) {
            where.userId = filters.userId;
        }
        if (filters.isFeatured !== undefined) {
            where.isFeatured = filters.isFeatured;
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } },
                { content: { contains: filters.search } },
            ];
        }
        if (filters.translationGroupId) {
            where.translationGroupId = filters.translationGroupId;
        }
        const [pages, total] = await Promise.all([
            this.prisma.page.findMany({
                where,
                include: {
                    user: true,
                    translations: true,
                    meta: true,
                },
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.page.count({ where }),
        ]);
        return {
            pages,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }
    async publish(id) {
        return this.prisma.page.update({
            where: { id },
            data: { status: types_1.PAGE_STATUSES.PUBLISHED },
            include: {
                user: true,
                translations: true,
                meta: true,
            },
        });
    }
    async unpublish(id) {
        return this.prisma.page.update({
            where: { id },
            data: { status: types_1.PAGE_STATUSES.DRAFT },
            include: {
                user: true,
                translations: true,
                meta: true,
            },
        });
    }
    async createTranslation(sourcePageId, targetLocale) {
        const sourcePage = await this.findById(sourcePageId);
        if (!sourcePage) {
            throw new Error('Source page not found');
        }
        return this.prisma.pageTranslation.create({
            data: {
                langCode: targetLocale,
                pagesId: sourcePageId,
                name: sourcePage.name,
                description: sourcePage.description,
                content: sourcePage.content,
            },
        });
    }
    async getTranslations(pageId) {
        return this.prisma.pageTranslation.findMany({
            where: { pagesId: pageId },
        });
    }
    async createMeta(pageId, meta) {
        const metaEntries = Object.entries(meta).map(([key, value]) => ({
            key,
            value: typeof value === 'string' ? value : JSON.stringify(value),
            pageId,
        }));
        await this.prisma.pageMeta.createMany({
            data: metaEntries,
        });
    }
    async updateMeta(pageId, meta) {
        // Delete existing meta
        await this.prisma.pageMeta.deleteMany({
            where: { pageId },
        });
        // Create new meta
        await this.createMeta(pageId, meta);
    }
    async generateSlug(pageId, name, locale) {
        const slug = core_1.SlugService.transliterate(name);
        await core_1.SlugService.create({
            entityType: 'Page',
            entityId: pageId,
            locale,
            key: slug,
        });
    }
    async updateSlug(pageId, name, locale) {
        const slug = core_1.SlugService.transliterate(name);
        await core_1.SlugService.update('Page', pageId, locale, slug);
    }
}
exports.PageService = PageService;
