import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, verifyRefreshToken, generateTokens } from '@cms/core';
import { AuthService } from '@cms/core';

const prisma = new PrismaClient();
const authService = new AuthService(prisma);

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ success: false, error: 'No access token' });
    }

    const payload = verifyAccessToken(accessToken);
    const user = await authService.getUserWithRoles(payload.userId);

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    // Try refresh token
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'No refresh token' });
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await authService.getUserWithRoles(payload.userId);

      if (!user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }

      // Generate new tokens
      const newTokens = generateTokens(user.id, user.email);

      // Set new cookies
      setAuthCookies(res, newTokens);

      req.user = user;
      next();
    } catch (refreshError) {
      return res.status(401).json({ success: false, error: 'Invalid tokens' });
    }
  }
}

export function authorize(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    // Check if user is super admin
    if (req.user.superUser) {
      return next();
    }

    // Check permissions
    const hasPermission = req.user.roles.some((role: any) =>
      role.permissions && role.permissions[permission]
    );

    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    next();
  };
}

export function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
}

