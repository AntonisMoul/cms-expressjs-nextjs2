import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthMiddleware } from '@cms/core';
import { PrismaClient } from '@cms/core';
import { ApiResponse } from '@cms/shared';

const router = Router();
const prisma = new PrismaClient();
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const createUserValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').optional().isLength({ min: 1, max: 120 }),
  body('lastName').optional().isLength({ min: 1, max: 120 }),
  body('username').optional().isLength({ min: 3, max: 60 }),
];

const updateUserValidation = [
  param('user').isInt(),
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().isLength({ min: 1, max: 120 }),
  body('lastName').optional().isLength({ min: 1, max: 120 }),
  body('username').optional().isLength({ min: 3, max: 60 }),
];

// Routes
router.get('/',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('users.index'),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 15;
      const search = req.query.search as string;

      const where: any = {};
      if (search) {
        where.OR = [
          { email: { contains: search } },
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { username: { contains: search } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      // Transform users to exclude sensitive data
      const transformedUsers = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        superUser: user.superUser,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.roles.map(ur => ur.role),
      }));

      res.json({
        success: true,
        data: {
          users: transformedUsers,
          pagination: {
            currentPage: page,
            lastPage: Math.ceil(total / perPage),
            perPage,
            total,
          },
        },
      } as ApiResponse);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get users',
      } as ApiResponse);
    }
  }
);

router.get('/:user',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('users.edit'),
  param('user').isInt(),
  async (req, res) => {
    try {
      const userId = parseInt(req.params.user);

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
        return res.status(404).json({
          success: false,
          message: 'User not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { user },
      } as ApiResponse);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user',
      } as ApiResponse);
    }
  }
);

export default router;
