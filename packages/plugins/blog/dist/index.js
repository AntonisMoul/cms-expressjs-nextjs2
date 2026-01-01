"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPublicController = exports.BlogTagsAdminController = exports.BlogCategoriesAdminController = exports.BlogPostsAdminController = exports.BlogService = exports.blogPlugin = void 0;
const express_1 = require("express");
const posts_controller_1 = require("./admin/posts-controller");
const categories_controller_1 = require("./admin/categories-controller");
const tags_controller_1 = require("./admin/tags-controller");
const controller_1 = require("./public/controller");
const plugin = {
    name: 'blog',
    version: '1.0.0',
    registerApiRoutes(router, ctx) {
        // Admin routes
        const adminRouter = (0, express_1.Router)();
        // Posts routes
        adminRouter.get('/posts', posts_controller_1.BlogPostsAdminController.index);
        adminRouter.post('/posts', posts_controller_1.BlogPostsAdminController.create);
        adminRouter.get('/posts/:id', posts_controller_1.BlogPostsAdminController.show);
        adminRouter.put('/posts/:id', posts_controller_1.BlogPostsAdminController.update);
        adminRouter.delete('/posts/:id', posts_controller_1.BlogPostsAdminController.delete);
        // Post translation routes
        adminRouter.post('/posts/:id/translations', posts_controller_1.BlogPostsAdminController.createTranslation);
        adminRouter.put('/posts/:id/translations/:langCode', posts_controller_1.BlogPostsAdminController.updateTranslation);
        adminRouter.delete('/posts/:id/translations/:langCode', posts_controller_1.BlogPostsAdminController.deleteTranslation);
        // Categories routes
        adminRouter.get('/categories', categories_controller_1.BlogCategoriesAdminController.index);
        adminRouter.post('/categories', categories_controller_1.BlogCategoriesAdminController.create);
        adminRouter.get('/categories/:id', categories_controller_1.BlogCategoriesAdminController.show);
        adminRouter.put('/categories/:id', categories_controller_1.BlogCategoriesAdminController.update);
        adminRouter.delete('/categories/:id', categories_controller_1.BlogCategoriesAdminController.delete);
        // Category translation routes
        adminRouter.post('/categories/:id/translations', categories_controller_1.BlogCategoriesAdminController.createTranslation);
        adminRouter.put('/categories/:id/translations/:langCode', categories_controller_1.BlogCategoriesAdminController.updateTranslation);
        adminRouter.delete('/categories/:id/translations/:langCode', categories_controller_1.BlogCategoriesAdminController.deleteTranslation);
        // Tags routes
        adminRouter.get('/tags', tags_controller_1.BlogTagsAdminController.index);
        adminRouter.post('/tags', tags_controller_1.BlogTagsAdminController.create);
        adminRouter.get('/tags/:id', tags_controller_1.BlogTagsAdminController.show);
        adminRouter.put('/tags/:id', tags_controller_1.BlogTagsAdminController.update);
        adminRouter.delete('/tags/:id', tags_controller_1.BlogTagsAdminController.delete);
        // Tag translation routes
        adminRouter.post('/tags/:id/translations', tags_controller_1.BlogTagsAdminController.createTranslation);
        adminRouter.put('/tags/:id/translations/:langCode', tags_controller_1.BlogTagsAdminController.updateTranslation);
        adminRouter.delete('/tags/:id/translations/:langCode', tags_controller_1.BlogTagsAdminController.deleteTranslation);
        // Mount admin routes
        router.use('/blog', adminRouter);
        // Public routes
        const publicRouter = (0, express_1.Router)();
        publicRouter.get('/posts', controller_1.BlogPublicController.getPosts);
        publicRouter.get('/posts/featured', controller_1.BlogPublicController.getFeaturedPosts);
        publicRouter.get('/posts/category/:categoryId', controller_1.BlogPublicController.getPostsByCategory);
        publicRouter.get('/posts/tag/:tagId', controller_1.BlogPublicController.getPostsByTag);
        publicRouter.get('/posts/:slug', controller_1.BlogPublicController.getPost);
        publicRouter.get('/categories', controller_1.BlogPublicController.getCategories);
        publicRouter.get('/tags', controller_1.BlogPublicController.getTags);
        // Mount public routes
        router.use('/public/blog', publicRouter);
    },
    getAdminNavigation() {
        return [
            {
                id: 'blog',
                label: 'Blog',
                icon: 'ti ti-article',
                priority: 3,
                children: [
                    {
                        id: 'blog-posts',
                        label: 'Posts',
                        icon: 'ti ti-file-text',
                        href: '/admin/blog/posts',
                        parentId: 'blog',
                        priority: 10,
                        permissions: ['blog.posts.index'],
                    },
                    {
                        id: 'blog-categories',
                        label: 'Categories',
                        icon: 'ti ti-folder',
                        href: '/admin/blog/categories',
                        parentId: 'blog',
                        priority: 20,
                        permissions: ['blog.categories.index'],
                    },
                    {
                        id: 'blog-tags',
                        label: 'Tags',
                        icon: 'ti ti-tag',
                        href: '/admin/blog/tags',
                        parentId: 'blog',
                        priority: 30,
                        permissions: ['blog.tags.index'],
                    },
                ],
            },
        ];
    },
    permissions: [
        // Posts permissions
        { key: 'blog.posts.index', name: 'View Posts', module: 'blog' },
        { key: 'blog.posts.create', name: 'Create Posts', module: 'blog' },
        { key: 'blog.posts.edit', name: 'Edit Posts', module: 'blog' },
        { key: 'blog.posts.delete', name: 'Delete Posts', module: 'blog' },
        // Categories permissions
        { key: 'blog.categories.index', name: 'View Categories', module: 'blog' },
        { key: 'blog.categories.create', name: 'Create Categories', module: 'blog' },
        { key: 'blog.categories.edit', name: 'Edit Categories', module: 'blog' },
        { key: 'blog.categories.delete', name: 'Delete Categories', module: 'blog' },
        // Tags permissions
        { key: 'blog.tags.index', name: 'View Tags', module: 'blog' },
        { key: 'blog.tags.create', name: 'Create Tags', module: 'blog' },
        { key: 'blog.tags.edit', name: 'Edit Tags', module: 'blog' },
        { key: 'blog.tags.delete', name: 'Delete Tags', module: 'blog' },
    ],
};
exports.blogPlugin = plugin;
var service_1 = require("./service");
Object.defineProperty(exports, "BlogService", { enumerable: true, get: function () { return service_1.BlogService; } });
var posts_controller_2 = require("./admin/posts-controller");
Object.defineProperty(exports, "BlogPostsAdminController", { enumerable: true, get: function () { return posts_controller_2.BlogPostsAdminController; } });
var categories_controller_2 = require("./admin/categories-controller");
Object.defineProperty(exports, "BlogCategoriesAdminController", { enumerable: true, get: function () { return categories_controller_2.BlogCategoriesAdminController; } });
var tags_controller_2 = require("./admin/tags-controller");
Object.defineProperty(exports, "BlogTagsAdminController", { enumerable: true, get: function () { return tags_controller_2.BlogTagsAdminController; } });
var controller_2 = require("./public/controller");
Object.defineProperty(exports, "BlogPublicController", { enumerable: true, get: function () { return controller_2.BlogPublicController; } });
//# sourceMappingURL=index.js.map