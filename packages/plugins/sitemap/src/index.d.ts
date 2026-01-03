import { Plugin, PluginContext, Permission, SettingsPanel, JobHandler } from '@cms/shared';
export declare class SitemapPlugin implements Plugin {
    name: string;
    version: string;
    description: string;
    initialize(ctx: PluginContext): Promise<void>;
    getPermissions(ctx: PluginContext): Permission[];
    getSettingsPanels(ctx: PluginContext): SettingsPanel[];
    getJobHandlers(ctx: PluginContext): JobHandler[];
}
//# sourceMappingURL=index.d.ts.map