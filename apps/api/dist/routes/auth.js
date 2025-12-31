"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_2.PrismaClient();
const authService = new core_1.AuthService(prisma);
const authMiddleware = new core_1.AuthMiddleware(prisma);
// Validation rules
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('remember').optional().isBoolean(),
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
            });
        }
        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: remember
                ? 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
                : 15 * 60 * 1000, // 15 minutes in milliseconds
        };
        res.cookie(core_1.COOKIE_NAMES.ACCESS_TOKEN, result.accessToken, cookieOptions);
        res.cookie(core_1.COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // Always use refresh token expiry for refresh token
        });
        res.json({
            success: true,
            data: {
                user: result.user,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
        });
    }
});
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies[core_1.COOKIE_NAMES.REFRESH_TOKEN];
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required',
            });
        }
        const result = await authService.refreshToken(refreshToken);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }
        // Set new cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        };
        res.cookie(core_1.COOKIE_NAMES.ACCESS_TOKEN, result.accessToken, cookieOptions);
        res.json({
            success: true,
            message: 'Token refreshed',
        });
    }
    catch (error) {
        console.error('Refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Token refresh failed',
        });
    }
});
router.post('/logout', authMiddleware.authenticate, async (req, res) => {
    try {
        if (req.user) {
            await authService.logout(req.user.userId);
        }
        // Clear cookies
        res.clearCookie(core_1.COOKIE_NAMES.ACCESS_TOKEN);
        res.clearCookie(core_1.COOKIE_NAMES.REFRESH_TOKEN);
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
        });
    }
});
router.get('/me', authMiddleware.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
        }
        const user = await authService.getCurrentUser(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user information',
        });
    }
});
exports.default = router;
