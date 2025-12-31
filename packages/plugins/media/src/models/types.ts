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

  // Relations
  user?: User | null;
  folder?: MediaFolder | null;
  url?: string; // Computed field
  thumbnailUrl?: string; // Computed field
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

  // Relations
  user?: User | null;
  parent?: MediaFolder | null;
  children?: MediaFolder[];
  files?: MediaFile[];
  fileCount?: number; // Computed field
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

  // Relations
  user?: User | null;
  items?: MediaGalleryItem[];
}

export interface MediaGalleryItem {
  id: number;
  galleryId: number;
  fileId: number;
  order: number;

  // Relations
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

// File type constants
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  ARCHIVE: 'archive',
  OTHER: 'other',
} as const;

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
] as const;

export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  'video/webm',
] as const;

export const AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
] as const;

export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
] as const;

// Upload configuration
export interface UploadConfig {
  maxFileSize: number; // in bytes
  allowedMimeTypes: string[];
  uploadPath: string;
  generateThumbnails: boolean;
  thumbnailSizes: { [key: string]: { width: number; height: number } };
}

export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    ...IMAGE_MIME_TYPES,
    ...VIDEO_MIME_TYPES,
    ...AUDIO_MIME_TYPES,
    ...DOCUMENT_MIME_TYPES,
  ],
  uploadPath: 'uploads/media',
  generateThumbnails: true,
  thumbnailSizes: {
    small: { width: 150, height: 150 },
    medium: { width: 300, height: 300 },
    large: { width: 600, height: 600 },
  },
};
