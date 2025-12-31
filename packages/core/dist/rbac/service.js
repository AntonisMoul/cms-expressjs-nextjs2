export class RBACService {
    static async getUserPermissions(userId, prisma) {
        const user = await prisma.user.findUnique({
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
        // If user is super user, return all permissions
        if (user.superUser) {
            return ['*'];
        }
        const permissions = new Set();
        // Add user-specific permissions
        if (user.permissions) {
            try {
                const userPerms = JSON.parse(user.permissions);
                if (Array.isArray(userPerms)) {
                    userPerms.forEach((perm) => permissions.add(perm));
                }
            }
            catch (error) {
                // Invalid JSON, ignore
            }
        }
        // Add permissions from roles
        for (const userRole of user.roles) {
            if (userRole.role.permissions) {
                try {
                    const rolePerms = JSON.parse(userRole.role.permissions);
                    if (Array.isArray(rolePerms)) {
                        rolePerms.forEach((perm) => permissions.add(perm));
                    }
                }
                catch (error) {
                    // Invalid JSON, ignore
                }
            }
        }
        return Array.from(permissions);
    }
    static async hasPermission(userId, permission, prisma) {
        const permissions = await this.getUserPermissions(userId, prisma);
        return permissions.includes('*') || permissions.includes(permission);
    }
    static async hasAnyPermission(userId, permissions, prisma) {
        const userPermissions = await this.getUserPermissions(userId, prisma);
        return userPermissions.includes('*') ||
            permissions.some(perm => userPermissions.includes(perm));
    }
    static async hasAllPermissions(userId, permissions, prisma) {
        const userPermissions = await this.getUserPermissions(userId, prisma);
        if (userPermissions.includes('*')) {
            return true;
        }
        return permissions.every(perm => userPermissions.includes(perm));
    }
    static async assignRoleToUser(userId, roleId, prisma) {
        return prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        });
    }
    static async removeRoleFromUser(userId, roleId, prisma) {
        await prisma.userRole.deleteMany({
            where: {
                userId,
                roleId,
            },
        });
    }
    static async getUserRoles(userId, prisma) {
        const userRoles = await prisma.userRole.findMany({
            where: { userId },
            include: {
                role: true,
            },
        });
        return userRoles.map(ur => ur.role);
    }
}
