import { PrismaClient } from '@prisma/client';
import { Setting, SettingGroup } from '../types';
export declare class SettingsService {
    private prisma;
    private cache;
    constructor(prisma: PrismaClient);
    get(key: string, defaultValue?: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    getAll(): Promise<Setting[]>;
    getGroup(prefix: string): Promise<SettingGroup[]>;
    setGroup(settings: Record<string, string>): Promise<void>;
    clearCache(): Promise<void>;
    getSiteName(): Promise<string>;
    getSiteDescription(): Promise<string>;
    getSiteUrl(): Promise<string>;
    isMaintenanceMode(): Promise<boolean>;
    getTimezone(): Promise<string>;
    getDateFormat(): Promise<string>;
    getTimeFormat(): Promise<string>;
    getDefaultLocale(): Promise<string>;
}
//# sourceMappingURL=service.d.ts.map