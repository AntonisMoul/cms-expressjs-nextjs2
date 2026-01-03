"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagePlugin = void 0;
const routes_1 = require("./routes");
const handlers_1 = require("./handlers");
class PagePlugin {
    name = 'page';
    version = '1.0.0';
    description = 'Pages plugin for managing static pages';
    async initialize(ctx) {
        // Plugin initialization
    }
    registerRoutes(router, ctx, requireAuth, requirePermission) {
        (0, routes_1.registerPageRoutes)(router, ctx, requireAuth, requirePermission);
    }
    getPermissions(ctx) {
        return [
            { name: 'pages.index', description: 'List pages' },
            { name: 'pages.create', description: 'Create pages' },
            { name: 'pages.edit', description: 'Edit pages' },
            { name: 'pages.delete', description: 'Delete pages' },
        ];
    }
    getAdminNavItems(ctx) {
        return [
            {
                id: 'pages',
                label: 'Pages',
                icon: 'file-text',
                href: '/admin/pages',
                permission: 'pages.index',
                order: 10,
            },
        ];
    }
    getAdminScreens(ctx) {
        // Will be implemented in Next.js app
        return [];
    }
    getEventHandlers(ctx) {
        return [
            {
                event: 'content.published',
                handler: async (payload, ctx) => {
                    if (payload.type === 'page') {
                        // Enqueue sitemap generation
                        await ctx.queue.enqueue('sitemap.generate', {});
                    }
                },
            },
        ];
    }
    getJobHandlers(ctx) {
        return (0, handlers_1.getPageJobHandlers)(ctx);
    }
}
exports.PagePlugin = PagePlugin;
//# sourceMappingURL=index.js.map