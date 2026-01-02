// Common types used across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface PluginContext {
  db: any; // PrismaClient
  queue: any; // QueueService
  events: any; // EventService
  settings: any; // SettingsService
  auth: any; // AuthService
  rbac: any; // RBACService
  slug: any; // SlugService
  i18n: any; // I18nService
}

export interface Permission {
  name: string;
  description?: string;
}

export interface AdminNavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: AdminNavItem[];
  permission?: string;
  order?: number;
}

export interface AdminScreen {
  path: string;
  component: any; // React component
  permission?: string;
}

export interface SettingsPanel {
  id: string;
  title: string;
  description?: string;
  component: any; // React component
  permission?: string;
  order?: number;
}

export interface EventHandler {
  event: string;
  handler: (payload: any, ctx: PluginContext) => Promise<void> | void;
}

export interface JobHandler {
  name: string;
  handler: (payload: any, ctx: PluginContext) => Promise<void>;
  maxAttempts?: number;
  backoff?: number;
}

export interface Plugin {
  name: string;
  version: string;
  description?: string;
  initialize(ctx: PluginContext): Promise<void>;
  registerRoutes?(router: any, ctx: PluginContext, requireAuth?: any, requirePermission?: any): void;
  getPermissions?(ctx: PluginContext): Permission[];
  getAdminNavItems?(ctx: PluginContext): AdminNavItem[];
  getAdminScreens?(ctx: PluginContext): AdminScreen[];
  getSettingsPanels?(ctx: PluginContext): SettingsPanel[];
  getEventHandlers?(ctx: PluginContext): EventHandler[];
  getJobHandlers?(ctx: PluginContext): JobHandler[];
}

