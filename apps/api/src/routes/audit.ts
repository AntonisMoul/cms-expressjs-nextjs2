import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { AuditService } from '@cms/core';
import { requireAuth, requirePermission, AuthRequest } from '../middleware/auth';

export function auditRoutes(db: PrismaClient): Router {
  const router = Router();
  const auditService = new AuditService(db);

  router.use(requireAuth);
  router.use(requirePermission('audit-logs.index'));

  // Get audit logs
  router.get('/', async (req: AuthRequest, res: Response) => {
    try {
      const { userId, module, startDate, endDate, limit, offset } = req.query;

      const logs = await auditService.getLogs({
        userId: userId ? parseInt(userId as string) : undefined,
        module: module as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      res.json({
        success: true,
        data: { logs },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  return router;
}

