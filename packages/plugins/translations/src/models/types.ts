import { Language as PrismaLanguage, Translation as PrismaTranslation, TranslationGroup as PrismaTranslationGroup, TranslationKey as PrismaTranslationKey } from '@prisma/client';

export type Language = PrismaLanguage;

export type Translation = PrismaTranslation & {
  language?: Language;
};

export type TranslationGroup = PrismaTranslationGroup & {
  keys?: TranslationKey[];
};

export type TranslationKey = PrismaTranslationKey & {
  group?: TranslationGroup;
};

// Translation file formats
export interface TranslationFile {
  [key: string]: string | TranslationFile;
}

export interface FlatTranslationFile {
  [key: string]: string;
}

// Import/Export formats
export interface TranslationExport {
  languages: Language[];
  groups: TranslationGroup[];
  keys: TranslationKey[];
  translations: Translation[];
}

export interface TranslationImport {
  languages?: Partial<Language>[];
  groups?: Partial<TranslationGroup>[];
  keys?: Partial<TranslationKey>[];
  translations?: Partial<Translation>[];
}

// API request/response types
export interface CreateLanguageRequest {
  code: string;
  name: string;
  native_name?: string;
  flag?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateLanguageRequest {
  name?: string;
  native_name?: string;
  flag?: string;
  is_active?: boolean;
  is_default?: boolean;
  sort_order?: number;
}

export interface CreateTranslationRequest {
  language_id: number;
  key: string;
  value: string;
  context?: string;
  is_translated?: boolean;
}

export interface UpdateTranslationRequest {
  value?: string;
  context?: string;
  is_translated?: boolean;
}

export interface BulkTranslationUpdate {
  translations: Array<{
    language_id: number;
    key: string;
    value: string;
  }>;
}

export interface CreateTranslationGroupRequest {
  name: string;
  description?: string;
  sort_order?: number;
}

export interface UpdateTranslationGroupRequest {
  name?: string;
  description?: string;
  sort_order?: number;
}

export interface CreateTranslationKeyRequest {
  key: string;
  group_id?: number;
  context?: string;
  default_value?: string;
}

export interface UpdateTranslationKeyRequest {
  group_id?: number;
  context?: string;
  default_value?: string;
}

// Statistics and analytics
export interface TranslationStats {
  languages: {
    total: number;
    active: number;
    default?: string;
  };
  translations: {
    total: number;
    translated: number;
    untranslated: number;
    byLanguage: Record<number, {
      total: number;
      translated: number;
      percentage: number;
    }>;
  };
  keys: {
    total: number;
    byGroup: Record<number, number>;
  };
}

// Translation context for frontend
export interface TranslationContext {
  language: Language;
  translations: Record<string, string>;
  isDefault: boolean;
}

// i18n configuration
export interface I18nConfig {
  defaultLanguage: string;
  fallbackLanguage: string;
  supportedLanguages: string[];
  namespaces: string[];
  loadPath: string;
}

// Translation scanning results
export interface TranslationScanResult {
  found: string[]; // Keys found in code
  missing: string[]; // Keys not translated
  unused: string[]; // Keys in database but not in code
  suggestions: Record<string, string>; // Suggested translations
}
