import { Plugin } from '@cms/shared';
import translationRoutes from './api/routes';

const translationsPlugin: Plugin = {
  name: 'translations',
  version: '1.0.0',

  registerApiRoutes: (router) => {
    router.use('/translations', translationRoutes);
  },

  permissions: [
    {
      key: 'translations.view',
      name: 'View Translations',
      module: 'translations',
      description: 'Can view translations and languages'
    },
    {
      key: 'translations.create',
      name: 'Create Translations',
      module: 'translations',
      description: 'Can create new translations and languages'
    },
    {
      key: 'translations.edit',
      name: 'Edit Translations',
      module: 'translations',
      description: 'Can edit translations and language settings'
    },
    {
      key: 'translations.delete',
      name: 'Delete Translations',
      module: 'translations',
      description: 'Can delete translations and languages'
    }
  ],

  adminNavigation: [
    {
      id: 'translations',
      name: 'Translations',
      icon: 'translate',
      route: '/admin/translations',
      permissions: ['translations.view'],
      children: [
        {
          id: 'translations-languages',
          name: 'Languages',
          route: '/admin/translations/languages',
          permissions: ['translations.view']
        },
        {
          id: 'translations-manage',
          name: 'Manage Translations',
          route: '/admin/translations/manage',
          permissions: ['translations.edit']
        },
        {
          id: 'translations-import-export',
          name: 'Import/Export',
          route: '/admin/translations/import-export',
          permissions: ['translations.edit']
        }
      ]
    }
  ]
};

export default translationsPlugin;
