import { PrismaClient } from '@prisma/client';
import { Role, User } from '../types';
export declare class RBACService {
    private prisma;
    constructor(prisma: PrismaClient);
    createRole(data: {
        slug: string;
        name: string;
        permissions?: Record<string, any>;
        description?: string;
        isDefault?: boolean;
        createdBy: string;
    }): Promise<Role>;
    updateRole(id: string, data: {
        name?: string;
        permissions?: Record<string, any>;
        description?: string;
        isDefault?: boolean;
        updatedBy: string;
    }): Promise<Role>;
    deleteRole(id: string): Promise<void>;
    getRoleById(id: string): Promise<Role | null>;
    getAllRoles(): Promise<Role[]>;
    assignRoleToUser(userId: string, roleId: string): Promise<void>;
    removeRoleFromUser(userId: string, roleId: string): Promise<void>;
    getUserRoles(userId: string): Promise<Role[]>;
    hasPermission(user: User & {
        roles: Role[];
    }, permission: string): Promise<boolean>;
    private roleHasPermission;
    getUserPermissions(userId: string): Promise<string[]>;
}
//# sourceMappingURL=service.d.ts.map