"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_2.PrismaClient();
const slugService = new core_1.SlugService(prisma);
const authMiddleware = new core_1.AuthMiddleware(prisma);
// Validation rules
const checkSlugValidation = [
    (0, express_validator_1.query)('entityType').isLength({ min: 1, max: 255 }),
    (0, express_validator_1.query)('locale').isLength({ min: 2, max: 20 }),
    (0, express_validator_1.query)('slug').isLength({ min: 1 }),
    (0, express_validator_1.query)('excludeId').optional().isInt(),
];
// Routes
router.get('/check', checkSlugValidation, authMiddleware.authenticate, async (req, res) => {
    try {
        const { entityType, locale, slug, excludeId } = req.query;
        const result = await slugService.checkAvailability(entityType, locale, slug, undefined, // prefix
        excludeId ? parseInt(excludeId) : undefined);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error('Check slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check slug availability',
        });
    }
});
// Generate slug from text (helper endpoint)
router.post('/generate', authMiddleware.authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Text is required',
            });
        }
        const slug = core_1.SlugService.transliterate(text);
        res.json({
            success: true,
            data: { slug },
        });
    }
    catch (error) {
        console.error('Generate slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate slug',
        });
    }
});
exports.default = router;
