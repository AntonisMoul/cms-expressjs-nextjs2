import { PrismaClient } from '@prisma/client';
import { Role, UserRole } from '@cms/shared';
export declare class RBACService {
    static getUserPermissions(userId: number, prisma: PrismaClient): Promise<string[]>;
    static hasPermission(userId: number, permission: string, prisma: PrismaClient): Promise<boolean>;
    static hasAnyPermission(userId: number, permissions: string[], prisma: PrismaClient): Promise<boolean>;
    static hasAllPermissions(userId: number, permissions: string[], prisma: PrismaClient): Promise<boolean>;
    static assignRoleToUser(userId: number, roleId: number, prisma: PrismaClient): Promise<UserRole>;
    static removeRoleFromUser(userId: number, roleId: number, prisma: PrismaClient): Promise<void>;
    static getUserRoles(userId: number, prisma: PrismaClient): Promise<Role[]>;
}
//# sourceMappingURL=service.d.ts.map