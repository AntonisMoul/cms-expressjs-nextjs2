import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@cms/shared';

export interface AuthResult {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor(
    private db: PrismaClient,
    options?: {
      jwtSecret?: string;
      jwtExpiresIn?: string;
    }
  ) {
    this.jwtSecret = options?.jwtSecret || process.env.JWT_SECRET || 'change-me-in-production';
    this.jwtExpiresIn = options?.jwtExpiresIn || process.env.JWT_EXPIRES_IN || '7d';
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    if (!user.password) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await this.db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: number };
      const user = await this.db.user.findUnique({
        where: { id: decoded.userId },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async verifyToken(token: string): Promise<{ userId: number } | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: number };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

