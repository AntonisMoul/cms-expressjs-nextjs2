"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_2.PrismaClient();
const settingsService = new core_1.SettingsService(prisma);
const authMiddleware = new core_1.AuthMiddleware(prisma);
// Validation rules
const setSettingValidation = [
    (0, express_validator_1.body)('key').isLength({ min: 1, max: 255 }),
    (0, express_validator_1.body)('value').optional().isString(),
];
// Routes
router.get('/', authMiddleware.authenticate, authMiddleware.requirePermission('settings.index'), async (req, res) => {
    try {
        const settings = await settingsService.getAll();
        res.json({
            success: true,
            data: { settings },
        });
    }
    catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get settings',
        });
    }
});
router.get('/:key', authMiddleware.authenticate, authMiddleware.requirePermission('settings.index'), async (req, res) => {
    try {
        const { key } = req.params;
        const value = await settingsService.get(key);
        res.json({
            success: true,
            data: { key, value },
        });
    }
    catch (error) {
        console.error('Get setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get setting',
        });
    }
});
router.post('/', setSettingValidation, authMiddleware.authenticate, authMiddleware.requirePermission('settings.edit'), async (req, res) => {
    try {
        const { key, value } = req.body;
        const setting = await settingsService.set(key, value);
        res.json({
            success: true,
            data: { setting },
            message: 'Setting updated successfully',
        });
    }
    catch (error) {
        console.error('Set setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update setting',
        });
    }
});
router.put('/bulk', authMiddleware.authenticate, authMiddleware.requirePermission('settings.edit'), async (req, res) => {
    try {
        const settings = req.body;
        if (typeof settings !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Settings must be an object',
            });
        }
        await settingsService.setMultiple(settings);
        res.json({
            success: true,
            message: 'Settings updated successfully',
        });
    }
    catch (error) {
        console.error('Bulk set settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
        });
    }
});
router.delete('/:key', authMiddleware.authenticate, authMiddleware.requirePermission('settings.edit'), async (req, res) => {
    try {
        const { key } = req.params;
        await settingsService.delete(key);
        res.json({
            success: true,
            message: 'Setting deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete setting',
        });
    }
});
exports.default = router;
