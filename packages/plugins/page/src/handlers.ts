import { PluginContext, JobHandler } from '@cms/shared';

export function getPageJobHandlers(ctx: PluginContext): JobHandler[] {
  return [
    // Page-specific job handlers can be added here
    // For now, pages use the generic sitemap.generate handler
  ];
}

