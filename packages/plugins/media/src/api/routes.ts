import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { MediaService, UploadUtils } from '../services/mediaService';
import { uploadUtils } from '../utils/upload';
import { PrismaClient } from '@cms/core';
import { ApiResponse, PaginatedResponse } from '@cms/shared';
import { AuthMiddleware, AuditService } from '@cms/core';

const router = Router();
const prisma = new PrismaClient();
const mediaService = new MediaService(prisma);
const auditService = new AuditService(prisma);
const authMiddleware = new AuthMiddleware(prisma);

// Validation rules
const uploadValidation = [
  body('folderId').optional().isInt(),
  body('alt').optional().isLength({ max: 255 }),
  body('description').optional().isString(),
];

const createFolderValidation = [
  body('name').isLength({ min: 1, max: 255 }),
  body('parentId').optional().isInt({ min: 0 }),
  body('description').optional().isString(),
  body('color').optional().isHexColor(),
];

const updateFileValidation = [
  param('id').isInt(),
  body('name').optional().isLength({ min: 1, max: 255 }),
  body('alt').optional().isLength({ max: 255 }),
  body('description').optional().isString(),
  body('folderId').optional().isInt(),
  body('isPublic').optional().isBoolean(),
];

const createGalleryValidation = [
  body('name').isLength({ min: 1, max: 120 }),
  body('description').optional().isLength({ max: 400 }),
  body('isFeatured').optional().isBoolean(),
  body('fileIds').optional().isArray(),
];

// ==================== FILE UPLOAD ====================

// POST /api/v1/media/upload - Upload files
router.post('/upload',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.upload'),
  uploadUtils.getMulterUpload().array('files'),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { folderId, alt, description } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        } as ApiResponse);
      }

      const uploadedFiles = [];

      for (const file of files) {
        try {
          const mediaFile = await uploadUtils.processUploadedFile(
            file,
            mediaService,
            req.user!.userId,
            folderId ? parseInt(folderId) : undefined
          );

          // Update metadata if provided
          if (alt || description) {
            await mediaService.updateFile(mediaFile.id, {
              alt: alt || undefined,
              description: description || undefined,
            });
          }

          uploadedFiles.push(mediaFile);
        } catch (error) {
          console.error(`Failed to process file ${file.originalname}:`, error);
          // Continue with other files
        }
      }

      // Audit log
      await auditService.logAction(
        req.user!.userId,
        'media',
        'upload',
        0,
        `${uploadedFiles.length} files uploaded`
      );

      res.status(201).json({
        success: true,
        data: { files: uploadedFiles },
        message: `${uploadedFiles.length} files uploaded successfully`,
      } as ApiResponse);
    } catch (error) {
      console.error('Upload error:', error);

      // Cleanup uploaded files on error
      if (req.files) {
        uploadUtils.cleanupFiles(req.files as Express.Multer.File[]);
      }

      res.status(500).json({
        success: false,
        message: 'Upload failed',
      } as ApiResponse);
    }
  }
);

// ==================== FILE MANAGEMENT ====================

// GET /api/v1/media/files - List files
router.get('/files',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.index'),
  async (req, res) => {
    try {
      const options = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        perPage: req.query.perPage ? parseInt(req.query.perPage as string) : 20,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        filters: {
          folderId: req.query.folderId ? parseInt(req.query.folderId as string) : undefined,
          mimeType: req.query.mimeType as string,
          isPublic: req.query.isPublic ? req.query.isPublic === 'true' : undefined,
          search: req.query.search as string,
        },
      };

      const result = await mediaService.listFiles(options);

      res.json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error) {
      console.error('List files error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list files',
      } as ApiResponse);
    }
  }
);

// GET /api/v1/media/files/:id - Get file details
router.get('/files/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.index'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await mediaService.getFile(id);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { file },
      } as ApiResponse);
    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get file',
      } as ApiResponse);
    }
  }
);

// PUT /api/v1/media/files/:id - Update file metadata
router.put('/files/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.edit'),
  updateFileValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await mediaService.updateFile(id, req.body);

      res.json({
        success: true,
        data: { file },
        message: 'File updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Update file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update file',
      } as ApiResponse);
    }
  }
);

// DELETE /api/v1/media/files/:id - Delete file
router.delete('/files/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.delete'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await mediaService.getFile(id);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        } as ApiResponse);
      }

      await mediaService.deleteFile(id);

      // Audit log
      await auditService.logDelete(
        req.user!.userId,
        'media',
        id,
        file.name
      );

      res.json({
        success: true,
        message: 'File deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
      } as ApiResponse);
    }
  }
);

// ==================== FOLDER MANAGEMENT ====================

// GET /api/v1/media/folders/tree - Get folder tree
router.get('/folders/tree',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.index'),
  async (req, res) => {
    try {
      const tree = await mediaService.getFolderTree();

      res.json({
        success: true,
        data: { folders: tree },
      } as ApiResponse);
    } catch (error) {
      console.error('Get folder tree error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get folder tree',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/media/folders - Create folder
router.post('/folders',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.edit'),
  createFolderValidation,
  async (req, res) => {
    try {
      const folder = await mediaService.createFolder({
        ...req.body,
        userId: req.user!.userId,
      });

      res.status(201).json({
        success: true,
        data: { folder },
        message: 'Folder created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create folder error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create folder',
      } as ApiResponse);
    }
  }
);

// PUT /api/v1/media/folders/:id - Update folder
router.put('/folders/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.edit'),
  param('id').isInt(),
  createFolderValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const folder = await mediaService.updateFolder(id, req.body);

      res.json({
        success: true,
        data: { folder },
        message: 'Folder updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Update folder error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update folder',
      } as ApiResponse);
    }
  }
);

// DELETE /api/v1/media/folders/:id - Delete folder
router.delete('/folders/:id',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.edit'),
  param('id').isInt(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await mediaService.deleteFolder(id);

      res.json({
        success: true,
        message: 'Folder deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Delete folder error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete folder',
      } as ApiResponse);
    }
  }
);

// ==================== GALLERY MANAGEMENT ====================

// GET /api/v1/media/galleries - List galleries
router.get('/galleries',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.index'),
  async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const perPage = req.query.perPage ? parseInt(req.query.perPage as string) : 15;

      const [galleries, total] = await Promise.all([
        prisma.mediaGallery.findMany({
          include: {
            user: true,
            _count: {
              select: { items: true },
            },
          },
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.mediaGallery.count(),
      ]);

      res.json({
        success: true,
        data: {
          galleries,
          pagination: {
            currentPage: page,
            lastPage: Math.ceil(total / perPage),
            perPage,
            total,
          },
        },
      } as ApiResponse);
    } catch (error) {
      console.error('List galleries error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list galleries',
      } as ApiResponse);
    }
  }
);

// POST /api/v1/media/galleries - Create gallery
router.post('/galleries',
  authMiddleware.authenticate,
  authMiddleware.requirePermission('media.edit'),
  createGalleryValidation,
  async (req, res) => {
    try {
      const gallery = await mediaService.createGallery({
        ...req.body,
        userId: req.user!.userId,
      });

      res.status(201).json({
        success: true,
        data: { gallery },
        message: 'Gallery created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create gallery error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create gallery',
      } as ApiResponse);
    }
  }
);

export default router;
