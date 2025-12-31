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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const types_1 = require("../models/types");
const core_1 = require("@cms/core");
class MediaService {
    prisma;
    config;
    constructor(prisma, config = types_1.DEFAULT_UPLOAD_CONFIG) {
        this.prisma = prisma;
        this.config = config;
    }
    // File operations
    async createFile(data) {
        const file = await this.prisma.mediaFile.create({
            data: {
                ...data,
                disk: data.disk || 'local',
                isPublic: data.isPublic ?? true,
            },
            include: {
                user: true,
                folder: true,
            },
        });
        return {
            ...file,
            url: this.getFileUrl(file),
            thumbnailUrl: this.getThumbnailUrl(file),
        };
    }
    async updateFile(id, data) {
        const file = await this.prisma.mediaFile.update({
            where: { id },
            data,
            include: {
                user: true,
                folder: true,
            },
        });
        return {
            ...file,
            url: this.getFileUrl(file),
            thumbnailUrl: this.getThumbnailUrl(file),
        };
    }
    async deleteFile(id) {
        const file = await this.prisma.mediaFile.findUnique({
            where: { id },
            select: { path: true },
        });
        if (file) {
            // Delete physical file
            try {
                fs.unlinkSync(file.path);
            }
            catch (error) {
                console.warn(`Failed to delete physical file: ${file.path}`, error);
            }
            // Delete from database
            await this.prisma.mediaFile.delete({
                where: { id },
            });
        }
    }
    async getFile(id) {
        const file = await this.prisma.mediaFile.findUnique({
            where: { id },
            include: {
                user: true,
                folder: true,
            },
        });
        if (!file)
            return null;
        return {
            ...file,
            url: this.getFileUrl(file),
            thumbnailUrl: this.getThumbnailUrl(file),
        };
    }
    async listFiles(options = {}) {
        const { page = 1, perPage = 20, sortBy = 'createdAt', sortOrder = 'desc', filters = {}, } = options;
        const where = {};
        // Apply filters
        if (filters.folderId !== undefined) {
            where.folderId = filters.folderId;
        }
        if (filters.userId) {
            where.userId = filters.userId;
        }
        if (filters.mimeType) {
            where.mimeType = {
                startsWith: filters.mimeType,
            };
        }
        if (filters.isPublic !== undefined) {
            where.isPublic = filters.isPublic;
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { alt: { contains: filters.search } },
                { description: { contains: filters.search } },
            ];
        }
        const [files, total] = await Promise.all([
            this.prisma.mediaFile.findMany({
                where,
                include: {
                    user: true,
                    folder: true,
                },
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.mediaFile.count({ where }),
        ]);
        // Add computed URLs
        const filesWithUrls = files.map(file => ({
            ...file,
            url: this.getFileUrl(file),
            thumbnailUrl: this.getThumbnailUrl(file),
        }));
        return {
            files: filesWithUrls,
            folders: [], // Will be populated separately
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }
    // Folder operations
    async createFolder(data) {
        const slug = data.slug || core_1.SlugService.transliterate(data.name);
        return this.prisma.mediaFolder.create({
            data: {
                ...data,
                slug,
                parentId: data.parentId || 0,
            },
            include: {
                user: true,
                parent: true,
                children: true,
                _count: {
                    select: { files: true },
                },
            },
        });
    }
    async updateFolder(id, data) {
        const updateData = { ...data };
        if (data.name) {
            updateData.slug = data.slug || core_1.SlugService.transliterate(data.name);
        }
        return this.prisma.mediaFolder.update({
            where: { id },
            data: updateData,
            include: {
                user: true,
                parent: true,
                children: true,
                _count: {
                    select: { files: true },
                },
            },
        });
    }
    async deleteFolder(id) {
        // Move files to parent folder or root
        const folder = await this.prisma.mediaFolder.findUnique({
            where: { id },
            select: { parentId: true },
        });
        if (folder) {
            await this.prisma.mediaFile.updateMany({
                where: { folderId: id },
                data: { folderId: folder.parentId || null },
            });
        }
        // Delete folder
        await this.prisma.mediaFolder.delete({
            where: { id },
        });
    }
    async getFolderTree() {
        const folders = await this.prisma.mediaFolder.findMany({
            include: {
                children: {
                    include: {
                        children: true,
                        _count: {
                            select: { files: true },
                        },
                    },
                    _count: {
                        select: { files: true },
                    },
                },
                _count: {
                    select: { files: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        const folderMap = new Map();
        const roots = [];
        // Create all folder nodes
        folders.forEach(folder => {
            const node = {
                id: folder.id,
                name: folder.name,
                slug: folder.slug,
                parentId: folder.parentId,
                color: folder.color,
                children: [],
                fileCount: folder._count.files,
            };
            folderMap.set(folder.id, node);
        });
        // Build hierarchy
        folderMap.forEach(folder => {
            if (folder.parentId === 0 || folder.parentId === null) {
                roots.push(folder);
            }
            else {
                const parent = folderMap.get(folder.parentId);
                if (parent) {
                    parent.children.push(folder);
                }
            }
        });
        return roots;
    }
    // Gallery operations
    async createGallery(data) {
        const gallery = await this.prisma.mediaGallery.create({
            data: {
                name: data.name,
                description: data.description,
                isFeatured: data.isFeatured || false,
                userId: data.userId,
                slug: data.slug,
            },
            include: {
                user: true,
                items: {
                    include: {
                        file: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
        // Add files to gallery if provided
        if (data.fileIds && data.fileIds.length > 0) {
            await this.addFilesToGallery(gallery.id, data.fileIds);
        }
        return gallery;
    }
    async addFilesToGallery(galleryId, fileIds) {
        // Get current max order
        const lastItem = await this.prisma.mediaGalleryItem.findFirst({
            where: { galleryId },
            orderBy: { order: 'desc' },
        });
        const startOrder = lastItem ? lastItem.order + 1 : 0;
        const items = fileIds.map((fileId, index) => ({
            galleryId,
            fileId,
            order: startOrder + index,
        }));
        await this.prisma.mediaGalleryItem.createMany({
            data: items,
        });
    }
    // Utility methods
    getFileUrl(file) {
        return `/uploads/media/${file.path}`;
    }
    getThumbnailUrl(file) {
        if (file.mimeType.startsWith('image/')) {
            return `/uploads/media/thumbnails/${file.path}`;
        }
        return undefined;
    }
    generateFileHash(buffer) {
        return (0, crypto_1.createHash)('sha256').update(buffer).digest('hex');
    }
    getFileExtension(filename) {
        return path.extname(filename).toLowerCase();
    }
    sanitizeFileName(filename) {
        return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    }
    isValidMimeType(mimeType) {
        return this.config.allowedMimeTypes.includes(mimeType);
    }
    isValidFileSize(size) {
        return size <= this.config.maxFileSize;
    }
}
exports.MediaService = MediaService;
