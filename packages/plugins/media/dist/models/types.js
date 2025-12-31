"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_UPLOAD_CONFIG = exports.DOCUMENT_MIME_TYPES = exports.AUDIO_MIME_TYPES = exports.VIDEO_MIME_TYPES = exports.IMAGE_MIME_TYPES = exports.MEDIA_TYPES = void 0;
// File type constants
exports.MEDIA_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: 'document',
    ARCHIVE: 'archive',
    OTHER: 'other',
};
exports.IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
];
exports.VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
];
exports.AUDIO_MIME_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/aac',
];
exports.DOCUMENT_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
];
exports.DEFAULT_UPLOAD_CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
        ...exports.IMAGE_MIME_TYPES,
        ...exports.VIDEO_MIME_TYPES,
        ...exports.AUDIO_MIME_TYPES,
        ...exports.DOCUMENT_MIME_TYPES,
    ],
    uploadPath: 'uploads/media',
    generateThumbnails: true,
    thumbnailSizes: {
        small: { width: 150, height: 150 },
        medium: { width: 300, height: 300 },
        large: { width: 600, height: 600 },
    },
};
