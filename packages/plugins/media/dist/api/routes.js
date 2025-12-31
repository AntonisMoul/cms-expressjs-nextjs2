"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const mediaService_1 = require("../services/mediaService");
const upload_1 = require("../utils/upload");
const core_1 = require("@cms/core");
const core_2 = require("@cms/core");
const router = (0, express_1.Router)();
const prisma = new core_1.PrismaClient();
const mediaService = new mediaService_1.MediaService(prisma);
const auditService = new core_2.AuditService(prisma);
const authMiddleware = new core_2.AuthMiddleware(prisma);
// Validation rules
const uploadValidation = [
    (0, express_validator_1.body)('folderId').optional().isInt(),
    (0, express_validator_1.body)('alt').optional().isLength({ max: 255 }),
    (0, express_validator_1.body)('description').optional().isString(),
];
const createFolderValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 255 }),
    (0, express_validator_1.body)('parentId').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('color').optional().isHexColor(),
];
const updateFileValidation = [
    (0, express_validator_1.param)('id').isInt(),
    (0, express_validator_1.body)('name').optional().isLength({ min: 1, max: 255 }),
    (0, express_validator_1.body)('alt').optional().isLength({ max: 255 }),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('folderId').optional().isInt(),
    (0, express_validator_1.body)('isPublic').optional().isBoolean(),
];
const createGalleryValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 120 }),
    (0, express_validator_1.body)('description').optional().isLength({ max: 400 }),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('fileIds').optional().isArray(),
];
// ==================== FILE UPLOAD ====================
// POST /api/v1/media/upload - Upload files
router.post('/upload', authMiddleware.authenticate, authMiddleware.requirePermission('media.upload'), upload_1.uploadUtils.getMulterUpload().array('files'), async (req, res) => {
    try {
        const files = req.files;
        const { folderId, alt, description } = req.body;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded',
            });
        }
        const uploadedFiles = [];
        for (const file of files) {
            try {
                const mediaFile = await upload_1.uploadUtils.processUploadedFile(file, mediaService, req.user.userId, folderId ? parseInt(folderId) : undefined);
                // Update metadata if provided
                if (alt || description) {
                    await mediaService.updateFile(mediaFile.id, {
                        alt: alt || undefined,
                        description: description || undefined,
                    });
                }
                uploadedFiles.push(mediaFile);
            }
            catch (error) {
                console.error(`Failed to process file ${file.originalname}:`, error);
                // Continue with other files
            }
        }
        // Audit log
        await auditService.logAction(req.user.userId, 'media', 'upload', 0, `${uploadedFiles.length} files uploaded`);
        res.status(201).json({
            success: true,
            data: { files: uploadedFiles },
            message: `${uploadedFiles.length} files uploaded successfully`,
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        // Cleanup uploaded files on error
        if (req.files) {
            upload_1.uploadUtils.cleanupFiles(req.files);
        }
        res.status(500).json({
            success: false,
            message: 'Upload failed',
        });
    }
});
// ==================== FILE MANAGEMENT ====================
// GET /api/v1/media/files - List files
router.get('/files', authMiddleware.authenticate, authMiddleware.requirePermission('media.index'), async (req, res) => {
    try {
        const options = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            perPage: req.query.perPage ? parseInt(req.query.perPage) : 20,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
            filters: {
                folderId: req.query.folderId ? parseInt(req.query.folderId) : undefined,
                mimeType: req.query.mimeType,
                isPublic: req.query.isPublic ? req.query.isPublic === 'true' : undefined,
                search: req.query.search,
            },
        };
        const result = await mediaService.listFiles(options);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error('List files error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list files',
        });
    }
});
// GET /api/v1/media/files/:id - Get file details
router.get('/files/:id', authMiddleware.authenticate, authMiddleware.requirePermission('media.index'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const file = await mediaService.getFile(id);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found',
            });
        }
        res.json({
            success: true,
            data: { file },
        });
    }
    catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get file',
        });
    }
});
// PUT /api/v1/media/files/:id - Update file metadata
router.put('/files/:id', authMiddleware.authenticate, authMiddleware.requirePermission('media.edit'), updateFileValidation, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const file = await mediaService.updateFile(id, req.body);
        res.json({
            success: true,
            data: { file },
            message: 'File updated successfully',
        });
    }
    catch (error) {
        console.error('Update file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update file',
        });
    }
});
// DELETE /api/v1/media/files/:id - Delete file
router.delete('/files/:id', authMiddleware.authenticate, authMiddleware.requirePermission('media.delete'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const file = await mediaService.getFile(id);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found',
            });
        }
        await mediaService.deleteFile(id);
        // Audit log
        await auditService.logDelete(req.user.userId, 'media', id, file.name);
        res.json({
            success: true,
            message: 'File deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
        });
    }
});
// ==================== FOLDER MANAGEMENT ====================
// GET /api/v1/media/folders/tree - Get folder tree
router.get('/folders/tree', authMiddleware.authenticate, authMiddleware.requirePermission('media.index'), async (req, res) => {
    try {
        const tree = await mediaService.getFolderTree();
        res.json({
            success: true,
            data: { folders: tree },
        });
    }
    catch (error) {
        console.error('Get folder tree error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get folder tree',
        });
    }
});
// POST /api/v1/media/folders - Create folder
router.post('/folders', authMiddleware.authenticate, authMiddleware.requirePermission('media.edit'), createFolderValidation, async (req, res) => {
    try {
        const folder = await mediaService.createFolder({
            ...req.body,
            userId: req.user.userId,
        });
        res.status(201).json({
            success: true,
            data: { folder },
            message: 'Folder created successfully',
        });
    }
    catch (error) {
        console.error('Create folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create folder',
        });
    }
});
// PUT /api/v1/media/folders/:id - Update folder
router.put('/folders/:id', authMiddleware.authenticate, authMiddleware.requirePermission('media.edit'), (0, express_validator_1.param)('id').isInt(), createFolderValidation, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const folder = await mediaService.updateFolder(id, req.body);
        res.json({
            success: true,
            data: { folder },
            message: 'Folder updated successfully',
        });
    }
    catch (error) {
        console.error('Update folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update folder',
        });
    }
});
// DELETE /api/v1/media/folders/:id - Delete folder
router.delete('/folders/:id', authMiddleware.authenticate, authMiddleware.requirePermission('media.edit'), (0, express_validator_1.param)('id').isInt(), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await mediaService.deleteFolder(id);
        res.json({
            success: true,
            message: 'Folder deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete folder',
        });
    }
});
// ==================== GALLERY MANAGEMENT ====================
// GET /api/v1/media/galleries - List galleries
router.get('/galleries', authMiddleware.authenticate, authMiddleware.requirePermission('media.index'), async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : 15;
        const [galleries, total] = await Promise.all([
            prisma.mediaGallery.findMany({
                include: {
                    user: true,
                    _count: {
                        select: { items: true },
                    },
                },
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.mediaGallery.count(),
        ]);
        res.json({
            success: true,
            data: {
                galleries,
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
        console.error('List galleries error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list galleries',
        });
    }
});
// POST /api/v1/media/galleries - Create gallery
router.post('/galleries', authMiddleware.authenticate, authMiddleware.requirePermission('media.edit'), createGalleryValidation, async (req, res) => {
    try {
        const gallery = await mediaService.createGallery({
            ...req.body,
            userId: req.user.userId,
        });
        res.status(201).json({
            success: true,
            data: { gallery },
            message: 'Gallery created successfully',
        });
    }
    catch (error) {
        console.error('Create gallery error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create gallery',
        });
    }
});
exports.default = router;
