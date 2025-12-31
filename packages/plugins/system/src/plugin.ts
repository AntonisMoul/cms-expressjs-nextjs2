import { Plugin } from '@cms/shared';
import systemRoutes from './api/routes';

const systemPlugin: Plugin = {
  name: 'system',
  version: '1.0.0',

  registerApiRoutes: (router) => {
    router.use('/system', systemRoutes);
  },

  permissions: [
    // System permissions
    {
      key: 'system.view',
      name: 'View System Info',
      module: 'system',
      description: 'Can view system information and statistics'
    },
    {
      key: 'system.edit',
      name: 'Edit System Settings',
      module: 'system',
      description: 'Can perform system maintenance tasks'
    },
    // Redirect permissions
    {
      key: 'redirects.view',
      name: 'View Redirects',
      module: 'redirects',
      description: 'Can view URL redirects'
    },
    {
      key: 'redirects.create',
      name: 'Create Redirects',
      module: 'redirects',
      description: 'Can create new URL redirects'
    },
    {
      key: 'redirects.edit',
      name: 'Edit Redirects',
      module: 'redirects',
      description: 'Can edit URL redirects'
    },
    {
      key: 'redirects.delete',
      name: 'Delete Redirects',
      module: 'redirects',
      description: 'Can delete URL redirects'
    },
    // Cache permissions
    {
      key: 'cache.view',
      name: 'View Cache',
      module: 'cache',
      description: 'Can view cache statistics'
    },
    {
      key: 'cache.edit',
      name: 'Edit Cache',
      module: 'cache',
      description: 'Can clear and manage cache'
    },
    // Sitemap permissions
    {
      key: 'sitemap.view',
      name: 'View Sitemap',
      module: 'sitemap',
      description: 'Can view sitemap entries and statistics'
    },
    {
      key: 'sitemap.edit',
      name: 'Edit Sitemap',
      module: 'sitemap',
      description: 'Can manage sitemap entries and generation'
    }
  ],

  adminNavigation: [
    {
      id: 'system',
      name: 'System',
      icon: 'settings',
      route: '/admin/system',
      permissions: ['system.view'],
      children: [
        {
          id: 'system-info',
          name: 'System Info',
          route: '/admin/system/info',
          permissions: ['system.view']
        },
        {
          id: 'maintenance',
          name: 'Maintenance',
          route: '/admin/system/maintenance',
          permissions: ['system.edit']
        },
        {
          id: 'redirects',
          name: 'URL Redirects',
          route: '/admin/system/redirects',
          permissions: ['redirects.view']
        },
        {
          id: 'cache',
          name: 'Cache Management',
          route: '/admin/system/cache',
          permissions: ['cache.view']
        },
        {
          id: 'sitemap',
          name: 'Sitemap',
          route: '/admin/system/sitemap',
          permissions: ['sitemap.view']
        }
      ]
    }
  ]
};

export default systemPlugin;
