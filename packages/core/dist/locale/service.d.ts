import { PrismaClient } from '@prisma/client';
import { Locale, LocaleCreateData, LocaleUpdateData } from '@cms/shared';
export declare class LocaleService {
    private prisma;
    constructor(prisma: PrismaClient);
    getAll(): Promise<Locale[]>;
    getActive(): Promise<Locale[]>;
    getDefault(): Promise<Locale | null>;
    getByCode(code: string): Promise<Locale | null>;
    create(data: LocaleCreateData): Promise<Locale>;
    update(id: number, data: LocaleUpdateData): Promise<Locale>;
    delete(id: number): Promise<void>;
    setDefault(id: number): Promise<void>;
    seedDefaultLocales(): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map