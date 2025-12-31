import multer from 'multer';
import * as fs from 'fs';
import { MediaService, UploadConfig } from '../models/types';
export declare class UploadUtils {
    private config;
    constructor(config?: UploadConfig);
    getMulterStorage(): multer.StorageEngine;
    getMulterUpload(): multer.Multer;
    processUploadedFile(file: Express.Multer.File, mediaService: MediaService, userId?: number, folderId?: number): Promise<any>;
    private generateThumbnails;
    private ensureDirectory;
    private ensureDirectories;
    cleanupFiles(files: Express.Multer.File[]): void;
    getFileStats(filePath: string): fs.Stats | null;
}
export declare const uploadUtils: UploadUtils;
//# sourceMappingURL=upload.d.ts.map