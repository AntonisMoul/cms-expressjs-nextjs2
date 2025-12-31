import { Plugin } from '@cms/shared';
import themeRoutes from './api/routes';

const themesPlugin: Plugin = {
  name: 'themes',
  version: '1.0.0',

  registerApiRoutes: (router) => {
    router.use('/themes', themeRoutes);
  },

  permissions: [
    {
      key: 'themes.view',
      name: 'View Themes',
      module: 'themes',
      description: 'Can view themes and theme settings'
    },
    {
      key: 'themes.create',
      name: 'Create Themes',
      module: 'themes',
      description: 'Can create new themes'
    },
    {
      key: 'themes.edit',
      name: 'Edit Themes',
      module: 'themes',
      description: 'Can edit themes and theme settings'
    },
    {
      key: 'themes.delete',
      name: 'Delete Themes',
      module: 'themes',
      description: 'Can delete themes'
    }
  ],

  adminNavigation: [
    {
      id: 'appearance',
      name: 'Appearance',
      icon: 'palette',
      route: '/admin/appearance',
      permissions: ['themes.view'],
      children: [
        {
          id: 'themes',
          name: 'Themes',
          route: '/admin/themes',
          permissions: ['themes.view']
        },
        {
          id: 'customize',
          name: 'Customize',
          route: '/admin/themes/customize',
          permissions: ['themes.edit']
        }
      ]
    }
  ]
};

export default themesPlugin;
