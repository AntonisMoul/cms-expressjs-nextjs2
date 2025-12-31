import { Theme as PrismaTheme, ThemeOption as PrismaThemeOption, ThemeSetting as PrismaThemeSetting } from '@prisma/client';

export type Theme = PrismaTheme & {
  options?: ThemeOption[];
  settings?: ThemeSetting[];
};

export type ThemeOption = PrismaThemeOption;

export type ThemeSetting = PrismaThemeSetting;

// Theme option types
export enum ThemeOptionType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  COLOR = 'color',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  IMAGE = 'image',
  FILE = 'file',
  TEXTAREA = 'textarea',
  CODE = 'code'
}

// Theme sections
export enum ThemeSection {
  GENERAL = 'general',
  COLORS = 'colors',
  TYPOGRAPHY = 'typography',
  LAYOUT = 'layout',
  HEADER = 'header',
  FOOTER = 'footer',
  SIDEBAR = 'sidebar',
  BLOG = 'blog',
  CUSTOM = 'custom'
}

// Theme status
export enum ThemeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Theme option configuration
export interface ThemeOptionConfig {
  type: ThemeOptionType;
  label: string;
  description?: string;
  default_value?: any;
  options?: { label: string; value: any }[]; // For select/multiselect
  min?: number; // For number type
  max?: number; // For number type
  step?: number; // For number type
  placeholder?: string; // For text/textarea
  rows?: number; // For textarea
  language?: string; // For code type
  required?: boolean;
  priority?: number;
}

// Complete theme option with config
export interface ThemeOptionWithConfig extends ThemeOption {
  config: ThemeOptionConfig;
}

// Theme definition (for theme files)
export interface ThemeDefinition {
  name: string;
  description?: string;
  version: string;
  author?: string;
  author_url?: string;
  tags?: string[];
  image?: string;
  options?: Record<string, Record<string, ThemeOptionConfig>>;
}

// API request/response types
export interface CreateThemeRequest {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  author_url?: string;
  folder: string;
  image?: string;
  tags?: string;
}

export interface UpdateThemeRequest {
  name?: string;
  description?: string;
  version?: string;
  author?: string;
  author_url?: string;
  folder?: string;
  status?: string;
  image?: string;
  tags?: string;
}

export interface CreateThemeOptionRequest {
  theme_id: number;
  section: string;
  key: string;
  type?: string;
  label: string;
  description?: string;
  default_value?: string;
  options?: string;
  priority?: number;
}

export interface UpdateThemeOptionRequest {
  section?: string;
  key?: string;
  type?: string;
  label?: string;
  description?: string;
  default_value?: string;
  options?: string;
  priority?: number;
}

export interface UpdateThemeSettingRequest {
  value: any;
}

// Theme with full configuration
export interface ThemeWithConfig extends Theme {
  options: ThemeOptionWithConfig[];
  settings: ThemeSetting[];
  activeSettings: Record<string, any>; // Flattened settings for easy access
}

// Active theme info
export interface ActiveThemeInfo {
  theme: Theme;
  settings: Record<string, any>;
}

// Theme installation result
export interface ThemeInstallationResult {
  success: boolean;
  theme?: Theme;
  errors?: string[];
  warnings?: string[];
}
