"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPlugin = void 0;
const routes_1 = require("./routes");
const handlers_1 = require("./handlers");
class MediaPlugin {
    name = 'media';
    version = '1.0.0';
    description = 'Media plugin for file uploads and management';
    async initialize(ctx) {
        // Plugin initialization
    }
    registerRoutes(router, ctx, requireAuth, requirePermission) {
        (0, routes_1.registerMediaRoutes)(router, ctx, requireAuth, requirePermission);
    }
    getPermissions(ctx) {
        return [
            { name: 'media.index', description: 'List media files' },
            { name: 'media.upload', description: 'Upload media files' },
            { name: 'media.delete', description: 'Delete media files' },
        ];
    }
    getAdminNavItems(ctx) {
        return [
            {
                id: 'media',
                label: 'Media',
                icon: 'image',
                href: '/admin/media',
                permission: 'media.index',
                order: 30,
            },
        ];
    }
    getJobHandlers(ctx) {
        return (0, handlers_1.getMediaJobHandlers)(ctx);
    }
}
exports.MediaPlugin = MediaPlugin;
//# sourceMappingURL=index.js.map