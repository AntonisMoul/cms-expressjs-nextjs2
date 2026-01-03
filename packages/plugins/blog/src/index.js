"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPlugin = void 0;
const routes_1 = require("./routes");
const handlers_1 = require("./handlers");
class BlogPlugin {
    name = 'blog';
    version = '1.0.0';
    description = 'Blog plugin for managing posts, categories, and tags';
    async initialize(ctx) {
        // Plugin initialization
    }
    registerRoutes(router, ctx, requireAuth, requirePermission) {
        (0, routes_1.registerBlogRoutes)(router, ctx, requireAuth, requirePermission);
    }
    getPermissions(ctx) {
        return [
            { name: 'blog.posts.index', description: 'List posts' },
            { name: 'blog.posts.create', description: 'Create posts' },
            { name: 'blog.posts.edit', description: 'Edit posts' },
            { name: 'blog.posts.delete', description: 'Delete posts' },
            { name: 'blog.categories.index', description: 'List categories' },
            { name: 'blog.categories.create', description: 'Create categories' },
            { name: 'blog.categories.edit', description: 'Edit categories' },
            { name: 'blog.categories.delete', description: 'Delete categories' },
            { name: 'blog.tags.index', description: 'List tags' },
            { name: 'blog.tags.create', description: 'Create tags' },
            { name: 'blog.tags.edit', description: 'Edit tags' },
            { name: 'blog.tags.delete', description: 'Delete tags' },
        ];
    }
    getAdminNavItems(ctx) {
        return [
            {
                id: 'blog',
                label: 'Blog',
                icon: 'book',
                children: [
                    {
                        id: 'blog-posts',
                        label: 'Posts',
                        href: '/admin/blog/posts',
                        permission: 'blog.posts.index',
                        order: 1,
                    },
                    {
                        id: 'blog-categories',
                        label: 'Categories',
                        href: '/admin/blog/categories',
                        permission: 'blog.categories.index',
                        order: 2,
                    },
                    {
                        id: 'blog-tags',
                        label: 'Tags',
                        href: '/admin/blog/tags',
                        permission: 'blog.tags.index',
                        order: 3,
                    },
                ],
                order: 20,
            },
        ];
    }
    getEventHandlers(ctx) {
        return [
            {
                event: 'content.published',
                handler: async (payload, ctx) => {
                    if (payload.type === 'post') {
                        await ctx.queue.enqueue('sitemap.generate', {});
                    }
                },
            },
        ];
    }
    getJobHandlers(ctx) {
        return (0, handlers_1.getBlogJobHandlers)(ctx);
    }
}
exports.BlogPlugin = BlogPlugin;
//# sourceMappingURL=index.js.map