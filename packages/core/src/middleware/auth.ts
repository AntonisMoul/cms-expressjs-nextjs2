import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { JWTPayload, COOKIE_NAMES } from '@cms/shared';
import { JWTService } from '../auth/jwt';
import { RBACService } from '../rbac/service';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  constructor(private prisma: PrismaClient) {}

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accessToken = this.extractTokenFromCookies(req) || this.extractTokenFromHeader(req);

      if (!accessToken) {
        res.status(401).json({
          success: false,
          message: 'Access token required',
        });
        return;
      }

      const payload = JWTService.verifyAccessToken(accessToken);
      if (!payload) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired access token',
        });
        return;
      }

      // Check if user sessions are invalidated
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { sessionsInvalidatedAt: true },
      });

      if (user?.sessionsInvalidatedAt && payload.iat && user.sessionsInvalidatedAt.getTime() / 1000 > payload.iat) {
        res.status(401).json({
          success: false,
          message: 'Session invalidated',
        });
        return;
      }

      req.user = payload;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authentication error',
      });
    }
  };

  requirePermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const hasPermission = await RBACService.hasPermission(
        req.user.userId,
        permission,
        this.prisma
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
        return;
      }

      next();
    };
  };

  requireAnyPermission = (permissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const hasPermission = await RBACService.hasAnyPermission(
        req.user.userId,
        permissions,
        this.prisma
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
        return;
      }

      next();
    };
  };

  requireAllPermissions = (permissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const hasPermission = await RBACService.hasAllPermissions(
        req.user.userId,
        permissions,
        this.prisma
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
        return;
      }

      next();
    };
  };

  optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accessToken = this.extractTokenFromCookies(req) || this.extractTokenFromHeader(req);

      if (accessToken) {
        const payload = JWTService.verifyAccessToken(accessToken);
        if (payload) {
          req.user = payload;
        }
      }

      next();
    } catch (error) {
      // Ignore auth errors for optional auth
      next();
    }
  };

  private extractTokenFromCookies(req: Request): string | null {
    return req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN] || null;
  }

  private extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
}
