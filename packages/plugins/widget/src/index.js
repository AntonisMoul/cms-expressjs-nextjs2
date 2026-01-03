"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetPlugin = void 0;
const routes_1 = require("./routes");
class WidgetPlugin {
    name = 'widget';
    version = '1.0.0';
    description = 'Widget plugin for sidebar widgets';
    async initialize(ctx) {
        // Plugin initialization
    }
    registerRoutes(router, ctx, requireAuth, requirePermission) {
        (0, routes_1.registerWidgetRoutes)(router, ctx, requireAuth, requirePermission);
    }
    getPermissions(ctx) {
        return [
            { name: 'widgets.index', description: 'Manage widgets' },
        ];
    }
    getAdminNavItems(ctx) {
        return [
            {
                id: 'widgets',
                label: 'Widgets',
                icon: 'layout',
                href: '/admin/widgets',
                permission: 'widgets.index',
                order: 50,
            },
        ];
    }
}
exports.WidgetPlugin = WidgetPlugin;
//# sourceMappingURL=index.js.map