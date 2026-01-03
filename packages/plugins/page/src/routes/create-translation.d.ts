import { PrismaClient } from '@cms/shared';
import { SlugService, QueueService, AuditService } from '@cms/core';
import { z } from 'zod';
declare const createTranslationSchema: z.ZodObject<{
    sourcePageId: z.ZodNumber;
    targetLocale: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourcePageId: number;
    targetLocale: string;
    name?: string | undefined;
    content?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
}, {
    sourcePageId: number;
    targetLocale: string;
    name?: string | undefined;
    content?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
}>;
export declare function createPageTranslation(db: PrismaClient, slugService: SlugService, queueService: QueueService, auditService: AuditService, userId: number, data: z.infer<typeof createTranslationSchema>): Promise<{
    name: string;
    content: string | null;
    description: string | null;
    status: string;
    image: string | null;
    translationGroupId: string | null;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    template: string | null;
}>;
export {};
//# sourceMappingURL=create-translation.d.ts.map