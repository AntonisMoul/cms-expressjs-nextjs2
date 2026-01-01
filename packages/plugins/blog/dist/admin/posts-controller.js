"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostsAdminController = void 0;
const client_1 = require("@prisma/client");
const service_1 = require("../service");
const core_1 = require("@cms/core");
const prisma = new client_1.PrismaClient();
const blogService = new service_1.BlogService(prisma);
const auditService = new core_1.AuditService(prisma);
const slugService = new core_1.SlugService(prisma);
class BlogPostsAdminController {
    static async index(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                search: req.query.search,
                status: req.query.status,
                author: req.query.author,
                category: req.query.category,
                tag: req.query.tag,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'desc',
            };
            const result = await blogService.getPosts(options);
            res.json({
                success: true,
                data: result.data,
                pagination: result.pagination,
            });
        }
        catch (error) {
            console.error('Blog posts index error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async create(req, res) {
        try {
            const data = req.body;
            const authorId = req.user.id;
            const post = await blogService.createPost(data, authorId);
            // Create slug for the post
            await slugService.createSlugForEntity('post', post.id, post.name, 'blog');
            // Audit log
            await auditService.logContentAction(authorId, 'blog', 'create_post', post.id, post.name, data, req.ip, req.get('User-Agent'));
            res.status(201).json({
                success: true,
                data: { post },
                message: 'Post created successfully',
            });
        }
        catch (error) {
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
    static async show(req, res) {
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
        }
        catch (error) {
            console.error('Post show error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const authorId = req.user.id;
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
            await auditService.logContentAction(authorId, 'blog', 'update_post', post.id, post.name, data, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                data: { post },
                message: 'Post updated successfully',
            });
        }
        catch (error) {
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
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const authorId = req.user.id;
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
            await auditService.logContentAction(authorId, 'blog', 'delete_post', post.id, post.name, undefined, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Post deleted successfully',
            });
        }
        catch (error) {
            console.error('Post delete error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Translation methods
    static async createTranslation(req, res) {
        try {
            const { id } = req.params;
            const { langCode, name, description, content } = req.body;
            const authorId = req.user.id;
            await blogService.createPostTranslation(id, langCode, {
                name,
                description,
                content,
            });
            const post = await blogService.getPostById(id);
            // Audit log
            await auditService.logContentAction(authorId, 'blog', 'create_post_translation', post.id, `${post.name} (${langCode})`, { langCode, name }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Translation created successfully',
            });
        }
        catch (error) {
            console.error('Create post translation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async updateTranslation(req, res) {
        try {
            const { id, langCode } = req.params;
            const { name, description, content } = req.body;
            const authorId = req.user.id;
            await blogService.updatePostTranslation(id, langCode, {
                name,
                description,
                content,
            });
            const post = await blogService.getPostById(id);
            // Audit log
            await auditService.logContentAction(authorId, 'blog', 'update_post_translation', post.id, `${post.name} (${langCode})`, { langCode, name }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Translation updated successfully',
            });
        }
        catch (error) {
            console.error('Update post translation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async deleteTranslation(req, res) {
        try {
            const { id, langCode } = req.params;
            const authorId = req.user.id;
            const post = await blogService.getPostById(id);
            await blogService.deletePostTranslation(id, langCode);
            // Audit log
            await auditService.logContentAction(authorId, 'blog', 'delete_post_translation', post.id, `${post.name} (${langCode})`, { langCode }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Translation deleted successfully',
            });
        }
        catch (error) {
            console.error('Delete post translation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.BlogPostsAdminController = BlogPostsAdminController;
//# sourceMappingURL=posts-controller.js.map