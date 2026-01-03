import { Plugin, PluginContext, Permission, AdminNavItem, JobHandler } from '@cms/shared';
export declare class MediaPlugin implements Plugin {
    name: string;
    version: string;
    description: string;
    initialize(ctx: PluginContext): Promise<void>;
    registerRoutes(router: any, ctx: PluginContext, requireAuth: any, requirePermission: any): void;
    getPermissions(ctx: PluginContext): Permission[];
    getAdminNavItems(ctx: PluginContext): AdminNavItem[];
    getJobHandlers(ctx: PluginContext): JobHandler[];
}
//# sourceMappingURL=index.d.ts.map