import { Plugin, PluginContext, Permission, AdminNavItem, EventHandler, JobHandler } from '@cms/shared';
export declare class BlogPlugin implements Plugin {
    name: string;
    version: string;
    description: string;
    initialize(ctx: PluginContext): Promise<void>;
    registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void;
    getPermissions(ctx: PluginContext): Permission[];
    getAdminNavItems(ctx: PluginContext): AdminNavItem[];
    getEventHandlers(ctx: PluginContext): EventHandler[];
    getJobHandlers(ctx: PluginContext): JobHandler[];
}
//# sourceMappingURL=index.d.ts.map