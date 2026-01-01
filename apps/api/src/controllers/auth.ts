import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@cms/core';
import { setAuthCookies, clearAuthCookies } from '../middleware/auth';

const prisma = new PrismaClient();
const authService = new AuthService(prisma);

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
      }

      const result = await authService.login({ email, password });

      if (!result) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      setAuthCookies(res, result.tokens);

      res.json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      clearAuthCookies(res);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'No refresh token',
        });
      }

      const newTokens = await authService.refreshToken(refreshToken);

      if (!newTokens) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token',
        });
      }

      setAuthCookies(res, newTokens);

      res.json({
        success: true,
        message: 'Tokens refreshed',
      });
    } catch (error) {
      console.error('Refresh error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }

      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, username } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
      }

      const user = await authService.register({
        email,
        password,
        firstName,
        lastName,
        username,
      });

      res.status(201).json({
        success: true,
        data: {
          user,
        },
        message: 'User registered successfully',
      });
    } catch (error: any) {
      console.error('Register error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Email or username already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required',
        });
      }

      // Verify current password
      const user = await authService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const isValidPassword = await authService.verifyPassword(currentPassword, user.password!);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect',
        });
      }

      await authService.changePassword(req.user.id, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

