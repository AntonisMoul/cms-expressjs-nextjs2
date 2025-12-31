import { User } from '@cms/shared';
export interface Post {
    id: number;
    name: string;
    description?: string | null;
    content?: string | null;
    status: string;
    authorId?: number | null;
    authorType?: string | null;
    isFeatured: boolean;
    image?: string | null;
    views: number;
    formatType?: string | null;
    translationGroupId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    author?: User | null;
    categories?: Category[];
    tags?: Tag[];
    translations?: PostTranslation[];
    meta?: PostMeta[];
}
export interface Category {
    id: number;
    name: string;
    parentId: number;
    description?: string | null;
    status: string;
    authorId?: number | null;
    authorType?: string | null;
    icon?: string | null;
    order: number;
    isFeatured: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    author?: User | null;
    posts?: Post[];
    children?: Category[];
    parent?: Category | null;
}
export interface Tag {
    id: number;
    name: string;
    authorId?: number | null;
    authorType?: string | null;
    description?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    author?: User | null;
    posts?: Post[];
}
export interface PostTranslation {
    langCode: string;
    postsId: number;
    name?: string | null;
    description?: string | null;
    content?: string | null;
    post?: Post;
}
export interface PostMeta {
    id: number;
    key: string;
    value?: string | null;
    postId: number;
    createdAt: Date;
    updatedAt: Date;
    post?: Post;
}
export interface PostCreateData {
    name: string;
    description?: string;
    content?: string;
    status?: string;
    authorId?: number;
    isFeatured?: boolean;
    image?: string;
    formatType?: string;
    translationGroupId?: string;
    categoryIds?: number[];
    tagIds?: number[];
    meta?: Record<string, any>;
}
export interface PostUpdateData {
    name?: string;
    description?: string;
    content?: string;
    status?: string;
    isFeatured?: boolean;
    image?: string;
    formatType?: string;
    categoryIds?: number[];
    tagIds?: number[];
    meta?: Record<string, any>;
}
export interface CategoryCreateData {
    name: string;
    parentId?: number;
    description?: string;
    status?: string;
    authorId?: number;
    icon?: string;
    order?: number;
    isFeatured?: boolean;
    isDefault?: boolean;
}
export interface CategoryUpdateData {
    name?: string;
    parentId?: number;
    description?: string;
    status?: string;
    icon?: string;
    order?: number;
    isFeatured?: boolean;
    isDefault?: boolean;
}
export interface TagCreateData {
    name: string;
    authorId?: number;
    description?: string;
    status?: string;
}
export interface TagUpdateData {
    name?: string;
    description?: string;
    status?: string;
}
export interface PostFilters {
    status?: string;
    authorId?: number;
    categoryId?: number;
    tagId?: number;
    isFeatured?: boolean;
    search?: string;
    translationGroupId?: string;
}
export interface CategoryFilters {
    status?: string;
    parentId?: number;
    isFeatured?: boolean;
    search?: string;
}
export interface TagFilters {
    status?: string;
    search?: string;
}
export interface PostListOptions {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: PostFilters;
}
export interface CategoryListOptions {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: CategoryFilters;
}
export interface TagListOptions {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: TagFilters;
}
export interface PostListResponse {
    posts: Post[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}
export interface CategoryListResponse {
    categories: Category[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}
export interface TagListResponse {
    tags: Tag[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}
export declare const POST_STATUSES: {
    readonly PUBLISHED: "published";
    readonly DRAFT: "draft";
    readonly PENDING: "pending";
};
export declare const CATEGORY_STATUSES: {
    readonly PUBLISHED: "published";
    readonly DRAFT: "draft";
};
export declare const TAG_STATUSES: {
    readonly PUBLISHED: "published";
    readonly DRAFT: "draft";
};
export type PostStatus = typeof POST_STATUSES[keyof typeof POST_STATUSES];
export type CategoryStatus = typeof CATEGORY_STATUSES[keyof typeof CATEGORY_STATUSES];
export type TagStatus = typeof TAG_STATUSES[keyof typeof TAG_STATUSES];
//# sourceMappingURL=types.d.ts.map