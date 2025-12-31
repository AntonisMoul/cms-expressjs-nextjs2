import { Plugin } from '@cms/shared';
import widgetRoutes from './api/routes';

const widgetsPlugin: Plugin = {
  name: 'widgets',
  version: '1.0.0',

  registerApiRoutes: (router) => {
    router.use('/widgets', widgetRoutes);
  },

  permissions: [
    {
      key: 'widgets.view',
      name: 'View Widgets',
      module: 'widgets',
      description: 'Can view widgets and sidebars'
    },
    {
      key: 'widgets.create',
      name: 'Create Widgets',
      module: 'widgets',
      description: 'Can create new widgets'
    },
    {
      key: 'widgets.edit',
      name: 'Edit Widgets',
      module: 'widgets',
      description: 'Can edit widgets and sidebars'
    },
    {
      key: 'widgets.delete',
      name: 'Delete Widgets',
      module: 'widgets',
      description: 'Can delete widgets and sidebars'
    }
  ],

  adminNavigation: [
    {
      id: 'widgets',
      name: 'Widgets',
      icon: 'widgets',
      route: '/admin/widgets',
      permissions: ['widgets.view'],
      children: [
        {
          id: 'widgets-list',
          name: 'All Widgets',
          route: '/admin/widgets',
          permissions: ['widgets.view']
        },
        {
          id: 'widgets-sidebars',
          name: 'Sidebars',
          route: '/admin/widgets/sidebars',
          permissions: ['widgets.view']
        }
      ]
    }
  ]
};

export default widgetsPlugin;
