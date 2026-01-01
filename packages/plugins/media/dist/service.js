"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class MediaService {
    prisma;
    uploadPath;
    constructor(prisma) {
        this.prisma = prisma;
        this.uploadPath = process.env.UPLOAD_PATH || './uploads';
    }
    // Folder operations
    async createFolder(data, userId) {
        const slug = data.name ? this.slugify(data.name) : `folder-${Date.now()}`;
        const folder = await this.prisma.mediaFolder.create({
            data: {
                userId,
                name: data.name,
                slug,
                parentId: data.parentId || '0',
                color: data.color,
            },
        });
        return {
            id: folder.id,
            userId: folder.userId,
            name: folder.name,
            slug: folder.slug,
            parentId: folder.parentId,
            color: folder.color,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            deletedAt: folder.deletedAt || undefined,
        };
    }
    async updateFolder(id, data) {
        const updateData = {};
        if (data.name !== undefined) {
            updateData.name = data.name;
            updateData.slug = this.slugify(data.name);
        }
        if (data.parentId !== undefined)
            updateData.parentId = data.parentId;
        if (data.color !== undefined)
            updateData.color = data.color;
        const folder = await this.prisma.mediaFolder.update({
            where: { id },
            data: updateData,
        });
        return {
            id: folder.id,
            userId: folder.userId,
            name: folder.name,
            slug: folder.slug,
            parentId: folder.parentId,
            color: folder.color,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            deletedAt: folder.deletedAt || undefined,
        };
    }
    async deleteFolder(id) {
        // Move all files in this folder to root
        await this.prisma.mediaFile.updateMany({
            where: { folderId: id },
            data: { folderId: '0' },
        });
        // Delete the folder
        await this.prisma.mediaFolder.delete({
            where: { id },
        });
    }
    async getFolders() {
        const folders = await this.prisma.mediaFolder.findMany({
            where: { deletedAt: null },
            orderBy: [
                { parentId: 'asc' },
                { name: 'asc' },
            ],
        });
        return folders.map(folder => ({
            id: folder.id,
            userId: folder.userId,
            name: folder.name,
            slug: folder.slug,
            parentId: folder.parentId,
            color: folder.color,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            deletedAt: folder.deletedAt || undefined,
        }));
    }
    async getFolderTree() {
        const folders = await this.getFolders();
        return this.buildFolderTree(folders);
    }
    buildFolderTree(folders) {
        const folderMap = new Map();
        const rootFolders = [];
        // Create folder objects
        folders.forEach(folder => {
            folderMap.set(folder.id, {
                ...folder,
                children: [],
            });
        });
        // Build tree structure
        folders.forEach(folder => {
            const folderObj = folderMap.get(folder.id);
            if (folder.parentId === '0') {
                rootFolders.push(folderObj);
            }
            else {
                const parent = folderMap.get(folder.parentId);
                if (parent) {
                    parent.children.push(folderObj);
                }
                else {
                    // Parent doesn't exist, treat as root
                    rootFolders.push(folderObj);
                }
            }
        });
        return rootFolders;
    }
    // File operations
    async uploadFile(file, folderId = '0', userId, visibility = 'public') {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path_1.default.join(this.uploadPath, fileName);
        // Ensure upload directory exists
        await promises_1.default.mkdir(path_1.default.dirname(filePath), { recursive: true });
        // Move file to upload directory
        await promises_1.default.writeFile(filePath, file.buffer);
        // Create database record
        const mediaFile = await this.prisma.mediaFile.create({
            data: {
                userId,
                name: file.originalname,
                folderId,
                mimeType: file.mimetype,
                size: file.size,
                url: `/uploads/${fileName}`,
                visibility,
            },
        });
        return {
            id: mediaFile.id,
            userId: mediaFile.userId,
            name: mediaFile.name,
            folderId: mediaFile.folderId,
            mimeType: mediaFile.mimeType,
            size: mediaFile.size,
            url: mediaFile.url,
            options: mediaFile.options || undefined,
            alt: mediaFile.alt || undefined,
            visibility: mediaFile.visibility,
            createdAt: mediaFile.createdAt,
            updatedAt: mediaFile.updatedAt,
            deletedAt: mediaFile.deletedAt || undefined,
        };
    }
    async getFiles(options = {}) {
        const { folderId = '0', search, type, page = 1, limit = 20, } = options;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            folderId,
        };
        if (search) {
            where.name = {
                contains: search,
            };
        }
        if (type) {
            if (type === 'image') {
                where.mimeType = {
                    startsWith: 'image/',
                };
            }
            else if (type === 'video') {
                where.mimeType = {
                    startsWith: 'video/',
                };
            }
            else if (type === 'audio') {
                where.mimeType = {
                    startsWith: 'audio/',
                };
            }
            else if (type === 'document') {
                where.mimeType = {
                    in: [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'text/plain',
                    ],
                };
            }
        }
        const [files, total] = await Promise.all([
            this.prisma.mediaFile.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.mediaFile.count({ where }),
        ]);
        const data = files.map(file => ({
            id: file.id,
            userId: file.userId,
            name: file.name,
            folderId: file.folderId,
            mimeType: file.mimetype,
            size: file.size,
            url: file.url,
            options: file.options || undefined,
            alt: file.alt || undefined,
            visibility: file.visibility,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            deletedAt: file.deletedAt || undefined,
        }));
        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateFile(id, data) {
        const file = await this.prisma.mediaFile.update({
            where: { id },
            data,
        });
        return {
            id: file.id,
            userId: file.userId,
            name: file.name,
            folderId: file.folderId,
            mimeType: file.mimeType,
            size: file.size,
            url: file.url,
            options: file.options || undefined,
            alt: file.alt || undefined,
            visibility: file.visibility,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            deletedAt: file.deletedAt || undefined,
        };
    }
    async deleteFile(id) {
        const file = await this.prisma.mediaFile.findUnique({
            where: { id },
        });
        if (file) {
            // Delete physical file
            try {
                const filePath = path_1.default.join(process.cwd(), 'public', file.url);
                await promises_1.default.unlink(filePath);
            }
            catch (error) {
                // File might not exist, continue with database deletion
                console.warn(`Could not delete physical file: ${file.url}`);
            }
            // Soft delete from database
            await this.prisma.mediaFile.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        }
    }
    async moveFile(id, newFolderId) {
        const file = await this.prisma.mediaFile.update({
            where: { id },
            data: { folderId: newFolderId },
        });
        return {
            id: file.id,
            userId: file.userId,
            name: file.name,
            folderId: file.folderId,
            mimeType: file.mimeType,
            size: file.size,
            url: file.url,
            options: file.options || undefined,
            alt: file.alt || undefined,
            visibility: file.visibility,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            deletedAt: file.deletedAt || undefined,
        };
    }
    // Utility methods
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
    async getFileById(id) {
        const file = await this.prisma.mediaFile.findUnique({
            where: { id, deletedAt: null },
        });
        if (!file)
            return null;
        return {
            id: file.id,
            userId: file.userId,
            name: file.name,
            folderId: file.folderId,
            mimeType: file.mimeType,
            size: file.size,
            url: file.url,
            options: file.options || undefined,
            alt: file.alt || undefined,
            visibility: file.visibility,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            deletedAt: file.deletedAt || undefined,
        };
    }
    // Get storage usage for user
    async getStorageUsage(userId) {
        const result = await this.prisma.mediaFile.aggregate({
            where: {
                userId,
                deletedAt: null,
            },
            _sum: {
                size: true,
            },
            _count: {
                id: true,
            },
        });
        return {
            used: result._sum.size || 0,
            files: result._count.id,
        };
    }
    // Bulk operations
    async deleteFiles(fileIds) {
        const files = await this.prisma.mediaFile.findMany({
            where: { id: { in: fileIds } },
        });
        // Delete physical files
        await Promise.all(files.map(async (file) => {
            try {
                const filePath = path_1.default.join(process.cwd(), 'public', file.url);
                await promises_1.default.unlink(filePath);
            }
            catch (error) {
                console.warn(`Could not delete physical file: ${file.url}`);
            }
        }));
        // Soft delete from database
        await this.prisma.mediaFile.updateMany({
            where: { id: { in: fileIds } },
            data: { deletedAt: new Date() },
        });
    }
    async moveFiles(fileIds, newFolderId) {
        await this.prisma.mediaFile.updateMany({
            where: { id: { in: fileIds } },
            data: { folderId: newFolderId },
        });
    }
}
exports.MediaService = MediaService;
//# sourceMappingURL=service.js.map