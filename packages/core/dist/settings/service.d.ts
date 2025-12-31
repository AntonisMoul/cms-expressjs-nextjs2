import { PrismaClient } from '@prisma/client';
import { Setting } from '@cms/shared';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaClient);
    get(key: string, defaultValue?: string): Promise<string | null>;
    set(key: string, value: string | null): Promise<Setting>;
    delete(key: string): Promise<void>;
    getAll(): Promise<Record<string, string>>;
    getByPrefix(prefix: string): Promise<Record<string, string>>;
    setMultiple(settings: Record<string, string | null>): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map