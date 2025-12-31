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
exports.uploadUtils = exports.UploadUtils = void 0;
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const types_1 = require("../models/types");
class UploadUtils {
    config;
    constructor(config = types_1.DEFAULT_UPLOAD_CONFIG) {
        this.config = config;
        this.ensureDirectories();
    }
    // Multer storage configuration
    getMulterStorage() {
        return multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                const folderId = req.body.folderId;
                const folderPath = folderId
                    ? path.join(this.config.uploadPath, `folder-${folderId}`)
                    : this.config.uploadPath;
                this.ensureDirectory(folderPath);
                cb(null, folderPath);
            },
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
                const extension = path.extname(sanitizedName);
                const basename = path.basename(sanitizedName, extension);
                const filename = `${basename}-${timestamp}${extension}`;
                cb(null, filename);
            },
        });
    }
    // Multer upload configuration
    getMulterUpload() {
        return (0, multer_1.default)({
            storage: this.getMulterStorage(),
            limits: {
                fileSize: this.config.maxFileSize,
            },
            fileFilter: (req, file, cb) => {
                if (this.config.allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(new Error(`File type ${file.mimetype} is not allowed`));
                }
            },
        });
    }
    // Process uploaded file
    async processUploadedFile(file, mediaService, userId, folderId) {
        const filePath = path.relative(this.config.uploadPath, file.path);
        const fileHash = mediaService.generateFileHash(fs.readFileSync(file.path));
        // Check for duplicates
        const existingFile = await mediaService.prisma.mediaFile.findFirst({
            where: { fileHash },
        });
        if (existingFile) {
            // Delete uploaded file and return existing
            fs.unlinkSync(file.path);
            return await mediaService.getFile(existingFile.id);
        }
        // Create media file record
        const mediaFile = await mediaService.createFile({
            name: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            path: filePath,
            fileSize: file.size,
            fileHash,
            userId,
            folderId: folderId || undefined,
        });
        // Generate thumbnails for images
        if (this.config.generateThumbnails && file.mimetype.startsWith('image/')) {
            await this.generateThumbnails(file.path, filePath);
        }
        return mediaFile;
    }
    // Generate image thumbnails
    async generateThumbnails(originalPath, relativePath) {
        const thumbnailDir = path.join(this.config.uploadPath, 'thumbnails');
        this.ensureDirectory(thumbnailDir);
        for (const [sizeName, dimensions] of Object.entries(this.config.thumbnailSizes)) {
            const thumbnailPath = path.join(thumbnailDir, `${sizeName}_${relativePath}`);
            // Ensure thumbnail subdirectories exist
            const thumbnailSubDir = path.dirname(thumbnailPath);
            this.ensureDirectory(thumbnailSubDir);
            await (0, sharp_1.default)(originalPath)
                .resize(dimensions.width, dimensions.height, {
                fit: 'cover',
                position: 'center',
            })
                .jpeg({ quality: 80 })
                .toFile(thumbnailPath);
        }
    }
    // Ensure directory exists
    ensureDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    // Ensure all required directories exist
    ensureDirectories() {
        this.ensureDirectory(this.config.uploadPath);
        if (this.config.generateThumbnails) {
            const thumbnailDir = path.join(this.config.uploadPath, 'thumbnails');
            this.ensureDirectory(thumbnailDir);
        }
    }
    // Clean up uploaded files (for failed uploads)
    cleanupFiles(files) {
        files.forEach(file => {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
            catch (error) {
                console.warn(`Failed to cleanup file: ${file.path}`, error);
            }
        });
    }
    // Get file stats
    getFileStats(filePath) {
        try {
            return fs.statSync(filePath);
        }
        catch (error) {
            return null;
        }
    }
}
exports.UploadUtils = UploadUtils;
// Export singleton instance
exports.uploadUtils = new UploadUtils();
