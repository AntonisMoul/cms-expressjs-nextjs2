import { PrismaClient } from '@prisma/client';
import { AuditHistory, AuditLogData } from '../types';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaClient);
    log(data: AuditLogData & {
        userId: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
    getLogs(options?: {
        userId?: string;
        module?: string;
        action?: string;
        referenceId?: string;
        type?: string;
        limit?: number;
        offset?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<AuditHistory[]>;
    getLogById(id: string): Promise<AuditHistory | null>;
    getLogsCount(options?: {
        userId?: string;
        module?: string;
        action?: string;
        referenceId?: string;
        type?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<number>;
    deleteLogs(options?: {
        userId?: string;
        module?: string;
        action?: string;
        referenceId?: string;
        type?: string;
        olderThan?: Date;
    }): Promise<number>;
    logUserAction(userId: string, action: string, referenceId: string, referenceName: string, request?: any, ipAddress?: string, userAgent?: string): Promise<void>;
    logContentAction(userId: string, module: string, action: string, referenceId: string, referenceName: string, request?: any, ipAddress?: string, userAgent?: string): Promise<void>;
    logSystemAction(userId: string, action: string, referenceName: string, request?: any, ipAddress?: string, userAgent?: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map