import { Response, NextFunction } from 'express';
import { RBACService } from '@cms/core';
import { prisma } from '@cms/shared';
import { AuthRequest } from './auth';

const rbacService = new RBACService(prisma);

export function requirePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Super users bypass permission checks
    if (req.user.superUser) {
      return next();
    }

    const hasPermission = await rbacService.checkPermission(
      req.user.id,
      permission
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
}

