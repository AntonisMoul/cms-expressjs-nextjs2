export interface Slug {
  id: number;
  key: string;
  referenceId: number;
  referenceType: string;
  prefix?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SlugCheckRequest {
  entityType: string;
  locale: string;
  slug: string;
  excludeId?: number;
}

export interface SlugCheckResponse {
  available: boolean;
  suggestion?: string;
  message?: string;
}

export interface SlugCreateData {
  entityType: string;
  entityId: number;
  locale: string;
  key: string;
  prefix?: string;
}

export interface SlugUpdateData {
  key: string;
  prefix?: string;
}

export const SLUG_PREFIXES = {
  POSTS: 'blog',
  PAGES: null,
  CATEGORIES: null,
  TAGS: 'tag',
  GALLERIES: 'galleries',
} as const;

export interface SlugRedirect {
  id: number;
  oldSlug: string;
  newSlug: string;
  entityType: string;
  entityId: number;
  locale: string;
  createdAt: Date;
}
