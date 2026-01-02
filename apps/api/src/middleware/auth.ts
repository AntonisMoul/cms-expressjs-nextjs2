import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@cms/core';
import { prisma } from '@cms/shared';

const authService = new AuthService(prisma);

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    superUser: boolean;
  };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const user = await authService.getCurrentUser(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      superUser: user.superUser,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
}

