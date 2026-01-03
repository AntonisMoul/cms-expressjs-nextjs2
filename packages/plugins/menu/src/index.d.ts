import { Plugin, PluginContext, Permission, AdminNavItem } from '@cms/shared';
export declare class MenuPlugin implements Plugin {
    name: string;
    version: string;
    description: string;
    initialize(ctx: PluginContext): Promise<void>;
    registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void;
    getPermissions(ctx: PluginContext): Permission[];
    getAdminNavItems(ctx: PluginContext): AdminNavItem[];
}
//# sourceMappingURL=index.d.ts.map