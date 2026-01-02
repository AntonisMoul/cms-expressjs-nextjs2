import { Plugin, PluginContext, Permission, AdminNavItem, AdminScreen, EventHandler, JobHandler } from '@cms/shared';
import { registerPageRoutes } from './routes';
import { getPageJobHandlers } from './handlers';

export class PagePlugin implements Plugin {
  name = 'page';
  version = '1.0.0';
  description = 'Pages plugin for managing static pages';

  async initialize(ctx: PluginContext): Promise<void> {
    // Plugin initialization
  }

  registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void {
    registerPageRoutes(router, ctx, requireAuth, requirePermission);
  }

  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'pages.index', description: 'List pages' },
      { name: 'pages.create', description: 'Create pages' },
      { name: 'pages.edit', description: 'Edit pages' },
      { name: 'pages.delete', description: 'Delete pages' },
    ];
  }

  getAdminNavItems(ctx: PluginContext): AdminNavItem[] {
    return [
      {
        id: 'pages',
        label: 'Pages',
        icon: 'file-text',
        href: '/admin/pages',
        permission: 'pages.index',
        order: 10,
      },
    ];
  }

  getAdminScreens(ctx: PluginContext): AdminScreen[] {
    // Will be implemented in Next.js app
    return [];
  }

  getEventHandlers(ctx: PluginContext): EventHandler[] {
    return [
      {
        event: 'content.published',
        handler: async (payload, ctx) => {
          if (payload.type === 'page') {
            // Enqueue sitemap generation
            await ctx.queue.enqueue('sitemap.generate', {});
          }
        },
      },
    ];
  }

  getJobHandlers(ctx: PluginContext): JobHandler[] {
    return getPageJobHandlers(ctx);
  }
}

