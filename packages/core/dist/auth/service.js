import { JWTService } from './jwt';
import { PasswordService } from './password';
import { RBACService } from '../rbac/service';
export class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(credentials) {
        const user = await this.prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user || !user.password) {
            return null;
        }
        const isValidPassword = await PasswordService.verify(credentials.password, user.password);
        if (!isValidPassword) {
            return null;
        }
        // Get user permissions
        const permissions = await RBACService.getUserPermissions(user.id, this.prisma);
        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        // Generate tokens
        const accessToken = JWTService.generateAccessToken({
            userId: user.id,
            email: user.email,
            permissions,
        });
        const refreshToken = JWTService.generateRefreshToken({
            userId: user.id,
            email: user.email,
            permissions,
        });
        // Convert to User type (exclude password)
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            avatarId: user.avatarId,
            superUser: user.superUser,
            manageSupers: user.manageSupers,
            permissions,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return {
            user: userResponse,
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(refreshToken) {
        const payload = JWTService.verifyRefreshToken(refreshToken);
        if (!payload) {
            return null;
        }
        // Verify user still exists and is active
        const user = await this.prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            return null;
        }
        // Get updated permissions
        const permissions = await RBACService.getUserPermissions(user.id, this.prisma);
        // Generate new tokens
        const newAccessToken = JWTService.generateAccessToken({
            userId: user.id,
            email: user.email,
            permissions,
        });
        const newRefreshToken = JWTService.generateRefreshToken({
            userId: user.id,
            email: user.email,
            permissions,
        });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    async getCurrentUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            return null;
        }
        const permissions = await RBACService.getUserPermissions(user.id, this.prisma);
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            avatarId: user.avatarId,
            superUser: user.superUser,
            manageSupers: user.manageSupers,
            permissions,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async logout(userId) {
        // Invalidate user sessions - could implement token blacklisting here
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                sessionsInvalidatedAt: new Date(),
            },
        });
    }
}
