import { PrismaClient } from '@prisma/client';
import { Tag, TagCreateData, TagUpdateData, TagListOptions, TagListResponse } from '../models/types';
export declare class TagService {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: TagCreateData): Promise<Tag>;
    update(id: number, data: TagUpdateData): Promise<Tag>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<Tag | null>;
    findByName(name: string): Promise<Tag | null>;
    list(options?: TagListOptions): Promise<TagListResponse>;
    getAll(): Promise<Tag[]>;
    search(query: string, limit?: number): Promise<Tag[]>;
}
//# sourceMappingURL=tagService.d.ts.map