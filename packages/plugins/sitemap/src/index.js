"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapPlugin = void 0;
const handlers_1 = require("./handlers");
class SitemapPlugin {
    name = 'sitemap';
    version = '1.0.0';
    description = 'Sitemap plugin for XML sitemap generation';
    async initialize(ctx) {
        // Plugin initialization
    }
    getPermissions(ctx) {
        return [
            { name: 'sitemap.generate', description: 'Generate sitemap' },
        ];
    }
    getSettingsPanels(ctx) {
        return [
            {
                id: 'sitemap',
                title: 'Sitemap',
                description: 'Configure XML sitemap generation',
                permission: 'settings.options',
                order: 1000,
                component: null, // Will be implemented in Next.js
            },
        ];
    }
    getJobHandlers(ctx) {
        return (0, handlers_1.getSitemapJobHandlers)(ctx);
    }
}
exports.SitemapPlugin = SitemapPlugin;
//# sourceMappingURL=index.js.map