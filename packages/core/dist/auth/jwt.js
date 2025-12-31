import jwt from 'jsonwebtoken';
import { JWT_CONSTANTS } from '@cms/shared';
export class JWTService {
    static accessSecret = process.env.JWT_SECRET || 'your-jwt-secret';
    static refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    static generateAccessToken(payload) {
        return jwt.sign(payload, this.accessSecret, {
            expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRY,
        });
    }
    static generateRefreshToken(payload) {
        return jwt.sign(payload, this.refreshSecret, {
            expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY,
        });
    }
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessSecret);
        }
        catch (error) {
            return null;
        }
    }
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshSecret);
        }
        catch (error) {
            return null;
        }
    }
    static refreshAccessToken(refreshToken) {
        const payload = this.verifyRefreshToken(refreshToken);
        if (!payload) {
            return null;
        }
        // Generate new access token
        return this.generateAccessToken({
            userId: payload.userId,
            email: payload.email,
            permissions: payload.permissions,
        });
    }
}
