"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuPlugin = void 0;
const routes_1 = require("./routes");
class MenuPlugin {
    name = 'menu';
    version = '1.0.0';
    description = 'Menu plugin for navigation menu builder';
    async initialize(ctx) {
        // Plugin initialization
    }
    registerRoutes(router, ctx, requireAuth, requirePermission) {
        (0, routes_1.registerMenuRoutes)(router, ctx, requireAuth, requirePermission);
    }
    getPermissions(ctx) {
        return [
            { name: 'menus.index', description: 'List menus' },
            { name: 'menus.create', description: 'Create menus' },
            { name: 'menus.edit', description: 'Edit menus' },
            { name: 'menus.delete', description: 'Delete menus' },
        ];
    }
    getAdminNavItems(ctx) {
        return [
            {
                id: 'menus',
                label: 'Menus',
                icon: 'menu',
                href: '/admin/menus',
                permission: 'menus.index',
                order: 40,
            },
        ];
    }
}
exports.MenuPlugin = MenuPlugin;
//# sourceMappingURL=index.js.map