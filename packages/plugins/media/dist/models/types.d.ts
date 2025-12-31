import { User } from '@cms/shared';
export interface MediaFile {
    id: number;
    name: string;
    fileName: string;
    mimeType: string;
    path: string;
    disk: string;
    fileSize: number;
    folderId?: number | null;
    fileHash?: string | null;
    alt?: string | null;
    description?: string | null;
    userId?: number | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    user?: User | null;
    folder?: MediaFolder | null;
    url?: string;
    thumbnailUrl?: string;
}
export interface MediaFolder {
    id: number;
    name: string;
    slug: string;
    parentId?: number | null;
    description?: string | null;
    userId?: number | null;
    color?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: User | null;
    parent?: MediaFolder | null;
    children?: MediaFolder[];
    files?: MediaFile[];
    fileCount?: number;
}
export interface MediaGallery {
    id: number;
    name: string;
    description?: string | null;
    isFeatured: boolean;
    userId?: number | null;
    slug?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: User | null;
    items?: MediaGalleryItem[];
}
export interface MediaGalleryItem {
    id: number;
    galleryId: number;
    fileId: number;
    order: number;
    gallery?: MediaGallery;
    file?: MediaFile;
}
export interface MediaUploadResult {
    file: MediaFile;
    url: string;
    thumbnailUrl?: string;
}
export interface MediaFileCreateData {
    name: string;
    fileName: string;
    mimeType: string;
    path: string;
    disk?: string;
    fileSize: number;
    folderId?: number;
    fileHash?: string;
    alt?: string;
    description?: string;
    userId?: number;
    isPublic?: boolean;
}
export interface MediaFileUpdateData {
    name?: string;
    alt?: string;
    description?: string;
    folderId?: number;
    isPublic?: boolean;
}
export interface MediaFolderCreateData {
    name: string;
    slug?: string;
    parentId?: number;
    description?: string;
    userId?: number;
    color?: string;
}
export interface MediaFolderUpdateData {
    name?: string;
    slug?: string;
    parentId?: number;
    description?: string;
    color?: string;
}
export interface MediaGalleryCreateData {
    name: string;
    description?: string;
    isFeatured?: boolean;
    userId?: number;
    slug?: string;
    fileIds?: number[];
}
export interface MediaGalleryUpdateData {
    name?: string;
    description?: string;
    isFeatured?: boolean;
    slug?: string;
    fileIds?: number[];
}
export interface MediaListOptions {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: MediaFilters;
}
export interface MediaFilters {
    folderId?: number;
    userId?: number;
    mimeType?: string;
    isPublic?: boolean;
    search?: string;
}
export interface MediaListResponse {
    files: MediaFile[];
    folders: MediaFolder[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}
export interface FolderTreeNode {
    id: number;
    name: string;
    slug: string;
    parentId?: number | null;
    color?: string | null;
    children: FolderTreeNode[];
    fileCount: number;
}
export declare const MEDIA_TYPES: {
    readonly IMAGE: "image";
    readonly VIDEO: "video";
    readonly AUDIO: "audio";
    readonly DOCUMENT: "document";
    readonly ARCHIVE: "archive";
    readonly OTHER: "other";
};
export declare const IMAGE_MIME_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp", "image/tiff"];
export declare const VIDEO_MIME_TYPES: readonly ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv", "video/webm"];
export declare const AUDIO_MIME_TYPES: readonly ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac"];
export declare const DOCUMENT_MIME_TYPES: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "text/csv"];
export interface UploadConfig {
    maxFileSize: number;
    allowedMimeTypes: string[];
    uploadPath: string;
    generateThumbnails: boolean;
    thumbnailSizes: {
        [key: string]: {
            width: number;
            height: number;
        };
    };
}
export declare const DEFAULT_UPLOAD_CONFIG: UploadConfig;
//# sourceMappingURL=types.d.ts.map