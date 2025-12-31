import { Router } from 'express';
import { body } from 'express-validator';
import { AuthService, AuthMiddleware, COOKIE_NAMES, JWT_CONSTANTS } from '@cms/core';
import { PrismaClient } from '@cms/core';
import { ApiResponse } from '@cms/shared';

const router = Router();
const prisma = new PrismaClient();
const authService = new AuthService(prisma);
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('remember').optional().isBoolean(),
];

// Routes
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    const result = await authService.login({ email, password, remember });

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      } as ApiResponse);
    }

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: remember
        ? JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY * 1000
        : JWT_CONSTANTS.ACCESS_TOKEN_EXPIRY * 1000,
    };

    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, result.accessToken, cookieOptions);
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
      ...cookieOptions,
      maxAge: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY * 1000, // Always use refresh token expiry for refresh token
    });

    res.json({
      success: true,
      data: {
        user: result.user,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    } as ApiResponse);
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      } as ApiResponse);
    }

    const result = await authService.refreshToken(refreshToken);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      } as ApiResponse);
    }

    // Set new cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRY * 1000,
    };

    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, result.accessToken, cookieOptions);

    res.json({
      success: true,
      message: 'Token refreshed',
    } as ApiResponse);
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
    } as ApiResponse);
  }
});

router.post('/logout', authMiddleware.authenticate, async (req, res) => {
  try {
    if (req.user) {
      await authService.logout(req.user.userId);
    }

    // Clear cookies
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);

    res.json({
      success: true,
      message: 'Logged out successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    } as ApiResponse);
  }
});

router.get('/me', authMiddleware.authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      } as ApiResponse);
    }

    const user = await authService.getCurrentUser(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: { user },
    } as ApiResponse);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information',
    } as ApiResponse);
  }
});

export default router;
