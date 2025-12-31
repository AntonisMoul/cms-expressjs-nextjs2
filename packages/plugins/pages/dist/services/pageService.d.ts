import { PrismaClient } from '@prisma/client';
import { Page, PageTranslation, PageCreateData, PageUpdateData, PageListOptions, PageListResponse } from '../models/types';
export declare class PageService {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: PageCreateData, locale?: string): Promise<Page>;
    update(id: number, data: PageUpdateData, locale?: string): Promise<Page>;
    delete(id: number): Promise<void>;
    findById(id: number, locale?: string): Promise<Page | null>;
    findBySlug(slug: string, locale?: string): Promise<Page | null>;
    list(options?: PageListOptions): Promise<PageListResponse>;
    publish(id: number): Promise<Page>;
    unpublish(id: number): Promise<Page>;
    createTranslation(sourcePageId: number, targetLocale: string): Promise<PageTranslation>;
    getTranslations(pageId: number): Promise<PageTranslation[]>;
    private createMeta;
    private updateMeta;
    private generateSlug;
    private updateSlug;
}
//# sourceMappingURL=pageService.d.ts.map