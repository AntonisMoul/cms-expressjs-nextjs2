import { PrismaClient } from '@prisma/client';
import { MediaFile, MediaFolder, MediaGallery, MediaFileCreateData, MediaFileUpdateData, MediaFolderCreateData, MediaFolderUpdateData, MediaGalleryCreateData, MediaListOptions, MediaListResponse, FolderTreeNode, UploadConfig } from '../models/types';
export declare class MediaService {
    private prisma;
    private config;
    constructor(prisma: PrismaClient, config?: UploadConfig);
    createFile(data: MediaFileCreateData): Promise<MediaFile>;
    updateFile(id: number, data: MediaFileUpdateData): Promise<MediaFile>;
    deleteFile(id: number): Promise<void>;
    getFile(id: number): Promise<MediaFile | null>;
    listFiles(options?: MediaListOptions): Promise<MediaListResponse>;
    createFolder(data: MediaFolderCreateData): Promise<MediaFolder>;
    updateFolder(id: number, data: MediaFolderUpdateData): Promise<MediaFolder>;
    deleteFolder(id: number): Promise<void>;
    getFolderTree(): Promise<FolderTreeNode[]>;
    createGallery(data: MediaGalleryCreateData): Promise<MediaGallery>;
    addFilesToGallery(galleryId: number, fileIds: number[]): Promise<void>;
    private getFileUrl;
    private getThumbnailUrl;
    generateFileHash(buffer: Buffer): string;
    getFileExtension(filename: string): string;
    sanitizeFileName(filename: string): string;
    isValidMimeType(mimeType: string): boolean;
    isValidFileSize(size: number): boolean;
}
//# sourceMappingURL=mediaService.d.ts.map