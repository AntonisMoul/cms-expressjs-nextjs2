import { PrismaClient } from '@prisma/client';
import { User, LoginRequest, LoginResponse } from '@cms/shared';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaClient);
    login(credentials: LoginRequest): Promise<LoginResponse | null>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    } | null>;
    getCurrentUser(userId: number): Promise<User | null>;
    logout(userId: number): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map