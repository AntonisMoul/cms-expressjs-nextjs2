import { PrismaClient } from '@prisma/client';
import { Slug, CreateSlugRequest, SlugCheckRequest, SlugCheckResponse } from '../types';
export declare class SlugService {
    private prisma;
    constructor(prisma: PrismaClient);
    private transliterate;
    private generateSlug;
    createSlug(data: CreateSlugRequest): Promise<Slug>;
    updateSlug(id: string, data: Partial<CreateSlugRequest>): Promise<Slug>;
    deleteSlug(id: string): Promise<void>;
    getSlugById(id: string): Promise<Slug | null>;
    getSlugByEntity(entityType: string, entityId: string, locale?: string): Promise<Slug | null>;
    resolveSlug(fullSlug: string, locale?: string): Promise<Slug | null>;
    checkSlugAvailability(request: SlugCheckRequest): Promise<SlugCheckResponse>;
    generateUniqueSlug(title: string, entityType: string, locale?: string, excludeId?: string): Promise<string>;
    createSlugForEntity(entityType: string, entityId: string, title: string, prefix?: string, locale?: string): Promise<Slug>;
    updateSlugForEntity(entityType: string, entityId: string, title: string, prefix?: string, locale?: string): Promise<Slug>;
    deactivateSlug(id: string): Promise<void>;
    getSlugsByEntityType(entityType: string, locale?: string): Promise<Slug[]>;
}
//# sourceMappingURL=service.d.ts.map