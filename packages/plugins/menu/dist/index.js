"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuPublicController = exports.MenuAdminController = exports.MenuService = exports.menuPlugin = void 0;
const express_1 = require("express");
const controller_1 = require("./admin/controller");
const controller_2 = require("./public/controller");
const plugin = {
    name: 'menu',
    version: '1.0.0',
    registerApiRoutes(router, ctx) {
        // Admin routes
        const adminRouter = (0, express_1.Router)();
        // Menu CRUD
        adminRouter.get('/menus', controller_1.MenuAdminController.getMenus);
        adminRouter.post('/menus', controller_1.MenuAdminController.createMenu);
        adminRouter.get('/menus/:id', controller_1.MenuAdminController.getMenu);
        adminRouter.put('/menus/:id', controller_1.MenuAdminController.updateMenu);
        adminRouter.delete('/menus/:id', controller_1.MenuAdminController.deleteMenu);
        // Menu structure
        adminRouter.get('/menus/:id/structure', controller_1.MenuAdminController.getMenuStructure);
        // Menu nodes CRUD
        adminRouter.post('/menu-nodes', controller_1.MenuAdminController.createMenuNode);
        adminRouter.put('/menu-nodes/:id', controller_1.MenuAdminController.updateMenuNode);
        adminRouter.delete('/menu-nodes/:id', controller_1.MenuAdminController.deleteMenuNode);
        // Menu reordering
        adminRouter.post('/menu-nodes/reorder', controller_1.MenuAdminController.reorderMenuNodes);
        // Menu locations
        adminRouter.get('/locations', controller_1.MenuAdminController.getLocations);
        adminRouter.post('/locations/assign', controller_1.MenuAdminController.assignMenuToLocation);
        adminRouter.delete('/locations/:location', controller_1.MenuAdminController.removeMenuFromLocation);
        adminRouter.get('/locations/:location/menu', controller_1.MenuAdminController.getMenuByLocation);
        // Mount admin routes
        router.use('/menu', adminRouter);
        // Public routes
        const publicRouter = (0, express_1.Router)();
        publicRouter.get('/locations/:location', controller_2.MenuPublicController.getMenuByLocation);
        publicRouter.get('/menus/:menuId/structure', controller_2.MenuPublicController.getMenuStructure);
        publicRouter.get('/menus', controller_2.MenuPublicController.getAllMenus);
        publicRouter.get('/render/:location', controller_2.MenuPublicController.renderMenu);
        publicRouter.get('/breadcrumbs', controller_2.MenuPublicController.getBreadcrumbs);
        // Mount public routes
        router.use('/public/menu', publicRouter);
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
                        id: 'menus',
                        label: 'Menus',
                        icon: 'ti ti-tournament',
                        href: '/admin/appearance/menus',
                        parentId: 'appearance',
                        priority: 2,
                        permissions: ['menu.index'],
                    },
                ],
            },
        ];
    },
    permissions: [
        // Menu permissions
        { key: 'menu.index', name: 'View Menus', module: 'menu' },
        { key: 'menu.create', name: 'Create Menus', module: 'menu' },
        { key: 'menu.edit', name: 'Edit Menus', module: 'menu' },
        { key: 'menu.delete', name: 'Delete Menus', module: 'menu' },
        // Menu node permissions
        { key: 'menu.nodes.manage', name: 'Manage Menu Items', module: 'menu' },
        // Menu location permissions
        { key: 'menu.locations.manage', name: 'Manage Menu Locations', module: 'menu' },
    ],
};
exports.menuPlugin = plugin;
var service_1 = require("./service");
Object.defineProperty(exports, "MenuService", { enumerable: true, get: function () { return service_1.MenuService; } });
var controller_3 = require("./admin/controller");
Object.defineProperty(exports, "MenuAdminController", { enumerable: true, get: function () { return controller_3.MenuAdminController; } });
var controller_4 = require("./public/controller");
Object.defineProperty(exports, "MenuPublicController", { enumerable: true, get: function () { return controller_4.MenuPublicController; } });
//# sourceMappingURL=index.js.map