"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemePlugin = void 0;
const routes_1 = require("./routes");
class ThemePlugin {
    name = 'theme';
    version = '1.0.0';
    description = 'Theme plugin for theme management and options';
    async initialize(ctx) {
        // Plugin initialization
    }
    registerRoutes(router, ctx, requireAuth, requirePermission) {
        (0, routes_1.registerThemeRoutes)(router, ctx, requireAuth, requirePermission);
    }
    getPermissions(ctx) {
        return [
            { name: 'theme.index', description: 'Manage themes' },
            { name: 'theme.options', description: 'Manage theme options' },
        ];
    }
    getAdminNavItems(ctx) {
        return [
            {
                id: 'theme',
                label: 'Appearance',
                icon: 'palette',
                children: [
                    {
                        id: 'theme-options',
                        label: 'Theme Options',
                        href: '/admin/theme/options',
                        permission: 'theme.options',
                        order: 1,
                    },
                ],
                order: 60,
            },
        ];
    }
    getSettingsPanels(ctx) {
        return [
            {
                id: 'theme',
                title: 'Theme Options',
                description: 'Configure theme settings',
                permission: 'theme.options',
                order: 1000,
                component: null, // Will be implemented in Next.js
            },
        ];
    }
}
exports.ThemePlugin = ThemePlugin;
//# sourceMappingURL=index.js.map