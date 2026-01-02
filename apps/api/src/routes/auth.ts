import { Router, Request, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { AuthService } from '@cms/core';
import { requireAuth, AuthRequest } from '../middleware/auth';

export function authRoutes(db: PrismaClient): Router {
  const router = Router();
  const authService = new AuthService(db);

  // Login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
      }

      const result = await authService.login({ email, password });

      // Set HTTP-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            superUser: result.user.superUser,
          },
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message || 'Invalid credentials',
      });
    }
  });

  // Get current user
  router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const user = await db.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          superUser: true,
          manageSupers: true,
          avatarId: true,
          lastLogin: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Logout
  router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  return router;
}

