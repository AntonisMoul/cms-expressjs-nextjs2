"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RBACService = void 0;
class RBACService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRole(data) {
        const role = await this.prisma.role.create({
            data: {
                slug: data.slug,
                name: data.name,
                permissions: data.permissions || {},
                description: data.description,
                isDefault: data.isDefault || false,
                createdBy: data.createdBy,
                updatedBy: data.createdBy,
            },
        });
        return {
            id: role.id,
            slug: role.slug,
            name: role.name,
            permissions: role.permissions,
            description: role.description,
            isDefault: role.isDefault,
            createdBy: role.createdBy,
            updatedBy: role.updatedBy,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
    async updateRole(id, data) {
        const updateData = {
            updatedBy: data.updatedBy,
        };
        if (data.name)
            updateData.name = data.name;
        if (data.permissions)
            updateData.permissions = data.permissions;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.isDefault !== undefined)
            updateData.isDefault = data.isDefault;
        const role = await this.prisma.role.update({
            where: { id },
            data: updateData,
        });
        return {
            id: role.id,
            slug: role.slug,
            name: role.name,
            permissions: role.permissions,
            description: role.description,
            isDefault: role.isDefault,
            createdBy: role.createdBy,
            updatedBy: role.updatedBy,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
    async deleteRole(id) {
        await this.prisma.role.delete({
            where: { id },
        });
    }
    async getRoleById(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            return null;
        }
        return {
            id: role.id,
            slug: role.slug,
            name: role.name,
            permissions: role.permissions,
            description: role.description,
            isDefault: role.isDefault,
            createdBy: role.createdBy,
            updatedBy: role.updatedBy,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
    async getAllRoles() {
        const roles = await this.prisma.role.findMany({
            orderBy: { createdAt: 'asc' },
        });
        return roles.map(role => ({
            id: role.id,
            slug: role.slug,
            name: role.name,
            permissions: role.permissions,
            description: role.description,
            isDefault: role.isDefault,
            createdBy: role.createdBy,
            updatedBy: role.updatedBy,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        }));
    }
    async assignRoleToUser(userId, roleId) {
        await this.prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        });
    }
    async removeRoleFromUser(userId, roleId) {
        await this.prisma.userRole.deleteMany({
            where: {
                userId,
                roleId,
            },
        });
    }
    async getUserRoles(userId) {
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            include: {
                role: true,
            },
        });
        return userRoles.map(ur => ({
            id: ur.role.id,
            slug: ur.role.slug,
            name: ur.role.name,
            permissions: ur.role.permissions,
            description: ur.role.description,
            isDefault: ur.role.isDefault,
            createdBy: ur.role.createdBy,
            updatedBy: ur.role.updatedBy,
            createdAt: ur.role.createdAt,
            updatedAt: ur.role.updatedAt,
        }));
    }
    async hasPermission(user, permission) {
        // Super users have all permissions
        if (user.superUser) {
            return true;
        }
        // Check if any role has the permission
        for (const role of user.roles) {
            if (this.roleHasPermission(role, permission)) {
                return true;
            }
        }
        return false;
    }
    roleHasPermission(role, permission) {
        if (!role.permissions) {
            return false;
        }
        // Check direct permission
        if (role.permissions[permission]) {
            return true;
        }
        // Check wildcard permissions (e.g., "users.*" covers "users.create", "users.edit", etc.)
        const permissionParts = permission.split('.');
        for (let i = permissionParts.length - 1; i > 0; i--) {
            const wildcardPermission = [...permissionParts.slice(0, i), '*'].join('.');
            if (role.permissions[wildcardPermission]) {
                return true;
            }
        }
        return false;
    }
    async getUserPermissions(userId) {
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
            return [];
        }
        const userWithRoles = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatarId: user.avatarId,
            superUser: user.superUser,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles: user.roles.map(ur => ({
                id: ur.role.id,
                slug: ur.role.slug,
                name: ur.role.name,
                permissions: ur.role.permissions,
                description: ur.role.description,
                isDefault: ur.role.isDefault,
                createdBy: ur.role.createdBy,
                updatedBy: ur.role.updatedBy,
                createdAt: ur.role.createdAt,
                updatedAt: ur.role.updatedAt,
            })),
        };
        const permissions = [];
        // Super users have all permissions
        if (userWithRoles.superUser) {
            return ['*'];
        }
        // Collect all permissions from roles
        for (const role of userWithRoles.roles) {
            if (role.permissions) {
                permissions.push(...Object.keys(role.permissions));
            }
        }
        return [...new Set(permissions)]; // Remove duplicates
    }
}
exports.RBACService = RBACService;
//# sourceMappingURL=service.js.map