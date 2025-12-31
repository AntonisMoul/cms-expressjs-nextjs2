import { PrismaClient } from '@prisma/client';
import { SlugCreateData, SlugCheckResponse } from '@cms/shared';
export declare class SlugService {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: SlugCreateData): Promise<string>;
    update(entityType: string, entityId: number, locale: string, newKey: string, prefix?: string): Promise<string>;
    checkAvailability(entityType: string, locale: string, slug: string, prefix?: string, excludeId?: number): Promise<SlugCheckResponse>;
    findBySlug(slug: string, entityType?: string, prefix?: string): Promise<any | null>;
    private generateSlug;
    private ensureUnique;
    private generateUniqueSlug;
    static transliterate(text: string): string;
    static getPrefix(entityType: string): string | null;
}
//# sourceMappingURL=service.d.ts.map