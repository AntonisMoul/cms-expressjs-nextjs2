import { User } from '@cms/shared';
export interface Page {
    id: number;
    name: string;
    content?: string | null;
    userId?: number | null;
    image?: string | null;
    template?: string | null;
    isFeatured: boolean;
    description?: string | null;
    status: string;
    translationGroupId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: User | null;
    translations?: PageTranslation[];
    meta?: PageMeta[];
}
export interface PageTranslation {
    langCode: string;
    pagesId: number;
    name?: string | null;
    description?: string | null;
    content?: string | null;
    page?: Page;
}
export interface PageMeta {
    id: number;
    key: string;
    value?: string | null;
    pageId: number;
    createdAt: Date;
    updatedAt: Date;
    page?: Page;
}
export interface PageCreateData {
    name: string;
    content?: string;
    userId?: number;
    image?: string;
    template?: string;
    isFeatured?: boolean;
    description?: string;
    status?: string;
    translationGroupId?: string;
    meta?: Record<string, any>;
}
export interface PageUpdateData {
    name?: string;
    content?: string;
    userId?: number;
    image?: string;
    template?: string;
    isFeatured?: boolean;
    description?: string;
    status?: string;
    meta?: Record<string, any>;
}
export interface PageTranslationCreateData {
    langCode: string;
    pagesId: number;
    name?: string;
    description?: string;
    content?: string;
}
export interface PageTranslationUpdateData {
    name?: string;
    description?: string;
    content?: string;
}
export interface PageFilters {
    status?: string;
    userId?: number;
    isFeatured?: boolean;
    search?: string;
    translationGroupId?: string;
}
export interface PageListOptions {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: PageFilters;
}
export interface PageListResponse {
    pages: Page[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}
export interface PageSeoData {
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: string;
    index?: 'index' | 'noindex';
}
export declare const PAGE_STATUSES: {
    readonly PUBLISHED: "published";
    readonly DRAFT: "draft";
    readonly PENDING: "pending";
};
export type PageStatus = typeof PAGE_STATUSES[keyof typeof PAGE_STATUSES];
//# sourceMappingURL=types.d.ts.map