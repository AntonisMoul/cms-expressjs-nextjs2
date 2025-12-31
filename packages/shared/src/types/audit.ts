export interface AuditLog {
  id: number;
  userId: number;
  module: string;
  action: string;
  referenceUser: number;
  referenceId: number;
  referenceName: string;
  request?: string;
  userAgent?: string;
  ipAddress?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogCreateData {
  userId: number;
  module: string;
  action: string;
  referenceUser: number;
  referenceId: number;
  referenceName: string;
  request?: string;
  userAgent?: string;
  ipAddress?: string;
  type: string;
}

export const AUDIT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  PUBLISH: 'publish',
  UNPUBLISH: 'unpublish',
  LOGIN: 'login',
  LOGOUT: 'logout',
  VIEW: 'view',
} as const;

export const AUDIT_MODULES = {
  USERS: 'users',
  ROLES: 'roles',
  PAGES: 'pages',
  POSTS: 'posts',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  MEDIA: 'media',
  MENUS: 'menus',
  WIDGETS: 'widgets',
  SETTINGS: 'settings',
  LOCALES: 'locales',
  THEMES: 'themes',
} as const;
