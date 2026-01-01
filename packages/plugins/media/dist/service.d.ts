import { PrismaClient } from '@prisma/client';
import { MediaFolder, MediaFile, CreateMediaFolderRequest, UpdateMediaFolderRequest, MediaListRequest, PaginatedResponse } from '@cms/core';
export declare class MediaService {
    private prisma;
    private uploadPath;
    constructor(prisma: PrismaClient);
    createFolder(data: CreateMediaFolderRequest, userId: string): Promise<MediaFolder>;
    updateFolder(id: string, data: UpdateMediaFolderRequest): Promise<MediaFolder>;
    deleteFolder(id: string): Promise<void>;
    getFolders(): Promise<MediaFolder[]>;
    getFolderTree(): Promise<any[]>;
    private buildFolderTree;
    uploadFile(file: Express.Multer.File, folderId: string | undefined, userId: string, visibility?: string): Promise<MediaFile>;
    getFiles(options?: MediaListRequest): Promise<PaginatedResponse<MediaFile>>;
    updateFile(id: string, data: {
        name?: string;
        alt?: string;
        folderId?: string;
    }): Promise<MediaFile>;
    deleteFile(id: string): Promise<void>;
    moveFile(id: string, newFolderId: string): Promise<MediaFile>;
    private slugify;
    getFileById(id: string): Promise<MediaFile | null>;
    getStorageUsage(userId: string): Promise<{
        used: number;
        files: number;
    }>;
    deleteFiles(fileIds: string[]): Promise<void>;
    moveFiles(fileIds: string[], newFolderId: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map