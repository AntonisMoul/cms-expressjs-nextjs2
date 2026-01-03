import { Plugin, PluginContext, Permission, AdminNavItem, SettingsPanel } from '@cms/shared';
export declare class ThemePlugin implements Plugin {
    name: string;
    version: string;
    description: string;
    initialize(ctx: PluginContext): Promise<void>;
    registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void;
    getPermissions(ctx: PluginContext): Permission[];
    getAdminNavItems(ctx: PluginContext): AdminNavItem[];
    getSettingsPanels(ctx: PluginContext): SettingsPanel[];
}
//# sourceMappingURL=index.d.ts.map