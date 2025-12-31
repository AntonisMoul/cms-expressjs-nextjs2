import { AUDIT_ACTIONS, AUDIT_MODULES } from '@cms/shared';
export class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(data) {
        try {
            await this.prisma.auditHistory.create({
                data: {
                    userId: data.userId,
                    module: data.module,
                    action: data.action,
                    referenceUser: data.referenceUser,
                    referenceId: data.referenceId,
                    referenceName: data.referenceName,
                    request: data.request,
                    userAgent: data.userAgent,
                    ipAddress: data.ipAddress,
                    type: data.type,
                },
            });
        }
        catch (error) {
            // Log audit failure but don't throw to avoid breaking main flow
            console.error('Failed to create audit log:', error);
        }
    }
    async logAction(userId, module, action, referenceId, referenceName, request, userAgent, ipAddress, referenceUser) {
        await this.log({
            userId,
            module,
            action,
            referenceUser: referenceUser || userId,
            referenceId,
            referenceName,
            request: request ? JSON.stringify(request) : undefined,
            userAgent,
            ipAddress,
            type: 'admin',
        });
    }
    async logCreate(userId, module, referenceId, referenceName, request, userAgent, ipAddress) {
        await this.logAction(userId, module, AUDIT_ACTIONS.CREATE, referenceId, referenceName, request, userAgent, ipAddress);
    }
    async logUpdate(userId, module, referenceId, referenceName, request, userAgent, ipAddress) {
        await this.logAction(userId, module, AUDIT_ACTIONS.UPDATE, referenceId, referenceName, request, userAgent, ipAddress);
    }
    async logDelete(userId, module, referenceId, referenceName, userAgent, ipAddress) {
        await this.logAction(userId, module, AUDIT_ACTIONS.DELETE, referenceId, referenceName, undefined, userAgent, ipAddress);
    }
    async logPublish(userId, module, referenceId, referenceName, userAgent, ipAddress) {
        await this.logAction(userId, module, AUDIT_ACTIONS.PUBLISH, referenceId, referenceName, undefined, userAgent, ipAddress);
    }
    async logLogin(userId, userAgent, ipAddress) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, email: true },
        });
        if (user) {
            const referenceName = `${user.firstName} ${user.lastName}`.trim() || user.email;
            await this.logAction(userId, AUDIT_MODULES.USERS, AUDIT_ACTIONS.LOGIN, userId, referenceName, undefined, userAgent, ipAddress);
        }
    }
    async logLogout(userId, userAgent, ipAddress) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, email: true },
        });
        if (user) {
            const referenceName = `${user.firstName} ${user.lastName}`.trim() || user.email;
            await this.logAction(userId, AUDIT_MODULES.USERS, 'logout', userId, referenceName, undefined, userAgent, ipAddress);
        }
    }
}
