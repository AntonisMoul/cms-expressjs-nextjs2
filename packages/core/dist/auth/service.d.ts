import { PrismaClient } from '@prisma/client';
import { User, LoginRequest, RegisterRequest, CreateUserRequest, UpdateUserRequest, AuthTokens } from '../types';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaClient);
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    login(credentials: LoginRequest): Promise<{
        user: User;
        tokens: AuthTokens;
    } | null>;
    register(data: RegisterRequest): Promise<User>;
    createUser(data: CreateUserRequest, createdBy: string): Promise<User>;
    updateUser(id: string, data: UpdateUserRequest): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserWithRoles(id: string): Promise<User & {
        roles: any[];
    } | null>;
    refreshToken(refreshToken: string): Promise<AuthTokens | null>;
    changePassword(userId: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map