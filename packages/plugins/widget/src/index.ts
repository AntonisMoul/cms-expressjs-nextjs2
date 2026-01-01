import { Router } from 'express';
import { PluginContract, AdminNavItem } from '@cms/core';
import { WidgetAdminController } from './admin/controller';
import { WidgetPublicController } from './public/controller';

const plugin: PluginContract = {
  name: 'widget',
  version: '1.0.0',

  registerApiRoutes(router: Router, ctx: any) {
    // Admin routes
    const adminRouter = Router();

    // Widget CRUD
    adminRouter.get('/widgets', WidgetAdminController.getWidgets);
    adminRouter.post('/widgets', WidgetAdminController.createWidget);
    adminRouter.get('/widgets/:id', WidgetAdminController.getWidget);
    adminRouter.put('/widgets/:id', WidgetAdminController.updateWidget);
    adminRouter.delete('/widgets/:id', WidgetAdminController.deleteWidget);

    // Widget types and groups
    adminRouter.get('/types', WidgetAdminController.getWidgetTypes);
    adminRouter.get('/groups', WidgetAdminController.getWidgetGroups);

    // Sidebars
    adminRouter.get('/sidebars', WidgetAdminController.getSidebars);
    adminRouter.get('/sidebars/:sidebarId/widgets', WidgetAdminController.getSidebarWidgets);

    // Widget operations
    adminRouter.put('/widgets/:id/move', WidgetAdminController.moveWidget);
    adminRouter.post('/widgets/:id/clone', WidgetAdminController.cloneWidget);
    adminRouter.post('/widgets/reorder', WidgetAdminController.reorderWidgets);

    // Bulk operations
    adminRouter.post('/widgets/bulk-delete', WidgetAdminController.bulkDelete);
    adminRouter.post('/widgets/bulk-move', WidgetAdminController.bulkMove);

    // Mount admin routes
    router.use('/widget', adminRouter);

    // Public routes
    const publicRouter = Router();
    publicRouter.get('/sidebars/:sidebarId', WidgetPublicController.getSidebarWidgets);
    publicRouter.get('/sidebars/:sidebarId/render', WidgetPublicController.renderSidebar);
    publicRouter.get('/widgets/:widgetId/html', WidgetPublicController.getWidgetHtml);

    // Mount public routes
    router.use('/public/widget', publicRouter);
  },

  getAdminNavigation(): AdminNavItem[] {
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

export { plugin as widgetPlugin };
export { WidgetService } from './service';
export { WidgetAdminController } from './admin/controller';
export { WidgetPublicController } from './public/controller';