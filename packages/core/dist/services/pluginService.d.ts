import { Plugin } from '@cms/shared';
import { PrismaClient } from '@prisma/client';
export declare class PluginService {
    private plugins;
    private prisma;
    private authMiddleware;
    constructor(prisma: PrismaClient);
    registerPlugin(plugin: Plugin): Promise<void>;
    getPlugins(): Plugin[];
    getPermissions(): string[];
    getNavigationItems(): any[];
    getSettingsPanels(): any[];
    registerApiRoutes(router: any): void;
}
//# sourceMappingURL=pluginService.d.ts.map