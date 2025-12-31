export interface User {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username?: string | null;
    email: string;
    avatarId?: number | null;
    superUser: boolean;
    manageSupers: boolean;
    permissions?: string[] | null;
    lastLogin?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface Role {
    id: number;
    slug: string;
    name: string;
    permissions?: string | null;
    description?: string | null;
    isDefault: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserRole {
    id: number;
    userId: number;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface LoginRequest {
    email: string;
    password: string;
    remember?: boolean;
}
export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface JWTPayload {
    userId: number;
    email: string;
    permissions: string[];
    iat?: number;
    exp?: number;
}
export interface AuthCookies {
    accessToken: string;
    refreshToken: string;
}
export declare const COOKIE_NAMES: {
    readonly ACCESS_TOKEN: "access_token";
    readonly REFRESH_TOKEN: "refresh_token";
};
export declare const JWT_CONSTANTS: {
    readonly ACCESS_TOKEN_EXPIRY: "15m";
    readonly REFRESH_TOKEN_EXPIRY: "7d";
};
//# sourceMappingURL=auth.d.ts.map