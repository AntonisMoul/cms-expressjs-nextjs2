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
export declare const SLUG_PREFIXES: {
    readonly POSTS: "blog";
    readonly PAGES: null;
    readonly CATEGORIES: null;
    readonly TAGS: "tag";
    readonly GALLERIES: "galleries";
};
export interface SlugRedirect {
    id: number;
    oldSlug: string;
    newSlug: string;
    entityType: string;
    entityId: number;
    locale: string;
    createdAt: Date;
}
//# sourceMappingURL=slug.d.ts.map