import { Plugin, PluginContext, Permission, AdminNavItem, SettingsPanel, JobHandler } from '@cms/shared';
import { getSitemapJobHandlers } from './handlers';

export class SitemapPlugin implements Plugin {
  name = 'sitemap';
  version = '1.0.0';
  description = 'Sitemap plugin for XML sitemap generation';

  async initialize(ctx: PluginContext): Promise<void> {
    // Plugin initialization
  }

  getPermissions(ctx: PluginContext): Permission[] {
    return [
      { name: 'sitemap.generate', description: 'Generate sitemap' },
    ];
  }

  getSettingsPanels(ctx: PluginContext): SettingsPanel[] {
    return [
      {
        id: 'sitemap',
        title: 'Sitemap',
        description: 'Configure XML sitemap generation',
        permission: 'settings.options',
        order: 1000,
        component: null, // Will be implemented in Next.js
      },
    ];
  }

  getJobHandlers(ctx: PluginContext): JobHandler[] {
    return getSitemapJobHandlers(ctx);
  }
}

