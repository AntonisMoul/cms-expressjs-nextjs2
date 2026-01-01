import { PrismaClient } from '@prisma/client';
import { Language } from '../types';

export class LocalesService {
  constructor(private prisma: PrismaClient) {}

  async createLanguage(data: {
    name: string;
    locale: string;
    code: string;
    flag?: string;
    isDefault?: boolean;
    order?: number;
    isRTL?: boolean;
  }): Promise<Language> {
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

  async updateLanguage(id: string, data: {
    name?: string;
    locale?: string;
    code?: string;
    flag?: string;
    isDefault?: boolean;
    order?: number;
    isRTL?: boolean;
  }): Promise<Language> {
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

  async deleteLanguage(id: string): Promise<void> {
    await this.prisma.language.delete({
      where: { id },
    });
  }

  async getLanguageById(id: string): Promise<Language | null> {
    const language = await this.prisma.language.findUnique({
      where: { id },
    });

    if (!language) return null;

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

  async getLanguageByLocale(locale: string): Promise<Language | null> {
    const language = await this.prisma.language.findUnique({
      where: { locale },
    });

    if (!language) return null;

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

  async getAllLanguages(): Promise<Language[]> {
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

  async getActiveLanguages(): Promise<Language[]> {
    // For now, all languages are active. In the future, we might add an isActive field
    return this.getAllLanguages();
  }

  async getDefaultLanguage(): Promise<Language | null> {
    const language = await this.prisma.language.findFirst({
      where: { isDefault: true },
    });

    if (!language) return null;

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

  async setDefaultLanguage(id: string): Promise<void> {
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
  async getCurrentLocale(): Promise<string> {
    const defaultLanguage = await this.getDefaultLanguage();
    return defaultLanguage?.locale || 'en';
  }

  async isValidLocale(locale: string): Promise<boolean> {
    const language = await this.getLanguageByLocale(locale);
    return !!language;
  }

  async getLanguageName(locale: string): Promise<string> {
    const language = await this.getLanguageByLocale(locale);
    return language?.name || locale;
  }

  async getSupportedLocales(): Promise<string[]> {
    const languages = await this.getActiveLanguages();
    return languages.map(lang => lang.locale);
  }
}

