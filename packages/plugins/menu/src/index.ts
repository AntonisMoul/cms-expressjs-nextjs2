import { Plugin, PluginContext, Permission, AdminNavItem } from '@cms/shared';
import { registerMenuRoutes } from './routes';

export class MenuPlugin implements Plugin {
  name = 'menu';
  version = '1.0.0';
  description = 'Menu plugin for navigation menu builder';

  async initialize(ctx: PluginContext): Promise<void> {
    // Plugin initialization
  }

  registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void {
    registerMenuRoutes(router, ctx, requireAuth, requirePermission);
  }

  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'menus.index', description: 'List menus' },
      { name: 'menus.create', description: 'Create menus' },
      { name: 'menus.edit', description: 'Edit menus' },
      { name: 'menus.delete', description: 'Delete menus' },
    ];
  }

  getAdminNavItems(ctx: PluginContext): AdminNavItem[] {
    return [
      {
        id: 'menus',
        label: 'Menus',
        icon: 'menu',
        href: '/admin/menus',
        permission: 'menus.index',
        order: 40,
      },
    ];
  }
}

