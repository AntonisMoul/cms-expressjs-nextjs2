"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalesService = void 0;
class LocalesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLanguage(data) {
        // If setting as default, unset other defaults
        if (data.isDefault) {
            await this.prisma.language.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }
        const language = await this.prisma.language.create({
            data: {
                name: data.name,
                locale: data.locale,
                code: data.code,
                flag: data.flag,
                isDefault: data.isDefault || false,
                order: data.order || 0,
                isRTL: data.isRTL || false,
            },
        });
        return {
            id: language.id,
            name: language.name,
            locale: language.locale,
            code: language.code,
            flag: language.flag,
            isDefault: language.isDefault,
            order: language.order,
            isRTL: language.isRTL,
        };
    }
    async updateLanguage(id, data) {
        // If setting as default, unset other defaults
        if (data.isDefault) {
            await this.prisma.language.updateMany({
                where: {
                    isDefault: true,
                    id: { not: id },
                },
                data: { isDefault: false },
            });
        }
        const language = await this.prisma.language.update({
            where: { id },
            data,
        });
        return {
            id: language.id,
            name: language.name,
            locale: language.locale,
            code: language.code,
            flag: language.flag,
            isDefault: language.isDefault,
            order: language.order,
            isRTL: language.isRTL,
        };
    }
    async deleteLanguage(id) {
        await this.prisma.language.delete({
            where: { id },
        });
    }
    async getLanguageById(id) {
        const language = await this.prisma.language.findUnique({
            where: { id },
        });
        if (!language)
            return null;
        return {
            id: language.id,
            name: language.name,
            locale: language.locale,
            code: language.code,
            flag: language.flag,
            isDefault: language.isDefault,
            order: language.order,
            isRTL: language.isRTL,
        };
    }
    async getLanguageByLocale(locale) {
        const language = await this.prisma.language.findUnique({
            where: { locale },
        });
        if (!language)
            return null;
        return {
            id: language.id,
            name: language.name,
            locale: language.locale,
            code: language.code,
            flag: language.flag,
            isDefault: language.isDefault,
            order: language.order,
            isRTL: language.isRTL,
        };
    }
    async getAllLanguages() {
        const languages = await this.prisma.language.findMany({
            orderBy: [
                { isDefault: 'desc' },
                { order: 'asc' },
                { name: 'asc' },
            ],
        });
        return languages.map(language => ({
            id: language.id,
            name: language.name,
            locale: language.locale,
            code: language.code,
            flag: language.flag,
            isDefault: language.isDefault,
            order: language.order,
            isRTL: language.isRTL,
        }));
    }
    async getActiveLanguages() {
        // For now, all languages are active. In the future, we might add an isActive field
        return this.getAllLanguages();
    }
    async getDefaultLanguage() {
        const language = await this.prisma.language.findFirst({
            where: { isDefault: true },
        });
        if (!language)
            return null;
        return {
            id: language.id,
            name: language.name,
            locale: language.locale,
            code: language.code,
            flag: language.flag,
            isDefault: language.isDefault,
            order: language.order,
            isRTL: language.isRTL,
        };
    }
    async setDefaultLanguage(id) {
        await this.prisma.$transaction([
            this.prisma.language.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            }),
            this.prisma.language.update({
                where: { id },
                data: { isDefault: true },
            }),
        ]);
    }
    // Helper methods for common operations
    async getCurrentLocale() {
        const defaultLanguage = await this.getDefaultLanguage();
        return defaultLanguage?.locale || 'en';
    }
    async isValidLocale(locale) {
        const language = await this.getLanguageByLocale(locale);
        return !!language;
    }
    async getLanguageName(locale) {
        const language = await this.getLanguageByLocale(locale);
        return language?.name || locale;
    }
    async getSupportedLocales() {
        const languages = await this.getActiveLanguages();
        return languages.map(lang => lang.locale);
    }
}
exports.LocalesService = LocalesService;
//# sourceMappingURL=service.js.map