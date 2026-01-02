import { Plugin, PluginContext, Permission, AdminNavItem } from '@cms/shared';
import { registerWidgetRoutes } from './routes';

export class WidgetPlugin implements Plugin {
  name = 'widget';
  version = '1.0.0';
  description = 'Widget plugin for sidebar widgets';

  async initialize(ctx: PluginContext): Promise<void> {
    // Plugin initialization
  }

  registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void {
    registerWidgetRoutes(router, ctx, requireAuth, requirePermission);
  }

  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'widgets.index', description: 'Manage widgets' },
    ];
  }

  getAdminNavItems(ctx: PluginContext): AdminNavItem[] {
    return [
      {
        id: 'widgets',
        label: 'Widgets',
        icon: 'layout',
        href: '/admin/widgets',
        permission: 'widgets.index',
        order: 50,
      },
    ];
  }
}

