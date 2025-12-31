export interface Locale {
  id: number;
  code: string;
  name: string;
  flag?: string | null;
  isDefault: boolean;
  isActive: boolean;
  order: number;
  isRtl: boolean;
}

export interface LocaleCreateData {
  code: string;
  name: string;
  flag?: string;
  isDefault?: boolean;
  isActive?: boolean;
  order?: number;
  isRtl?: boolean;
}

export interface LocaleUpdateData {
  name?: string;
  flag?: string;
  isDefault?: boolean;
  isActive?: boolean;
  order?: number;
  isRtl?: boolean;
}

export const DEFAULT_LOCALES = [
  { code: 'en', name: 'English', flag: 'us' as string | null, isDefault: true, isActive: true, order: 1, isRtl: false },
  { code: 'el', name: 'Ελληνικά', flag: 'gr' as string | null, isDefault: false, isActive: true, order: 2, isRtl: false },
] as const;
