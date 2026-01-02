import { PrismaClient } from '@cms/shared';
import * as fs from 'fs/promises';
import * as path from 'path';

export class I18nService {
  private langDir: string;

  constructor(
    private db: PrismaClient,
    options?: { langDir?: string }
  ) {
    this.langDir = options?.langDir || path.join(process.cwd(), 'lang');
  }

  async getTranslation(
    key: string,
    locale: string,
    params?: Record<string, any>
  ): Promise<string> {
    const [group, ...keyParts] = key.split('.');
    const keyPath = keyParts.join('.');

    try {
      const filePath = path.join(this.langDir, locale, `${group}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      const translations = JSON.parse(content);

      let value = translations;
      for (const part of keyPath.split('.')) {
        value = value?.[part];
      }

      if (typeof value !== 'string') {
        return key; // Return key if translation not found
      }

      // Interpolate parameters
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, param) => {
          return params[param] || match;
        });
      }

      return value;
    } catch (error) {
      // If file doesn't exist or key not found, return key
      return key;
    }
  }

  async updateTranslation(
    key: string,
    locale: string,
    value: string
  ): Promise<void> {
    const [group, ...keyParts] = key.split('.');
    const keyPath = keyParts.join('.');

    const filePath = path.join(this.langDir, locale, `${group}.json`);
    const dirPath = path.dirname(filePath);

    // Ensure directory exists
    await fs.mkdir(dirPath, { recursive: true });

    // Read existing translations
    let translations: any = {};
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      translations = JSON.parse(content);
    } catch {
      // File doesn't exist, start with empty object
    }

    // Set nested value
    const keys = keyPath.split('.');
    let current = translations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf-8');
  }

  async getTranslations(locale: string, group?: string): Promise<Record<string, any>> {
    if (group) {
      const filePath = path.join(this.langDir, locale, `${group}.json`);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      } catch {
        return {};
      }
    }

    // Get all translation files
    const dirPath = path.join(this.langDir, locale);
    try {
      const files = await fs.readdir(dirPath);
      const translations: Record<string, any> = {};

      for (const file of files) {
        if (file.endsWith('.json')) {
          const groupName = file.replace('.json', '');
          const filePath = path.join(dirPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          translations[groupName] = JSON.parse(content);
        }
      }

      return translations;
    } catch {
      return {};
    }
  }

  async getDefaultLocale(): Promise<string> {
    const language = await this.db.language.findFirst({
      where: { langIsDefault: true },
    });
    return language?.langCode || 'en';
  }

  async getLocales(): Promise<Array<{ code: string; name: string; isDefault: boolean }>> {
    const languages = await this.db.language.findMany({
      orderBy: { langOrder: 'asc' },
    });

    return languages.map((lang) => ({
      code: lang.langCode,
      name: lang.langName,
      isDefault: lang.langIsDefault,
    }));
  }
}

