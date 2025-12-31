import { PrismaClient } from '@prisma/client';
import { Post, PostCreateData, PostUpdateData, PostListOptions, PostListResponse } from '../models/types';
export declare class PostService {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: PostCreateData, locale?: string): Promise<Post>;
    update(id: number, data: PostUpdateData, locale?: string): Promise<Post>;
    delete(id: number): Promise<void>;
    findById(id: number, locale?: string): Promise<Post | null>;
    findBySlug(slug: string, locale?: string): Promise<Post | null>;
    list(options?: PostListOptions): Promise<PostListResponse>;
    publish(id: number): Promise<Post>;
    unpublish(id: number): Promise<Post>;
    private assignCategoriesToPost;
    private assignTagsToPost;
    private updatePostCategories;
    private updatePostTags;
    private createMeta;
    private updateMeta;
    private generateSlug;
    private updateSlug;
}
//# sourceMappingURL=blogService.d.ts.map