"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMediaRoutes = registerMediaRoutes;
const multer_1 = __importDefault(require("multer"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const utils_1 = require("@cms/shared/utils");
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'storage', 'app', 'public', 'media');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${(0, utils_1.generateUuid)()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
function registerMediaRoutes(router, ctx, requireAuth, requirePermission) {
    const db = ctx.db;
    const queueService = ctx.queue;
    const auditService = ctx.audit;
    // List media files
    router.get('/media', requireAuth, requirePermission('media.index'), async (req, res) => {
        try {
            const { folderId = '0', page = '1', perPage = '50' } = req.query;
            const folderIdNum = parseInt(folderId);
            const pageNum = parseInt(page);
            const perPageNum = parseInt(perPage);
            const skip = (pageNum - 1) * perPageNum;
            const where = {
                folderId: folderIdNum,
                deletedAt: null,
            };
            const [files, total] = await Promise.all([
                db.mediaFile.findMany({
                    where,
                    include: {
                        folder: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: perPageNum,
                }),
                db.mediaFile.count({ where }),
            ]);
            res.json({
                success: true,
                data: {
                    files,
                    meta: {
                        currentPage: pageNum,
                        perPage: perPageNum,
                        total,
                        lastPage: Math.ceil(total / perPageNum),
                    },
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // List folders
    router.get('/media/folders', requireAuth, requirePermission('media.index'), async (req, res) => {
        try {
            const { parentId = '0' } = req.query;
            const parentIdNum = parseInt(parentId);
            const folders = await db.mediaFolder.findMany({
                where: {
                    parentId: parentIdNum,
                    deletedAt: null,
                },
                orderBy: { name: 'asc' },
            });
            res.json({
                success: true,
                data: { folders },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Upload file
    router.post('/media/upload', requireAuth, requirePermission('media.upload'), upload.single('file'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded',
                });
            }
            const userId = req.user.id;
            const { folderId = '0' } = req.body;
            const folderIdNum = parseInt(folderId);
            const filePath = `/media/${req.file.filename}`;
            const fullUrl = `${process.env.APP_URL || 'http://localhost:3000'}${filePath}`;
            // Create media file record
            const mediaFile = await db.mediaFile.create({
                data: {
                    name: req.file.originalname,
                    folderId: folderIdNum,
                    mimeType: req.file.mimetype,
                    size: req.file.size,
                    url: fullUrl,
                    userId,
                },
            });
            // Enqueue image processing if it's an image
            if (req.file.mimetype.startsWith('image/')) {
                await queueService.enqueue('media.processImage', {
                    mediaFileId: mediaFile.id,
                    filePath: req.file.filename,
                    mimeType: req.file.mimetype,
                });
            }
            // Audit log
            await auditService.log({
                userId,
                module: 'media',
                action: 'upload',
                referenceId: BigInt(mediaFile.id),
                referenceName: req.file.originalname,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.status(201).json({
                success: true,
                data: { file: mediaFile },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Delete file
    router.delete('/media/:id', requireAuth, requirePermission('media.delete'), async (req, res) => {
        try {
            const fileId = parseInt(req.params.id);
            const userId = req.user.id;
            const file = await db.mediaFile.findUnique({
                where: { id: fileId },
            });
            if (!file) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found',
                });
            }
            // Soft delete
            await db.mediaFile.update({
                where: { id: fileId },
                data: { deletedAt: new Date() },
            });
            // Audit log
            await auditService.log({
                userId,
                module: 'media',
                action: 'delete',
                referenceId: BigInt(fileId),
                referenceName: file.name,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.json({
                success: true,
                message: 'File deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Create folder
    router.post('/media/folders', requireAuth, requirePermission('media.upload'), async (req, res) => {
        try {
            const { name, parentId = 0 } = req.body;
            const userId = req.user.id;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    error: 'Folder name is required',
                });
            }
            const folder = await db.mediaFolder.create({
                data: {
                    name,
                    parentId: parseInt(parentId),
                    userId,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                },
            });
            res.status(201).json({
                success: true,
                data: { folder },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
}
//# sourceMappingURL=routes.js.map