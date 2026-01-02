import { Plugin, PluginContext, Permission, AdminNavItem, SettingsPanel } from '@cms/shared';
import { registerThemeRoutes } from './routes';

export class ThemePlugin implements Plugin {
  name = 'theme';
  version = '1.0.0';
  description = 'Theme plugin for theme management and options';

  async initialize(ctx: PluginContext): Promise<void> {
    // Plugin initialization
  }

  registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void {
    registerThemeRoutes(router, ctx, requireAuth, requirePermission);
  }

  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'theme.index', description: 'Manage themes' },
      { name: 'theme.options', description: 'Manage theme options' },
    ];
  }

  getAdminNavItems(ctx: PluginContext): AdminNavItem[] {
    return [
      {
        id: 'theme',
        label: 'Appearance',
        icon: 'palette',
        children: [
          {
            id: 'theme-options',
            label: 'Theme Options',
            href: '/admin/theme/options',
            permission: 'theme.options',
            order: 1,
          },
        ],
        order: 60,
      },
    ];
  }

  getSettingsPanels(ctx: PluginContext): SettingsPanel[] {
    return [
      {
        id: 'theme',
        title: 'Theme Options',
        description: 'Configure theme settings',
        permission: 'theme.options',
        order: 1000,
        component: null, // Will be implemented in Next.js
      },
    ];
  }
}

