import { JWTPayload } from '@cms/shared';
export declare class JWTService {
    private static readonly accessSecret;
    private static readonly refreshSecret;
    static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string;
    static generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string;
    static verifyAccessToken(token: string): JWTPayload | null;
    static verifyRefreshToken(token: string): JWTPayload | null;
    static refreshAccessToken(refreshToken: string): string | null;
}
//# sourceMappingURL=jwt.d.ts.map