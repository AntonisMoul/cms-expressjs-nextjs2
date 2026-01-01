import { PrismaClient } from '@prisma/client';
import { Post, Category, Tag, PostWithRelations, CreatePostRequest, UpdatePostRequest, PostListRequest, PaginatedResponse, CreateCategoryRequest, UpdateCategoryRequest, CreateTagRequest, UpdateTagRequest } from '@cms/core';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaClient);
    createPost(data: CreatePostRequest, authorId: string): Promise<Post>;
    updatePost(id: string, data: UpdatePostRequest): Promise<Post>;
    deletePost(id: string): Promise<void>;
    getPostById(id: string): Promise<Post | null>;
    getPostWithRelations(id: string): Promise<PostWithRelations | null>;
    getPosts(options?: PostListRequest): Promise<PaginatedResponse<Post>>;
    incrementPostViews(id: string): Promise<void>;
    createCategory(data: CreateCategoryRequest, authorId: string): Promise<Category>;
    updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
    getCategories(): Promise<Category[]>;
    createTag(data: CreateTagRequest, authorId: string): Promise<Tag>;
    updateTag(id: string, data: UpdateTagRequest): Promise<Tag>;
    deleteTag(id: string): Promise<void>;
    getTags(): Promise<Tag[]>;
    createPostTranslation(postId: string, langCode: string, data: {
        name?: string;
        description?: string;
        content?: string;
    }): Promise<void>;
    updatePostTranslation(postId: string, langCode: string, data: {
        name?: string;
        description?: string;
        content?: string;
    }): Promise<void>;
    deletePostTranslation(postId: string, langCode: string): Promise<void>;
    createCategoryTranslation(categoryId: string, langCode: string, data: {
        name?: string;
        description?: string;
    }): Promise<void>;
    updateCategoryTranslation(categoryId: string, langCode: string, data: {
        name?: string;
        description?: string;
    }): Promise<void>;
    deleteCategoryTranslation(categoryId: string, langCode: string): Promise<void>;
    createTagTranslation(tagId: string, langCode: string, data: {
        name?: string;
        description?: string;
    }): Promise<void>;
    updateTagTranslation(tagId: string, langCode: string, data: {
        name?: string;
        description?: string;
    }): Promise<void>;
    deleteTagTranslation(tagId: string, langCode: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map