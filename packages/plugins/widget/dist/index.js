"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetPublicController = exports.WidgetAdminController = exports.WidgetService = exports.widgetPlugin = void 0;
const express_1 = require("express");
const controller_1 = require("./admin/controller");
const controller_2 = require("./public/controller");
const plugin = {
    name: 'widget',
    version: '1.0.0',
    registerApiRoutes(router, ctx) {
        // Admin routes
        const adminRouter = (0, express_1.Router)();
        // Widget CRUD
        adminRouter.get('/widgets', controller_1.WidgetAdminController.getWidgets);
        adminRouter.post('/widgets', controller_1.WidgetAdminController.createWidget);
        adminRouter.get('/widgets/:id', controller_1.WidgetAdminController.getWidget);
        adminRouter.put('/widgets/:id', controller_1.WidgetAdminController.updateWidget);
        adminRouter.delete('/widgets/:id', controller_1.WidgetAdminController.deleteWidget);
        // Widget types and groups
        adminRouter.get('/types', controller_1.WidgetAdminController.getWidgetTypes);
        adminRouter.get('/groups', controller_1.WidgetAdminController.getWidgetGroups);
        // Sidebars
        adminRouter.get('/sidebars', controller_1.WidgetAdminController.getSidebars);
        adminRouter.get('/sidebars/:sidebarId/widgets', controller_1.WidgetAdminController.getSidebarWidgets);
        // Widget operations
        adminRouter.put('/widgets/:id/move', controller_1.WidgetAdminController.moveWidget);
        adminRouter.post('/widgets/:id/clone', controller_1.WidgetAdminController.cloneWidget);
        adminRouter.post('/widgets/reorder', controller_1.WidgetAdminController.reorderWidgets);
        // Bulk operations
        adminRouter.post('/widgets/bulk-delete', controller_1.WidgetAdminController.bulkDelete);
        adminRouter.post('/widgets/bulk-move', controller_1.WidgetAdminController.bulkMove);
        // Mount admin routes
        router.use('/widget', adminRouter);
        // Public routes
        const publicRouter = (0, express_1.Router)();
        publicRouter.get('/sidebars/:sidebarId', controller_2.WidgetPublicController.getSidebarWidgets);
        publicRouter.get('/sidebars/:sidebarId/render', controller_2.WidgetPublicController.renderSidebar);
        publicRouter.get('/widgets/:widgetId/html', controller_2.WidgetPublicController.getWidgetHtml);
        // Mount public routes
        router.use('/public/widget', publicRouter);
    },
    getAdminNavigation() {
        return [
            {
                id: 'appearance',
                label: 'Appearance',
                icon: 'ti ti-brush',
                priority: 2000,
                children: [
                    {
                        id: 'widgets',
                        label: 'Widgets',
                        icon: 'ti ti-layout',
                        href: '/admin/appearance/widgets',
                        parentId: 'appearance',
                        priority: 3,
                        permissions: ['widget.index'],
                    },
                ],
            },
        ];
    },
    permissions: [
        // Widget permissions
        { key: 'widget.index', name: 'View Widgets', module: 'widget' },
        { key: 'widget.create', name: 'Create Widgets', module: 'widget' },
        { key: 'widget.edit', name: 'Edit Widgets', module: 'widget' },
        { key: 'widget.delete', name: 'Delete Widgets', module: 'widget' },
        // Widget management permissions
        { key: 'widget.manage', name: 'Manage Widget Areas', module: 'widget' },
        { key: 'widget.bulk_operations', name: 'Bulk Widget Operations', module: 'widget' },
    ],
};
exports.widgetPlugin = plugin;
var service_1 = require("./service");
Object.defineProperty(exports, "WidgetService", { enumerable: true, get: function () { return service_1.WidgetService; } });
var controller_3 = require("./admin/controller");
Object.defineProperty(exports, "WidgetAdminController", { enumerable: true, get: function () { return controller_3.WidgetAdminController; } });
var controller_4 = require("./public/controller");
Object.defineProperty(exports, "WidgetPublicController", { enumerable: true, get: function () { return controller_4.WidgetPublicController; } });
//# sourceMappingURL=index.js.map