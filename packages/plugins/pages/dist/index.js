"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesPublicController = exports.PagesAdminController = exports.PagesService = exports.pagesPlugin = void 0;
const express_1 = require("express");
const controller_1 = require("./admin/controller");
const controller_2 = require("./public/controller");
const plugin = {
    name: 'pages',
    version: '1.0.0',
    registerApiRoutes(router, ctx) {
        // Admin routes
        const adminRouter = (0, express_1.Router)();
        adminRouter.get('/', controller_1.PagesAdminController.index);
        adminRouter.post('/', controller_1.PagesAdminController.create);
        adminRouter.get('/:id', controller_1.PagesAdminController.show);
        adminRouter.put('/:id', controller_1.PagesAdminController.update);
        adminRouter.delete('/:id', controller_1.PagesAdminController.delete);
        // Translation routes
        adminRouter.post('/:id/translations', controller_1.PagesAdminController.createTranslation);
        adminRouter.put('/:id/translations/:langCode', controller_1.PagesAdminController.updateTranslation);
        adminRouter.delete('/:id/translations/:langCode', controller_1.PagesAdminController.deleteTranslation);
        // Mount admin routes
        router.use('/pages', adminRouter);
        // Public routes
        const publicRouter = (0, express_1.Router)();
        publicRouter.get('/', controller_2.PagesPublicController.getPages);
        publicRouter.get('/featured', controller_2.PagesPublicController.getFeaturedPages);
        publicRouter.get('/:slug', controller_2.PagesPublicController.getPage);
        // Mount public routes
        router.use('/public/pages', publicRouter);
    },
    getAdminNavigation() {
        return [
            {
                id: 'pages',
                label: 'Pages',
                icon: 'ti ti-notebook',
                href: '/admin/pages',
                priority: 2,
                permissions: ['pages.index'],
            },
        ];
    },
    permissions: [
        { key: 'pages.index', name: 'View Pages', module: 'pages' },
        { key: 'pages.create', name: 'Create Pages', module: 'pages' },
        { key: 'pages.edit', name: 'Edit Pages', module: 'pages' },
        { key: 'pages.delete', name: 'Delete Pages', module: 'pages' },
    ],
};
exports.pagesPlugin = plugin;
var service_1 = require("./service");
Object.defineProperty(exports, "PagesService", { enumerable: true, get: function () { return service_1.PagesService; } });
var controller_3 = require("./admin/controller");
Object.defineProperty(exports, "PagesAdminController", { enumerable: true, get: function () { return controller_3.PagesAdminController; } });
var controller_4 = require("./public/controller");
Object.defineProperty(exports, "PagesPublicController", { enumerable: true, get: function () { return controller_4.PagesPublicController; } });
//# sourceMappingURL=index.js.map