// Plugin system
export * from './types/plugin';

// Authentication
export * from './types/auth';

// Content management
export * from './types/slug';

// Localization
export * from './types/locale';

// Settings
export * from './types/settings';

// Audit logging
export * from './types/audit';

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
