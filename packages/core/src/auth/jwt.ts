import jwt from 'jsonwebtoken';
import { JWTPayload, JWT_CONSTANTS } from '@cms/shared';

export class JWTService {
  private static readonly accessSecret = process.env.JWT_SECRET || 'your-jwt-secret';
  private static readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    });
  }

  static generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY,
    });
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static refreshAccessToken(refreshToken: string): string | null {
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
