import { Plugin, PluginContext } from '@cms/shared';
import registerApiRoutes from './api/routes';

const plugin: Plugin = {
  name: 'Pages',
  version: '1.0.0',
  description: 'Page management system with multilingual support',

  // API routes registration
  registerApiRoutes: (router, context) => {
    registerApiRoutes(router, context);
  },

  // Permissions
  permissions: [
    {
      key: 'pages.index',
      name: 'View Pages',
      module: 'pages',
    },
    {
      key: 'pages.create',
      name: 'Create Pages',
      module: 'pages',
    },
    {
      key: 'pages.edit',
      name: 'Edit Pages',
      module: 'pages',
    },
    {
      key: 'pages.delete',
      name: 'Delete Pages',
      module: 'pages',
    },
    {
      key: 'pages.publish',
      name: 'Publish Pages',
      module: 'pages',
    },
  ],

  // Admin navigation
  adminNavigation: [
    {
      id: 'pages',
      name: 'Pages',
      icon: 'ti ti-notebook',
      route: '/admin/pages',
      permissions: ['pages.index'],
      priority: 2,
    },
  ],

  // Initialization
  init: async (context) => {
    console.log('Pages plugin initialized');
  },

  // Cleanup
  destroy: async () => {
    console.log('Pages plugin destroyed');
  },
};

export default plugin;
