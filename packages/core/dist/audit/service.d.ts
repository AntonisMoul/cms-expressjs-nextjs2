import { PrismaClient } from '@prisma/client';
import { AuditLogCreateData } from '@cms/shared';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaClient);
    log(data: AuditLogCreateData): Promise<void>;
    logAction(userId: number, module: string, action: string, referenceId: number, referenceName: string, request?: any, userAgent?: string, ipAddress?: string, referenceUser?: number): Promise<void>;
    logCreate(userId: number, module: string, referenceId: number, referenceName: string, request?: any, userAgent?: string, ipAddress?: string): Promise<void>;
    logUpdate(userId: number, module: string, referenceId: number, referenceName: string, request?: any, userAgent?: string, ipAddress?: string): Promise<void>;
    logDelete(userId: number, module: string, referenceId: number, referenceName: string, userAgent?: string, ipAddress?: string): Promise<void>;
    logPublish(userId: number, module: string, referenceId: number, referenceName: string, userAgent?: string, ipAddress?: string): Promise<void>;
    logLogin(userId: number, userAgent?: string, ipAddress?: string): Promise<void>;
    logLogout(userId: number, userAgent?: string, ipAddress?: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map