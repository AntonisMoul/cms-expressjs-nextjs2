import { PrismaClient } from '@prisma/client';
import { Page, PageWithTranslations, CreatePageRequest, UpdatePageRequest, PageListRequest, PaginatedResponse } from '@cms/core';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaClient);
    createPage(data: CreatePageRequest, userId: string): Promise<Page>;
    updatePage(id: string, data: UpdatePageRequest): Promise<Page>;
    deletePage(id: string): Promise<void>;
    getPageById(id: string): Promise<Page | null>;
    getPageWithTranslations(id: string): Promise<PageWithTranslations | null>;
    getPages(options?: PageListRequest): Promise<PaginatedResponse<Page>>;
    getPublishedPages(): Promise<Page[]>;
    createPageTranslation(pageId: string, langCode: string, data: {
        name?: string;
        description?: string;
        content?: string;
    }): Promise<void>;
    updatePageTranslation(pageId: string, langCode: string, data: {
        name?: string;
        description?: string;
        content?: string;
    }): Promise<void>;
    deletePageTranslation(pageId: string, langCode: string): Promise<void>;
    getPageTranslation(pageId: string, langCode: string): Promise<{
        langCode: string;
        pagesId: string;
        name?: string;
        description?: string;
        content?: string;
    } | null>;
}
//# sourceMappingURL=service.d.ts.map