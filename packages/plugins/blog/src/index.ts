import { Plugin, PluginContext, Permission, AdminNavItem, EventHandler, JobHandler } from '@cms/shared';
import { registerBlogRoutes } from './routes';
import { getBlogJobHandlers } from './handlers';

export class BlogPlugin implements Plugin {
  name = 'blog';
  version = '1.0.0';
  description = 'Blog plugin for managing posts, categories, and tags';

  async initialize(ctx: PluginContext): Promise<void> {
    // Plugin initialization
  }

  registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void {
    registerBlogRoutes(router, ctx, requireAuth, requirePermission);
  }

  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'blog.posts.index', description: 'List posts' },
      { name: 'blog.posts.create', description: 'Create posts' },
      { name: 'blog.posts.edit', description: 'Edit posts' },
      { name: 'blog.posts.delete', description: 'Delete posts' },
      { name: 'blog.categories.index', description: 'List categories' },
      { name: 'blog.categories.create', description: 'Create categories' },
      { name: 'blog.categories.edit', description: 'Edit categories' },
      { name: 'blog.categories.delete', description: 'Delete categories' },
      { name: 'blog.tags.index', description: 'List tags' },
      { name: 'blog.tags.create', description: 'Create tags' },
      { name: 'blog.tags.edit', description: 'Edit tags' },
      { name: 'blog.tags.delete', description: 'Delete tags' },
    ];
  }

  getAdminNavItems(ctx: PluginContext): AdminNavItem[] {
    return [
      {
        id: 'blog',
        label: 'Blog',
        icon: 'book',
        children: [
          {
            id: 'blog-posts',
            label: 'Posts',
            href: '/admin/blog/posts',
            permission: 'blog.posts.index',
            order: 1,
          },
          {
            id: 'blog-categories',
            label: 'Categories',
            href: '/admin/blog/categories',
            permission: 'blog.categories.index',
            order: 2,
          },
          {
            id: 'blog-tags',
            label: 'Tags',
            href: '/admin/blog/tags',
            permission: 'blog.tags.index',
            order: 3,
          },
        ],
        order: 20,
      },
    ];
  }

  getEventHandlers(ctx: PluginContext): EventHandler[] {
    return [
      {
        event: 'content.published',
        handler: async (payload, ctx) => {
          if (payload.type === 'post') {
            await ctx.queue.enqueue('sitemap.generate', {});
          }
        },
      },
    ];
  }

  getJobHandlers(ctx: PluginContext): JobHandler[] {
    return getBlogJobHandlers(ctx);
  }
}

