import { Router } from 'express';
import { PluginContract, AdminNavItem } from '@cms/core';
import { MenuAdminController } from './admin/controller';
import { MenuPublicController } from './public/controller';

const plugin: PluginContract = {
  name: 'menu',
  version: '1.0.0',

  registerApiRoutes(router: Router, ctx: any) {
    // Admin routes
    const adminRouter = Router();

    // Menu CRUD
    adminRouter.get('/menus', MenuAdminController.getMenus);
    adminRouter.post('/menus', MenuAdminController.createMenu);
    adminRouter.get('/menus/:id', MenuAdminController.getMenu);
    adminRouter.put('/menus/:id', MenuAdminController.updateMenu);
    adminRouter.delete('/menus/:id', MenuAdminController.deleteMenu);

    // Menu structure
    adminRouter.get('/menus/:id/structure', MenuAdminController.getMenuStructure);

    // Menu nodes CRUD
    adminRouter.post('/menu-nodes', MenuAdminController.createMenuNode);
    adminRouter.put('/menu-nodes/:id', MenuAdminController.updateMenuNode);
    adminRouter.delete('/menu-nodes/:id', MenuAdminController.deleteMenuNode);

    // Menu reordering
    adminRouter.post('/menu-nodes/reorder', MenuAdminController.reorderMenuNodes);

    // Menu locations
    adminRouter.get('/locations', MenuAdminController.getLocations);
    adminRouter.post('/locations/assign', MenuAdminController.assignMenuToLocation);
    adminRouter.delete('/locations/:location', MenuAdminController.removeMenuFromLocation);
    adminRouter.get('/locations/:location/menu', MenuAdminController.getMenuByLocation);

    // Mount admin routes
    router.use('/menu', adminRouter);

    // Public routes
    const publicRouter = Router();
    publicRouter.get('/locations/:location', MenuPublicController.getMenuByLocation);
    publicRouter.get('/menus/:menuId/structure', MenuPublicController.getMenuStructure);
    publicRouter.get('/menus', MenuPublicController.getAllMenus);
    publicRouter.get('/render/:location', MenuPublicController.renderMenu);
    publicRouter.get('/breadcrumbs', MenuPublicController.getBreadcrumbs);

    // Mount public routes
    router.use('/public/menu', publicRouter);
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

export { plugin as menuPlugin };
export { MenuService } from './service';
export { MenuAdminController } from './admin/controller';
export { MenuPublicController } from './public/controller';