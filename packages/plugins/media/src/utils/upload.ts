import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { Request } from 'express';
import { MediaService, DEFAULT_UPLOAD_CONFIG, UploadConfig } from '../models/types';

export class UploadUtils {
  private config: UploadConfig;

  constructor(config: UploadConfig = DEFAULT_UPLOAD_CONFIG) {
    this.config = config;
    this.ensureDirectories();
  }

  // Multer storage configuration
  getMulterStorage() {
    return multer.diskStorage({
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
    return multer({
      storage: this.getMulterStorage(),
      limits: {
        fileSize: this.config.maxFileSize,
      },
      fileFilter: (req, file, cb) => {
        if (this.config.allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`File type ${file.mimetype} is not allowed`));
        }
      },
    });
  }

  // Process uploaded file
  async processUploadedFile(
    file: Express.Multer.File,
    mediaService: MediaService,
    userId?: number,
    folderId?: number
  ) {
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
  private async generateThumbnails(originalPath: string, relativePath: string) {
    const thumbnailDir = path.join(this.config.uploadPath, 'thumbnails');
    this.ensureDirectory(thumbnailDir);

    for (const [sizeName, dimensions] of Object.entries(this.config.thumbnailSizes)) {
      const thumbnailPath = path.join(thumbnailDir, `${sizeName}_${relativePath}`);

      // Ensure thumbnail subdirectories exist
      const thumbnailSubDir = path.dirname(thumbnailPath);
      this.ensureDirectory(thumbnailSubDir);

      await sharp(originalPath)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
    }
  }

  // Ensure directory exists
  private ensureDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Ensure all required directories exist
  private ensureDirectories() {
    this.ensureDirectory(this.config.uploadPath);

    if (this.config.generateThumbnails) {
      const thumbnailDir = path.join(this.config.uploadPath, 'thumbnails');
      this.ensureDirectory(thumbnailDir);
    }
  }

  // Clean up uploaded files (for failed uploads)
  cleanupFiles(files: Express.Multer.File[]) {
    files.forEach(file => {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (error) {
        console.warn(`Failed to cleanup file: ${file.path}`, error);
      }
    });
  }

  // Get file stats
  getFileStats(filePath: string) {
    try {
      return fs.statSync(filePath);
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const uploadUtils = new UploadUtils();
