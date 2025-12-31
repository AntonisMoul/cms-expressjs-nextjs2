import { Redirect as PrismaRedirect, CacheEntry as PrismaCacheEntry, SitemapEntry as PrismaSitemapEntry, SystemLog as PrismaSystemLog } from '@prisma/client';

export type Redirect = PrismaRedirect;

export type CacheEntry = PrismaCacheEntry;

export type SitemapEntry = PrismaSitemapEntry;

export type SystemLog = PrismaSystemLog;

// Redirect types
export enum RedirectStatusCode {
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308
}

// Cache types
export interface CacheData {
  key: string;
  value: any;
  tags?: string[];
  ttl?: number; // seconds
}

// Sitemap types
export enum ChangeFrequency {
  ALWAYS = 'always',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  NEVER = 'never'
}

export interface SitemapUrl {
  url: string;
  lastmod?: Date;
  changefreq?: ChangeFrequency;
  priority?: number;
}

// System maintenance types
export interface SystemInfo {
  version: string;
  environment: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    status: 'connected' | 'disconnected';
    queryCount?: number;
  };
}

export interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number; // seconds
  execute: () => Promise<void>;
}

// API request/response types
export interface CreateRedirectRequest {
  from_url: string;
  to_url: string;
  status_code?: RedirectStatusCode;
  is_active?: boolean;
}

export interface UpdateRedirectRequest {
  from_url?: string;
  to_url?: string;
  status_code?: RedirectStatusCode;
  is_active?: boolean;
}

export interface CreateCacheEntryRequest {
  key: string;
  value: any;
  tags?: string[];
  ttl?: number;
}

export interface CreateSitemapEntryRequest {
  url: string;
  lastmod?: Date;
  changefreq?: ChangeFrequency;
  priority?: number;
  entity_type?: string;
  entity_id?: number;
  is_active?: boolean;
}

export interface UpdateSitemapEntryRequest {
  url?: string;
  lastmod?: Date;
  changefreq?: ChangeFrequency;
  priority?: number;
  entity_type?: string;
  entity_id?: number;
  is_active?: boolean;
}

export interface LogSystemEventRequest {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  context?: Record<string, any>;
  user_id?: number;
  ip_address?: string;
  user_agent?: string;
}

// Bulk operations
export interface BulkRedirectUpdate {
  ids: number[];
  updates: UpdateRedirectRequest;
}

export interface BulkCacheClear {
  tags?: string[];
  pattern?: string;
}

// Statistics
export interface SystemStats {
  redirects: {
    total: number;
    active: number;
    hits: number;
  };
  cache: {
    entries: number;
    size: number; // estimated bytes
  };
  sitemap: {
    urls: number;
    lastGenerated?: Date;
  };
  logs: {
    errors: number;
    warnings: number;
    today: number;
  };
}
