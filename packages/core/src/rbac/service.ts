import { PrismaClient } from '@prisma/client';
import { Role, Permission, User } from '../types';

export class RBACService {
  constructor(private prisma: PrismaClient) {}

  async createRole(data: {
    slug: string;
    name: string;
    permissions?: Record<string, any>;
    description?: string;
    isDefault?: boolean;
    createdBy: string;
  }): Promise<Role> {
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
      permissions: role.permissions as any,
      description: role.description,
      isDefault: role.isDefault,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async updateRole(id: string, data: {
    name?: string;
    permissions?: Record<string, any>;
    description?: string;
    isDefault?: boolean;
    updatedBy: string;
  }): Promise<Role> {
    const updateData: any = {
      updatedBy: data.updatedBy,
    };

    if (data.name) updateData.name = data.name;
    if (data.permissions) updateData.permissions = data.permissions;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    const role = await this.prisma.role.update({
      where: { id },
      data: updateData,
    });

    return {
      id: role.id,
      slug: role.slug,
      name: role.name,
      permissions: role.permissions as any,
      description: role.description,
      isDefault: role.isDefault,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async deleteRole(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  async getRoleById(id: string): Promise<Role | null> {
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
      permissions: role.permissions as any,
      description: role.description,
      isDefault: role.isDefault,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async getAllRoles(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return roles.map(role => ({
      id: role.id,
      slug: role.slug,
      name: role.name,
      permissions: role.permissions as any,
      description: role.description,
      isDefault: role.isDefault,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }

  async getUserRoles(userId: string): Promise<Role[]> {
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
      permissions: ur.role.permissions as any,
      description: ur.role.description,
      isDefault: ur.role.isDefault,
      createdBy: ur.role.createdBy,
      updatedBy: ur.role.updatedBy,
      createdAt: ur.role.createdAt,
      updatedAt: ur.role.updatedAt,
    }));
  }

  async hasPermission(user: User & { roles: Role[] }, permission: string): Promise<boolean> {
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

  private roleHasPermission(role: Role, permission: string): boolean {
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

  async getUserPermissions(userId: string): Promise<string[]> {
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

    const userWithRoles: User & { roles: Role[] } = {
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
        permissions: ur.role.permissions as any,
        description: ur.role.description,
        isDefault: ur.role.isDefault,
        createdBy: ur.role.createdBy,
        updatedBy: ur.role.updatedBy,
        createdAt: ur.role.createdAt,
        updatedAt: ur.role.updatedAt,
      })),
    };

    const permissions: string[] = [];

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

