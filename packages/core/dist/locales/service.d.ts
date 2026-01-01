import { PrismaClient } from '@prisma/client';
import { Language } from '../types';
export declare class LocalesService {
    private prisma;
    constructor(prisma: PrismaClient);
    createLanguage(data: {
        name: string;
        locale: string;
        code: string;
        flag?: string;
        isDefault?: boolean;
        order?: number;
        isRTL?: boolean;
    }): Promise<Language>;
    updateLanguage(id: string, data: {
        name?: string;
        locale?: string;
        code?: string;
        flag?: string;
        isDefault?: boolean;
        order?: number;
        isRTL?: boolean;
    }): Promise<Language>;
    deleteLanguage(id: string): Promise<void>;
    getLanguageById(id: string): Promise<Language | null>;
    getLanguageByLocale(locale: string): Promise<Language | null>;
    getAllLanguages(): Promise<Language[]>;
    getActiveLanguages(): Promise<Language[]>;
    getDefaultLanguage(): Promise<Language | null>;
    setDefaultLanguage(id: string): Promise<void>;
    getCurrentLocale(): Promise<string>;
    isValidLocale(locale: string): Promise<boolean>;
    getLanguageName(locale: string): Promise<string>;
    getSupportedLocales(): Promise<string[]>;
}
//# sourceMappingURL=service.d.ts.map