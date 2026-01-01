import { Router } from 'express';
import { PluginContract, AdminNavItem } from '@cms/core';
import { PagesAdminController } from './admin/controller';
import { PagesPublicController } from './public/controller';

const plugin: PluginContract = {
  name: 'pages',
  version: '1.0.0',

  registerApiRoutes(router: Router, ctx: any) {
    // Admin routes
    const adminRouter = Router();

    adminRouter.get('/', PagesAdminController.index);
    adminRouter.post('/', PagesAdminController.create);
    adminRouter.get('/:id', PagesAdminController.show);
    adminRouter.put('/:id', PagesAdminController.update);
    adminRouter.delete('/:id', PagesAdminController.delete);

    // Translation routes
    adminRouter.post('/:id/translations', PagesAdminController.createTranslation);
    adminRouter.put('/:id/translations/:langCode', PagesAdminController.updateTranslation);
    adminRouter.delete('/:id/translations/:langCode', PagesAdminController.deleteTranslation);

    // Mount admin routes
    router.use('/pages', adminRouter);

    // Public routes
    const publicRouter = Router();
    publicRouter.get('/', PagesPublicController.getPages);
    publicRouter.get('/featured', PagesPublicController.getFeaturedPages);
    publicRouter.get('/:slug', PagesPublicController.getPage);

    // Mount public routes
    router.use('/public/pages', publicRouter);
  },

  getAdminNavigation(): AdminNavItem[] {
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

export { plugin as pagesPlugin };
export { PagesService } from './service';
export { PagesAdminController } from './admin/controller';
export { PagesPublicController } from './public/controller';

