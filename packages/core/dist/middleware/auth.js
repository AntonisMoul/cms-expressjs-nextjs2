import { COOKIE_NAMES } from '@cms/shared';
import { JWTService } from '../auth/jwt';
import { RBACService } from '../rbac/service';
export class AuthMiddleware {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    authenticate = async (req, res, next) => {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Authentication error',
            });
        }
    };
    requirePermission = (permission) => {
        return async (req, res, next) => {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const hasPermission = await RBACService.hasPermission(req.user.userId, permission, this.prisma);
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
    requireAnyPermission = (permissions) => {
        return async (req, res, next) => {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const hasPermission = await RBACService.hasAnyPermission(req.user.userId, permissions, this.prisma);
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
    requireAllPermissions = (permissions) => {
        return async (req, res, next) => {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const hasPermission = await RBACService.hasAllPermissions(req.user.userId, permissions, this.prisma);
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
    optionalAuth = async (req, res, next) => {
        try {
            const accessToken = this.extractTokenFromCookies(req) || this.extractTokenFromHeader(req);
            if (accessToken) {
                const payload = JWTService.verifyAccessToken(accessToken);
                if (payload) {
                    req.user = payload;
                }
            }
            next();
        }
        catch (error) {
            // Ignore auth errors for optional auth
            next();
        }
    };
    extractTokenFromCookies(req) {
        return req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN] || null;
    }
    extractTokenFromHeader(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return null;
    }
}
