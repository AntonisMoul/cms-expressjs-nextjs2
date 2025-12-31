"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_2.PrismaClient();
const localeService = new core_1.LocaleService(prisma);
const authMiddleware = new core_1.AuthMiddleware(prisma);
// Validation rules
const createLocaleValidation = [
    (0, express_validator_1.body)('code').isLength({ min: 2, max: 20 }).isAlphanumeric(),
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('flag').optional().isLength({ min: 2, max: 20 }),
    (0, express_validator_1.body)('isDefault').optional().isBoolean(),
    (0, express_validator_1.body)('isActive').optional().isBoolean(),
    (0, express_validator_1.body)('order').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('isRtl').optional().isBoolean(),
];
const updateLocaleValidation = [
    (0, express_validator_1.param)('locale').isInt(),
    (0, express_validator_1.body)('name').optional().isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('flag').optional().isLength({ min: 2, max: 20 }),
    (0, express_validator_1.body)('isDefault').optional().isBoolean(),
    (0, express_validator_1.body)('isActive').optional().isBoolean(),
    (0, express_validator_1.body)('order').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('isRtl').optional().isBoolean(),
];
// Routes
router.get('/', authMiddleware.authenticate, authMiddleware.requirePermission('locales.index'), async (req, res) => {
    try {
        const locales = await localeService.getAll();
        res.json({
            success: true,
            data: { locales },
        });
    }
    catch (error) {
        console.error('Get locales error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get locales',
        });
    }
});
router.get('/active', async (req, res) => {
    try {
        const locales = await localeService.getActive();
        res.json({
            success: true,
            data: { locales },
        });
    }
    catch (error) {
        console.error('Get active locales error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get active locales',
        });
    }
});
router.get('/default', async (req, res) => {
    try {
        const locale = await localeService.getDefault();
        res.json({
            success: true,
            data: { locale },
        });
    }
    catch (error) {
        console.error('Get default locale error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get default locale',
        });
    }
});
router.get('/:locale', authMiddleware.authenticate, authMiddleware.requirePermission('locales.edit'), (0, express_validator_1.param)('locale').isInt(), async (req, res) => {
    try {
        const localeId = parseInt(req.params.locale);
        const locale = await localeService.getByCode(req.params.locale) ||
            await prisma.language.findUnique({ where: { id: localeId } });
        if (!locale) {
            return res.status(404).json({
                success: false,
                message: 'Locale not found',
            });
        }
        res.json({
            success: true,
            data: { locale },
        });
    }
    catch (error) {
        console.error('Get locale error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get locale',
        });
    }
});
router.post('/', createLocaleValidation, authMiddleware.authenticate, authMiddleware.requirePermission('locales.create'), async (req, res) => {
    try {
        const locale = await localeService.create(req.body);
        res.status(201).json({
            success: true,
            data: { locale },
            message: 'Locale created successfully',
        });
    }
    catch (error) {
        console.error('Create locale error:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Locale code already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create locale',
        });
    }
});
router.put('/:locale', updateLocaleValidation, authMiddleware.authenticate, authMiddleware.requirePermission('locales.edit'), async (req, res) => {
    try {
        const localeId = parseInt(req.params.locale);
        const locale = await localeService.update(localeId, req.body);
        res.json({
            success: true,
            data: { locale },
            message: 'Locale updated successfully',
        });
    }
    catch (error) {
        console.error('Update locale error:', error);
        if (error.message === 'Cannot delete default locale') {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update locale',
        });
    }
});
router.delete('/:locale', authMiddleware.authenticate, authMiddleware.requirePermission('locales.delete'), (0, express_validator_1.param)('locale').isInt(), async (req, res) => {
    try {
        const localeId = parseInt(req.params.locale);
        await localeService.delete(localeId);
        res.json({
            success: true,
            message: 'Locale deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete locale error:', error);
        if (error.message === 'Cannot delete default locale') {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to delete locale',
        });
    }
});
router.put('/:locale/default', authMiddleware.authenticate, authMiddleware.requirePermission('locales.edit'), (0, express_validator_1.param)('locale').isInt(), async (req, res) => {
    try {
        const localeId = parseInt(req.params.locale);
        await localeService.setDefault(localeId);
        res.json({
            success: true,
            message: 'Default locale updated successfully',
        });
    }
    catch (error) {
        console.error('Set default locale error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to set default locale',
        });
    }
});
exports.default = router;
