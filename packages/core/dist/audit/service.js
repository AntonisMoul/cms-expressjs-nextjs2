"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(data) {
        await this.prisma.auditHistory.create({
            data: {
                userId: data.userId,
                module: data.module,
                action: data.action,
                request: data.request,
                userAgent: data.userAgent,
                ipAddress: data.ipAddress,
                referenceUser: data.referenceUser,
                referenceId: data.referenceId,
                referenceName: data.referenceName,
                type: data.type,
            },
        });
    }
    async getLogs(options = {}) {
        const where = {};
        if (options.userId)
            where.userId = options.userId;
        if (options.module)
            where.module = options.module;
        if (options.action)
            where.action = options.action;
        if (options.referenceId)
            where.referenceId = options.referenceId;
        if (options.type)
            where.type = options.type;
        if (options.startDate || options.endDate) {
            where.createdAt = {};
            if (options.startDate)
                where.createdAt.gte = options.startDate;
            if (options.endDate)
                where.createdAt.lte = options.endDate;
        }
        const logs = await this.prisma.auditHistory.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: options.limit || 50,
            skip: options.offset || 0,
        });
        return logs.map(log => ({
            id: log.id,
            userId: log.userId,
            module: log.module,
            action: log.action,
            request: log.request,
            userAgent: log.userAgent,
            ipAddress: log.ipAddress,
            referenceUser: log.referenceUser,
            referenceId: log.referenceId,
            referenceName: log.referenceName,
            type: log.type,
            createdAt: log.createdAt,
        }));
    }
    async getLogById(id) {
        const log = await this.prisma.auditHistory.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
            },
        });
        if (!log) {
            return null;
        }
        return {
            id: log.id,
            userId: log.userId,
            module: log.module,
            action: log.action,
            request: log.request,
            userAgent: log.userAgent,
            ipAddress: log.ipAddress,
            referenceUser: log.referenceUser,
            referenceId: log.referenceId,
            referenceName: log.referenceName,
            type: log.type,
            createdAt: log.createdAt,
        };
    }
    async getLogsCount(options = {}) {
        const where = {};
        if (options.userId)
            where.userId = options.userId;
        if (options.module)
            where.module = options.module;
        if (options.action)
            where.action = options.action;
        if (options.referenceId)
            where.referenceId = options.referenceId;
        if (options.type)
            where.type = options.type;
        if (options.startDate || options.endDate) {
            where.createdAt = {};
            if (options.startDate)
                where.createdAt.gte = options.startDate;
            if (options.endDate)
                where.createdAt.lte = options.endDate;
        }
        return this.prisma.auditHistory.count({ where });
    }
    async deleteLogs(options = {}) {
        const where = {};
        if (options.userId)
            where.userId = options.userId;
        if (options.module)
            where.module = options.module;
        if (options.action)
            where.action = options.action;
        if (options.referenceId)
            where.referenceId = options.referenceId;
        if (options.type)
            where.type = options.type;
        if (options.olderThan) {
            where.createdAt = {
                lt: options.olderThan,
            };
        }
        const result = await this.prisma.auditHistory.deleteMany({ where });
        return result.count;
    }
    // Helper methods for common audit actions
    async logUserAction(userId, action, referenceId, referenceName, request, ipAddress, userAgent) {
        await this.log({
            userId,
            module: 'users',
            action,
            referenceUser: userId,
            referenceId,
            referenceName,
            type: 'user',
            request,
            ipAddress,
            userAgent,
        });
    }
    async logContentAction(userId, module, action, referenceId, referenceName, request, ipAddress, userAgent) {
        await this.log({
            userId,
            module,
            action,
            referenceUser: userId,
            referenceId,
            referenceName,
            type: 'content',
            request,
            ipAddress,
            userAgent,
        });
    }
    async logSystemAction(userId, action, referenceName, request, ipAddress, userAgent) {
        await this.log({
            userId,
            module: 'system',
            action,
            referenceUser: userId,
            referenceId: 'system',
            referenceName,
            type: 'system',
            request,
            ipAddress,
            userAgent,
        });
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=service.js.map