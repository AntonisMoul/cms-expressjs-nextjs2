"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_2.PrismaClient();
const authMiddleware = new core_1.AuthMiddleware(prisma);
// Validation rules
const createUserValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
    (0, express_validator_1.body)('firstName').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('lastName').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('username').optional().isLength({ min: 3, max: 60 }),
];
const updateUserValidation = [
    (0, express_validator_1.param)('user').isInt(),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail(),
    (0, express_validator_1.body)('firstName').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('lastName').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('username').optional().isLength({ min: 3, max: 60 }),
];
// Routes
router.get('/', authMiddleware.authenticate, authMiddleware.requirePermission('users.index'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 15;
        const search = req.query.search;
        const where = {};
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
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users',
        });
    }
});
router.get('/:user', authMiddleware.authenticate, authMiddleware.requirePermission('users.edit'), (0, express_validator_1.param)('user').isInt(), async (req, res) => {
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
            });
        }
        res.json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user',
        });
    }
});
exports.default = router;
