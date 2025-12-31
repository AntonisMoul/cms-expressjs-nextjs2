import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
export interface Plugin {
    name: string;
    version: string;
    description?: string;
    registerApiRoutes?: (router: Router, context: PluginContext) => void;
    permissions?: PermissionDefinition[];
    adminNavigation?: AdminNavigationItem[];
    settingsPanels?: SettingsPanel[];
    init?: (context: PluginContext) => Promise<void> | void;
    destroy?: () => Promise<void> | void;
}
export interface PluginContext {
    prisma: PrismaClient;
    config: Config;
    logger: Logger;
    cache: Cache;
}
export interface PermissionDefinition {
    key: string;
    name: string;
    module: string;
    description?: string;
}
export interface AdminNavigationItem {
    id: string;
    name: string;
    icon?: string;
    route: string;
    permissions?: string[];
    priority?: number;
    parentId?: string;
    children?: AdminNavigationItem[];
}
export interface SettingsPanel {
    id: string;
    title: string;
    route: string;
    permissions?: string[];
    component: string;
    priority?: number;
}
export interface Config {
    get<T>(key: string, defaultValue?: T): T;
    set(key: string, value: any): void;
}
export interface Logger {
    info(message: string, meta?: any): void;
    error(message: string, error?: Error, meta?: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}
export interface Cache {
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=plugin.d.ts.map