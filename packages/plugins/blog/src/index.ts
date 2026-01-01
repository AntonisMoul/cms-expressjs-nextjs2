import { Router } from 'express';
import { PluginContract, AdminNavItem } from '@cms/core';
import { BlogPostsAdminController } from './admin/posts-controller';
import { BlogCategoriesAdminController } from './admin/categories-controller';
import { BlogTagsAdminController } from './admin/tags-controller';
import { BlogPublicController } from './public/controller';

const plugin: PluginContract = {
  name: 'blog',
  version: '1.0.0',

  registerApiRoutes(router: Router, ctx: any) {
    // Admin routes
    const adminRouter = Router();

    // Posts routes
    adminRouter.get('/posts', BlogPostsAdminController.index);
    adminRouter.post('/posts', BlogPostsAdminController.create);
    adminRouter.get('/posts/:id', BlogPostsAdminController.show);
    adminRouter.put('/posts/:id', BlogPostsAdminController.update);
    adminRouter.delete('/posts/:id', BlogPostsAdminController.delete);

    // Post translation routes
    adminRouter.post('/posts/:id/translations', BlogPostsAdminController.createTranslation);
    adminRouter.put('/posts/:id/translations/:langCode', BlogPostsAdminController.updateTranslation);
    adminRouter.delete('/posts/:id/translations/:langCode', BlogPostsAdminController.deleteTranslation);

    // Categories routes
    adminRouter.get('/categories', BlogCategoriesAdminController.index);
    adminRouter.post('/categories', BlogCategoriesAdminController.create);
    adminRouter.get('/categories/:id', BlogCategoriesAdminController.show);
    adminRouter.put('/categories/:id', BlogCategoriesAdminController.update);
    adminRouter.delete('/categories/:id', BlogCategoriesAdminController.delete);

    // Category translation routes
    adminRouter.post('/categories/:id/translations', BlogCategoriesAdminController.createTranslation);
    adminRouter.put('/categories/:id/translations/:langCode', BlogCategoriesAdminController.updateTranslation);
    adminRouter.delete('/categories/:id/translations/:langCode', BlogCategoriesAdminController.deleteTranslation);

    // Tags routes
    adminRouter.get('/tags', BlogTagsAdminController.index);
    adminRouter.post('/tags', BlogTagsAdminController.create);
    adminRouter.get('/tags/:id', BlogTagsAdminController.show);
    adminRouter.put('/tags/:id', BlogTagsAdminController.update);
    adminRouter.delete('/tags/:id', BlogTagsAdminController.delete);

    // Tag translation routes
    adminRouter.post('/tags/:id/translations', BlogTagsAdminController.createTranslation);
    adminRouter.put('/tags/:id/translations/:langCode', BlogTagsAdminController.updateTranslation);
    adminRouter.delete('/tags/:id/translations/:langCode', BlogTagsAdminController.deleteTranslation);

    // Mount admin routes
    router.use('/blog', adminRouter);

    // Public routes
    const publicRouter = Router();
    publicRouter.get('/posts', BlogPublicController.getPosts);
    publicRouter.get('/posts/featured', BlogPublicController.getFeaturedPosts);
    publicRouter.get('/posts/category/:categoryId', BlogPublicController.getPostsByCategory);
    publicRouter.get('/posts/tag/:tagId', BlogPublicController.getPostsByTag);
    publicRouter.get('/posts/:slug', BlogPublicController.getPost);
    publicRouter.get('/categories', BlogPublicController.getCategories);
    publicRouter.get('/tags', BlogPublicController.getTags);

    // Mount public routes
    router.use('/public/blog', publicRouter);
  },

  getAdminNavigation(): AdminNavItem[] {
    return [
      {
        id: 'blog',
        label: 'Blog',
        icon: 'ti ti-article',
        priority: 3,
        children: [
          {
            id: 'blog-posts',
            label: 'Posts',
            icon: 'ti ti-file-text',
            href: '/admin/blog/posts',
            parentId: 'blog',
            priority: 10,
            permissions: ['blog.posts.index'],
          },
          {
            id: 'blog-categories',
            label: 'Categories',
            icon: 'ti ti-folder',
            href: '/admin/blog/categories',
            parentId: 'blog',
            priority: 20,
            permissions: ['blog.categories.index'],
          },
          {
            id: 'blog-tags',
            label: 'Tags',
            icon: 'ti ti-tag',
            href: '/admin/blog/tags',
            parentId: 'blog',
            priority: 30,
            permissions: ['blog.tags.index'],
          },
        ],
      },
    ];
  },

  permissions: [
    // Posts permissions
    { key: 'blog.posts.index', name: 'View Posts', module: 'blog' },
    { key: 'blog.posts.create', name: 'Create Posts', module: 'blog' },
    { key: 'blog.posts.edit', name: 'Edit Posts', module: 'blog' },
    { key: 'blog.posts.delete', name: 'Delete Posts', module: 'blog' },

    // Categories permissions
    { key: 'blog.categories.index', name: 'View Categories', module: 'blog' },
    { key: 'blog.categories.create', name: 'Create Categories', module: 'blog' },
    { key: 'blog.categories.edit', name: 'Edit Categories', module: 'blog' },
    { key: 'blog.categories.delete', name: 'Delete Categories', module: 'blog' },

    // Tags permissions
    { key: 'blog.tags.index', name: 'View Tags', module: 'blog' },
    { key: 'blog.tags.create', name: 'Create Tags', module: 'blog' },
    { key: 'blog.tags.edit', name: 'Edit Tags', module: 'blog' },
    { key: 'blog.tags.delete', name: 'Delete Tags', module: 'blog' },
  ],
};

export { plugin as blogPlugin };
export { BlogService } from './service';
export { BlogPostsAdminController } from './admin/posts-controller';
export { BlogCategoriesAdminController } from './admin/categories-controller';
export { BlogTagsAdminController } from './admin/tags-controller';
export { BlogPublicController } from './public/controller';

