import { PrismaClient } from '@prisma/client';
import {
  Language,
  Translation,
  TranslationGroup,
  TranslationKey,
  TranslationStats,
  TranslationContext,
  CreateLanguageRequest,
  UpdateLanguageRequest,
  CreateTranslationRequest,
  UpdateTranslationRequest,
  BulkTranslationUpdate,
  CreateTranslationGroupRequest,
  UpdateTranslationGroupRequest,
  CreateTranslationKeyRequest,
  UpdateTranslationKeyRequest,
  TranslationExport,
  TranslationImport,
  TranslationFile,
  FlatTranslationFile
} from '../models/types';

const prisma = new PrismaClient();

export class TranslationService {
  // Language management
  async getLanguages(): Promise<Language[]> {
    return await prisma.language.findMany({
      orderBy: { sort_order: 'asc' }
    });
  }

  async getActiveLanguages(): Promise<Language[]> {
    return await prisma.language.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' }
    });
  }

  async getDefaultLanguage(): Promise<Language | null> {
    return await prisma.language.findFirst({
      where: { is_default: true }
    });
  }

  async createLanguage(data: CreateLanguageRequest): Promise<Language> {
    // If this is set as default, unset other defaults
    if (data.is_default) {
      await prisma.language.updateMany({
        where: { is_default: true },
        data: { is_default: false }
      });
    }

    return await prisma.language.create({
      data: {
        code: data.code,
        name: data.name,
        native_name: data.native_name,
        flag: data.flag,
        is_active: data.is_active !== false,
        is_default: data.is_default || false,
        sort_order: data.sort_order || 0
      }
    });
  }

  async updateLanguage(id: number, data: UpdateLanguageRequest): Promise<Language> {
    // If this is set as default, unset other defaults
    if (data.is_default) {
      await prisma.language.updateMany({
        where: {
          is_default: true,
          id: { not: id }
        },
        data: { is_default: false }
      });
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.native_name !== undefined) updateData.native_name = data.native_name;
    if (data.flag !== undefined) updateData.flag = data.flag;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;
    if (data.is_default !== undefined) updateData.is_default = data.is_default;
    if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;

    return await prisma.language.update({
      where: { id },
      data: updateData
    });
  }

  async deleteLanguage(id: number): Promise<void> {
    await prisma.language.delete({
      where: { id }
    });
  }

  // Translation management
  async getTranslations(languageId?: number): Promise<Translation[]> {
    const where = languageId ? { language_id: languageId } : {};
    return await prisma.translation.findMany({
      where,
      include: {
        language: true
      },
      orderBy: { key: 'asc' }
    });
  }

  async getTranslation(languageId: number, key: string): Promise<Translation | null> {
    return await prisma.translation.findUnique({
      where: {
        language_id_key: {
          language_id: languageId,
          key: key
        }
      },
      include: {
        language: true
      }
    });
  }

  async createTranslation(data: CreateTranslationRequest): Promise<Translation> {
    return await prisma.translation.create({
      data: {
        language_id: data.language_id,
        key: data.key,
        value: data.value,
        context: data.context,
        is_translated: data.is_translated !== false
      },
      include: {
        language: true
      }
    });
  }

  async updateTranslation(languageId: number, key: string, data: UpdateTranslationRequest): Promise<Translation> {
    const updateData: any = {};
    if (data.value) updateData.value = data.value;
    if (data.context !== undefined) updateData.context = data.context;
    if (data.is_translated !== undefined) updateData.is_translated = data.is_translated;

    return await prisma.translation.update({
      where: {
        language_id_key: {
          language_id: languageId,
          key: key
        }
      },
      data: updateData,
      include: {
        language: true
      }
    });
  }

  async deleteTranslation(languageId: number, key: string): Promise<void> {
    await prisma.translation.delete({
      where: {
        language_id_key: {
          language_id: languageId,
          key: key
        }
      }
    });
  }

  async bulkUpdateTranslations(data: BulkTranslationUpdate): Promise<void> {
    const updates = data.translations.map(translation =>
      prisma.translation.upsert({
        where: {
          language_id_key: {
            language_id: translation.language_id,
            key: translation.key
          }
        },
        update: {
          value: translation.value,
          is_translated: true
        },
        create: {
          language_id: translation.language_id,
          key: translation.key,
          value: translation.value,
          is_translated: true
        }
      })
    );

    await prisma.$transaction(updates);
  }

  // Translation key management
  async getTranslationKeys(): Promise<TranslationKey[]> {
    return await prisma.translationKey.findMany({
      include: {
        group: true
      },
      orderBy: { key: 'asc' }
    });
  }

  async createTranslationKey(data: CreateTranslationKeyRequest): Promise<TranslationKey> {
    return await prisma.translationKey.create({
      data: {
        key: data.key,
        group_id: data.group_id,
        context: data.context,
        default_value: data.default_value
      },
      include: {
        group: true
      }
    });
  }

  async updateTranslationKey(id: number, data: UpdateTranslationKeyRequest): Promise<TranslationKey> {
    const updateData: any = {};
    if (data.group_id !== undefined) updateData.group_id = data.group_id;
    if (data.context !== undefined) updateData.context = data.context;
    if (data.default_value !== undefined) updateData.default_value = data.default_value;

    return await prisma.translationKey.update({
      where: { id },
      data: updateData,
      include: {
        group: true
      }
    });
  }

  async deleteTranslationKey(id: number): Promise<void> {
    await prisma.translationKey.delete({
      where: { id }
    });
  }

  // Translation groups
  async getTranslationGroups(): Promise<TranslationGroup[]> {
    return await prisma.translationGroup.findMany({
      include: {
        keys: {
          orderBy: { key: 'asc' }
        }
      },
      orderBy: { sort_order: 'asc' }
    });
  }

  async createTranslationGroup(data: CreateTranslationGroupRequest): Promise<TranslationGroup> {
    return await prisma.translationGroup.create({
      data: {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order || 0
      }
    });
  }

  // Get translations for frontend
  async getTranslationContext(languageCode: string): Promise<TranslationContext | null> {
    const language = await prisma.language.findUnique({
      where: { code: languageCode }
    });

    if (!language) return null;

    const translations = await prisma.translation.findMany({
      where: {
        language_id: language.id,
        is_translated: true
      }
    });

    const translationMap: Record<string, string> = {};
    translations.forEach(translation => {
      translationMap[translation.key] = translation.value;
    });

    return {
      language,
      translations: translationMap,
      isDefault: language.is_default
    };
  }

  // Translation statistics
  async getTranslationStats(): Promise<TranslationStats> {
    const [languages, translations, translationKeys] = await Promise.all([
      prisma.language.findMany(),
      prisma.translation.findMany(),
      prisma.translationKey.findMany()
    ]);

    const activeLanguages = languages.filter(lang => lang.is_active);
    const defaultLanguage = languages.find(lang => lang.is_default);

    // Calculate per-language stats
    const byLanguage: Record<number, { total: number; translated: number; percentage: number }> = {};
    languages.forEach(lang => {
      const langTranslations = translations.filter(t => t.language_id === lang.id);
      const translated = langTranslations.filter(t => t.is_translated).length;
      const total = langTranslations.length;
      const percentage = total > 0 ? Math.round((translated / total) * 100) : 0;

      byLanguage[lang.id] = { total, translated, percentage };
    });

    // Calculate group stats
    const byGroup: Record<number, number> = {};
    translationKeys.forEach(key => {
      if (key.group_id) {
        byGroup[key.group_id] = (byGroup[key.group_id] || 0) + 1;
      }
    });

    return {
      languages: {
        total: languages.length,
        active: activeLanguages.length,
        default: defaultLanguage?.code
      },
      translations: {
        total: translations.length,
        translated: translations.filter(t => t.is_translated).length,
        untranslated: translations.filter(t => !t.is_translated).length,
        byLanguage
      },
      keys: {
        total: translationKeys.length,
        byGroup
      }
    };
  }

  // Import/Export functionality
  async exportTranslations(): Promise<TranslationExport> {
    const [languages, groups, keys, translations] = await Promise.all([
      prisma.language.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.translationGroup.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.translationKey.findMany({ orderBy: { key: 'asc' } }),
      prisma.translation.findMany({
        include: { language: true },
        orderBy: { key: 'asc' }
      })
    ]);

    return {
      languages,
      groups,
      keys,
      translations
    };
  }

  async importTranslations(data: TranslationImport): Promise<void> {
    const operations: any[] = [];

    // Import languages
    if (data.languages) {
      data.languages.forEach(lang => {
        operations.push(
          prisma.language.upsert({
            where: { code: lang.code! },
            update: lang,
            create: lang as any
          })
        );
      });
    }

    // Import groups
    if (data.groups) {
      data.groups.forEach(group => {
        operations.push(
          prisma.translationGroup.upsert({
            where: { name: group.name! },
            update: group,
            create: group as any
          })
        );
      });
    }

    // Import keys
    if (data.keys) {
      data.keys.forEach(key => {
        operations.push(
          prisma.translationKey.upsert({
            where: { key: key.key! },
            update: key,
            create: key as any
          })
        );
      });
    }

    // Import translations
    if (data.translations) {
      data.translations.forEach(translation => {
        operations.push(
          prisma.translation.upsert({
            where: {
              language_id_key: {
                language_id: translation.language_id!,
                key: translation.key!
              }
            },
            update: translation,
            create: translation as any
          })
        );
      });
    }

    await prisma.$transaction(operations);
  }

  // Convert to file formats
  async exportToFile(languageCode: string): Promise<FlatTranslationFile> {
    const context = await this.getTranslationContext(languageCode);
    return context?.translations || {};
  }

  async importFromFile(languageCode: string, translations: FlatTranslationFile): Promise<void> {
    const language = await prisma.language.findUnique({
      where: { code: languageCode }
    });

    if (!language) {
      throw new Error(`Language ${languageCode} not found`);
    }

    const updates = Object.entries(translations).map(([key, value]) =>
      prisma.translation.upsert({
        where: {
          language_id_key: {
            language_id: language.id,
            key
          }
        },
        update: {
          value,
          is_translated: true
        },
        create: {
          language_id: language.id,
          key,
          value,
          is_translated: true
        }
      })
    );

    await prisma.$transaction(updates);
  }

  // Auto-populate missing translations from default language
  async populateMissingTranslations(targetLanguageId: number): Promise<void> {
    const defaultLanguage = await this.getDefaultLanguage();
    if (!defaultLanguage) return;

    const defaultTranslations = await this.getTranslations(defaultLanguage.id);
    const targetTranslations = await this.getTranslations(targetLanguageId);

    const existingKeys = new Set(targetTranslations.map(t => t.key));
    const missingTranslations = defaultTranslations.filter(t => !existingKeys.has(t.key));

    const creates = missingTranslations.map(translation =>
      prisma.translation.create({
        data: {
          language_id: targetLanguageId,
          key: translation.key,
          value: translation.value, // Copy default value
          is_translated: false // Mark as not translated
        }
      })
    );

    if (creates.length > 0) {
      await prisma.$transaction(creates);
    }
  }
}
