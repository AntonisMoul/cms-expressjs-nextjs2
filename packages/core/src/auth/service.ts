import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { User, LoginRequest, RegisterRequest, CreateUserRequest, UpdateUserRequest, AuthTokens } from '../types';
import { generateTokens, verifyRefreshToken } from './jwt';

const SALT_ROUNDS = 12;

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthTokens } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await this.verifyPassword(credentials.password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = generateTokens(user.id, user.email);

    return {
      user: {
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
      },
      tokens,
    };
  }

  async register(data: RegisterRequest): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      },
    });

    // Assign default role if exists
    const defaultRole = await this.prisma.role.findFirst({
      where: { isDefault: true },
    });

    if (defaultRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id,
        },
      });
    }

    return {
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
    };
  }

  async createUser(data: CreateUserRequest, createdBy: string): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      },
    });

    // Assign roles
    if (data.roleIds && data.roleIds.length > 0) {
      await this.prisma.userRole.createMany({
        data: data.roleIds.map(roleId => ({
          userId: user.id,
          roleId,
        })),
      });
    }

    return {
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
    };
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const updateData: any = {};

    if (data.email) updateData.email = data.email;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.username !== undefined) updateData.username = data.username;

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Update roles if provided
    if (data.roleIds !== undefined) {
      // Remove existing roles
      await this.prisma.userRole.deleteMany({
        where: { userId: id },
      });

      // Add new roles
      if (data.roleIds.length > 0) {
        await this.prisma.userRole.createMany({
          data: data.roleIds.map(roleId => ({
            userId: id,
            roleId,
          })),
        });
      }
    }

    return {
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
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
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
    };
  }

  async getUserWithRoles(id: string): Promise<User & { roles: any[] } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
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
      roles: user.roles.map(ur => ur.role),
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens | null> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await this.getUserById(payload.userId);

      if (!user) {
        return null;
      }

      return generateTokens(user.id, user.email);
    } catch (error) {
      return null;
    }
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

