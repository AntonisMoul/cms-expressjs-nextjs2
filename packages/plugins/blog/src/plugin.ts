import { Plugin } from '@cms/shared';
import registerApiRoutes from './api/routes';

const plugin: Plugin = {
  name: 'Blog',
  version: '1.0.0',
  description: 'Blog system with posts, categories, and tags',

  // API routes registration
  registerApiRoutes: (router, context) => {
    registerApiRoutes(router, context);
  },

  // Permissions
  permissions: [
    {
      key: 'posts.index',
      name: 'View Posts',
      module: 'blog',
    },
    {
      key: 'posts.create',
      name: 'Create Posts',
      module: 'blog',
    },
    {
      key: 'posts.edit',
      name: 'Edit Posts',
      module: 'blog',
    },
    {
      key: 'posts.delete',
      name: 'Delete Posts',
      module: 'blog',
    },
    {
      key: 'posts.publish',
      name: 'Publish Posts',
      module: 'blog',
    },
    {
      key: 'categories.index',
      name: 'View Categories',
      module: 'blog',
    },
    {
      key: 'categories.create',
      name: 'Create Categories',
      module: 'blog',
    },
    {
      key: 'categories.edit',
      name: 'Edit Categories',
      module: 'blog',
    },
    {
      key: 'categories.delete',
      name: 'Delete Categories',
      module: 'blog',
    },
    {
      key: 'tags.index',
      name: 'View Tags',
      module: 'blog',
    },
    {
      key: 'tags.create',
      name: 'Create Tags',
      module: 'blog',
    },
    {
      key: 'tags.edit',
      name: 'Edit Tags',
      module: 'blog',
    },
    {
      key: 'tags.delete',
      name: 'Delete Tags',
      module: 'blog',
    },
  ],

  // Admin navigation
  adminNavigation: [
    {
      id: 'blog',
      name: 'Blog',
      icon: 'ti ti-article',
      priority: 3,
      children: [
        {
          id: 'blog-posts',
          name: 'Posts',
          icon: 'ti ti-file-text',
          route: '/admin/blog/posts',
          permissions: ['posts.index'],
          priority: 10,
        },
        {
          id: 'blog-categories',
          name: 'Categories',
          icon: 'ti ti-folder',
          route: '/admin/blog/categories',
          permissions: ['categories.index'],
          priority: 20,
        },
        {
          id: 'blog-tags',
          name: 'Tags',
          icon: 'ti ti-tag',
          route: '/admin/blog/tags',
          permissions: ['tags.index'],
          priority: 30,
        },
      ],
    },
  ],

  // Initialization
  init: async (context) => {
    console.log('Blog plugin initialized');
  },

  // Cleanup
  destroy: async () => {
    console.log('Blog plugin destroyed');
  },
};

export default plugin;
