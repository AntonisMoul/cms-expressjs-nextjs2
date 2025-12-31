"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const crypto_1 = require("crypto");
const types_1 = require("../models/types");
const core_1 = require("@cms/core");
class PostService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, locale = 'en') {
        const { categoryIds, tagIds, meta, ...postData } = data;
        // Generate translation group ID if not provided
        const translationGroupId = postData.translationGroupId || (0, crypto_1.randomUUID)();
        // Create the post
        const post = await this.prisma.post.create({
            data: {
                ...postData,
                translationGroupId,
            },
            include: {
                author: true,
                categories: { include: { category: true } },
                tags: { include: { tag: true } },
                translations: true,
                meta: true,
            },
        });
        // Create translation for the current locale
        if (locale !== 'en') {
            await this.prisma.postTranslation.create({
                data: {
                    langCode: locale,
                    postsId: post.id,
                    name: postData.name,
                    description: postData.description,
                    content: postData.content,
                },
            });
        }
        // Assign categories
        if (categoryIds && categoryIds.length > 0) {
            await this.assignCategoriesToPost(post.id, categoryIds);
        }
        // Assign tags
        if (tagIds && tagIds.length > 0) {
            await this.assignTagsToPost(post.id, tagIds);
        }
        // Create meta data if provided
        if (meta) {
            await this.createMeta(post.id, meta);
        }
        // Generate slug with 'blog' prefix
        await this.generateSlug(post.id, post.name, locale);
        return post;
    }
    async update(id, data, locale = 'en') {
        const { categoryIds, tagIds, meta, ...postData } = data;
        // Update the post
        const post = await this.prisma.post.update({
            where: { id },
            data: postData,
            include: {
                author: true,
                categories: { include: { category: true } },
                tags: { include: { tag: true } },
                translations: true,
                meta: true,
            },
        });
        // Update or create translation
        await this.prisma.postTranslation.upsert({
            where: {
                langCode_postsId: {
                    langCode: locale,
                    postsId: id,
                },
            },
            update: {
                name: postData.name,
                description: postData.description,
                content: postData.content,
            },
            create: {
                langCode: locale,
                postsId: id,
                name: postData.name,
                description: postData.description,
                content: postData.content,
            },
        });
        // Update categories if provided
        if (categoryIds !== undefined) {
            await this.updatePostCategories(id, categoryIds);
        }
        // Update tags if provided
        if (tagIds !== undefined) {
            await this.updatePostTags(id, tagIds);
        }
        // Update meta data if provided
        if (meta) {
            await this.updateMeta(id, meta);
        }
        // Update slug if name changed
        if (postData.name) {
            await this.updateSlug(id, postData.name, locale);
        }
        return post;
    }
    async delete(id) {
        // Delete meta data
        await this.prisma.postMeta.deleteMany({
            where: { postId: id },
        });
        // Delete translations
        await this.prisma.postTranslation.deleteMany({
            where: { postsId: id },
        });
        // Delete category and tag associations
        await this.prisma.postCategory.deleteMany({
            where: { postId: id },
        });
        await this.prisma.postTag.deleteMany({
            where: { postId: id },
        });
        // Delete the post
        await this.prisma.post.delete({
            where: { id },
        });
    }
    async findById(id, locale) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                author: true,
                categories: { include: { category: true } },
                tags: { include: { tag: true } },
                translations: locale ? {
                    where: { langCode: locale },
                } : true,
                meta: true,
            },
        });
        if (!post)
            return null;
        // If we have a translation for the requested locale, merge it
        if (locale && post.translations.length > 0) {
            const translation = post.translations[0];
            return {
                ...post,
                name: translation.name || post.name,
                description: translation.description || post.description,
                content: translation.content || post.content,
                categories: post.categories.map(pc => pc.category),
                tags: post.tags.map(pt => pt.tag),
            };
        }
        return {
            ...post,
            categories: post.categories.map(pc => pc.category),
            tags: post.tags.map(pt => pt.tag),
        };
    }
    async findBySlug(slug, locale = 'en') {
        // Find slug record with 'blog' prefix
        const slugRecord = await this.prisma.slug.findFirst({
            where: {
                key: slug,
                referenceType: 'Post',
                prefix: 'blog',
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
        if (filters.authorId) {
            where.authorId = filters.authorId;
        }
        if (filters.isFeatured !== undefined) {
            where.isFeatured = filters.isFeatured;
        }
        if (filters.categoryId) {
            where.categories = {
                some: {
                    categoryId: filters.categoryId,
                },
            };
        }
        if (filters.tagId) {
            where.tags = {
                some: {
                    tagId: filters.tagId,
                },
            };
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
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                include: {
                    author: true,
                    categories: { include: { category: true } },
                    tags: { include: { tag: true } },
                    translations: true,
                    meta: true,
                },
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.post.count({ where }),
        ]);
        // Transform posts to match the interface
        const transformedPosts = posts.map(post => ({
            ...post,
            categories: post.categories.map(pc => pc.category),
            tags: post.tags.map(pt => pt.tag),
        }));
        return {
            posts: transformedPosts,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }
    async publish(id) {
        return this.prisma.post.update({
            where: { id },
            data: { status: types_1.POST_STATUSES.PUBLISHED },
            include: {
                author: true,
                categories: { include: { category: true } },
                tags: { include: { tag: true } },
                translations: true,
                meta: true,
            },
        });
    }
    async unpublish(id) {
        return this.prisma.post.update({
            where: { id },
            data: { status: types_1.POST_STATUSES.DRAFT },
            include: {
                author: true,
                categories: { include: { category: true } },
                tags: { include: { tag: true } },
                translations: true,
                meta: true,
            },
        });
    }
    async assignCategoriesToPost(postId, categoryIds) {
        const data = categoryIds.map(categoryId => ({
            postId,
            categoryId,
        }));
        await this.prisma.postCategory.createMany({
            data,
        });
    }
    async assignTagsToPost(postId, tagIds) {
        const data = tagIds.map(tagId => ({
            postId,
            tagId,
        }));
        await this.prisma.postTag.createMany({
            data,
        });
    }
    async updatePostCategories(postId, categoryIds) {
        // Remove existing categories
        await this.prisma.postCategory.deleteMany({
            where: { postId },
        });
        // Add new categories
        if (categoryIds.length > 0) {
            await this.assignCategoriesToPost(postId, categoryIds);
        }
    }
    async updatePostTags(postId, tagIds) {
        // Remove existing tags
        await this.prisma.postTag.deleteMany({
            where: { postId },
        });
        // Add new tags
        if (tagIds.length > 0) {
            await this.assignTagsToPost(postId, tagIds);
        }
    }
    async createMeta(postId, meta) {
        const metaEntries = Object.entries(meta).map(([key, value]) => ({
            key,
            value: typeof value === 'string' ? value : JSON.stringify(value),
            postId,
        }));
        await this.prisma.postMeta.createMany({
            data: metaEntries,
        });
    }
    async updateMeta(postId, meta) {
        // Delete existing meta
        await this.prisma.postMeta.deleteMany({
            where: { postId },
        });
        // Create new meta
        await this.createMeta(postId, meta);
    }
    async generateSlug(postId, name, locale) {
        const slug = core_1.SlugService.transliterate(name);
        await core_1.SlugService.create({
            entityType: 'Post',
            entityId: postId,
            locale,
            key: slug,
            prefix: 'blog',
        });
    }
    async updateSlug(postId, name, locale) {
        const slug = core_1.SlugService.transliterate(name);
        await core_1.SlugService.update('Post', postId, locale, slug, 'blog');
    }
}
exports.PostService = PostService;
