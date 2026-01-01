import { JWTPayload, AuthTokens } from '../types';
export declare function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string;
export declare function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string;
export declare function generateTokens(userId: string, email: string): AuthTokens;
export declare function verifyAccessToken(token: string): JWTPayload;
export declare function verifyRefreshToken(token: string): JWTPayload;
export declare function refreshAccessToken(refreshToken: string): AuthTokens | null;
//# sourceMappingURL=jwt.d.ts.map