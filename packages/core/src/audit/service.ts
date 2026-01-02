import { PrismaClient } from '@cms/shared';

export interface AuditLogData {
  userId: number;
  module?: string;
  action?: string;
  request?: any;
  userAgent?: string;
  ipAddress?: string;
  referenceUser?: number;
  referenceId?: bigint;
  referenceName?: string;
  type?: string;
}

export class AuditService {
  constructor(private db: PrismaClient) {}

  async log(data: AuditLogData): Promise<void> {
    await this.db.auditHistory.create({
      data: {
        userId: data.userId,
        module: data.module,
        action: data.action,
        request: data.request ? JSON.stringify(data.request) : null,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        referenceUser: data.referenceUser,
        referenceId: data.referenceId,
        referenceName: data.referenceName,
        type: data.type,
      },
    });
  }

  async getLogs(filters?: {
    userId?: number;
    module?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.module) {
      where.module = filters.module;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return this.db.auditHistory.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }
}

