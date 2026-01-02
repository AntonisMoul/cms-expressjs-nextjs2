import { PrismaClient } from '@cms/shared';

export class RBACService {
  constructor(private db: PrismaClient) {}

  async checkPermission(userId: number, permission: string): Promise<boolean> {
    // Check if user is super user
    const user = await this.db.user.findUnique({
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
      return false;
    }

    // Super users bypass all permission checks
    if (user.superUser) {
      return true;
    }

    // Check user's direct permissions
    if (user.permissions) {
      const userPermissions = this.parsePermissions(user.permissions);
      if (this.hasPermission(userPermissions, permission)) {
        return true;
      }
    }

    // Check role permissions
    for (const roleUser of user.roles) {
      const role = roleUser.role;
      if (role.permissions) {
        const rolePermissions = this.parsePermissions(role.permissions);
        if (this.hasPermission(rolePermissions, permission)) {
          return true;
        }
      }
    }

    return false;
  }

  async getUserRoles(userId: number) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return user?.roles.map((ru) => ru.role) || [];
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.db.user.findUnique({
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

    const permissions = new Set<string>();

    // Add user's direct permissions
    if (user.permissions) {
      const userPermissions = this.parsePermissions(user.permissions);
      userPermissions.forEach((p) => permissions.add(p));
    }

    // Add role permissions
    for (const roleUser of user.roles) {
      const role = roleUser.role;
      if (role.permissions) {
        const rolePermissions = this.parsePermissions(role.permissions);
        rolePermissions.forEach((p) => permissions.add(p));
      }
    }

    return Array.from(permissions);
  }

  private parsePermissions(permissions: string): string[] {
    try {
      // Permissions can be JSON array or comma-separated string
      const parsed = JSON.parse(permissions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If not JSON, treat as comma-separated
      return permissions.split(',').map((p) => p.trim()).filter(Boolean);
    }
  }

  private hasPermission(permissions: string[], permission: string): boolean {
    // Exact match
    if (permissions.includes(permission)) {
      return true;
    }

    // Wildcard match (e.g., "pages.*" matches "pages.create")
    const wildcardPermissions = permissions.filter((p) => p.endsWith('.*'));
    for (const wildcard of wildcardPermissions) {
      const prefix = wildcard.slice(0, -2); // Remove ".*"
      if (permission.startsWith(prefix + '.')) {
        return true;
      }
    }

    return false;
  }
}

