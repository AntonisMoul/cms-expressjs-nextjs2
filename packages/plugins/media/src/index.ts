import { Plugin, PluginContext, Permission, AdminNavItem, JobHandler } from '@cms/shared';
import { registerMediaRoutes } from './routes';
import { getMediaJobHandlers } from './handlers';

export class MediaPlugin implements Plugin {
  name = 'media';
  version = '1.0.0';
  description = 'Media plugin for file uploads and management';

  async initialize(ctx: PluginContext): Promise<void> {
    // Plugin initialization
  }

  registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void {
    registerMediaRoutes(router, ctx, requireAuth, requirePermission);
  }

  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'media.index', description: 'List media files' },
      { name: 'media.upload', description: 'Upload media files' },
      { name: 'media.delete', description: 'Delete media files' },
    ];
  }

  getAdminNavItems(ctx: PluginContext): AdminNavItem[] {
    return [
      {
        id: 'media',
        label: 'Media',
        icon: 'image',
        href: '/admin/media',
        permission: 'media.index',
        order: 30,
      },
    ];
  }

  getJobHandlers(ctx: PluginContext): JobHandler[] {
    return getMediaJobHandlers(ctx);
  }
}

