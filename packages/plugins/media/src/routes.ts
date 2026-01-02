import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { PluginContext } from '@cms/shared';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';
import { QueueService, AuditService } from '@cms/core';
import { generateUuid } from '@cms/shared/utils';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'storage', 'app', 'public', 'media');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${generateUuid()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export function registerMediaRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
) {
  const db = ctx.db as PrismaClient;
  const queueService = ctx.queue as QueueService;
  const auditService = ctx.audit as AuditService;

  // List media files
  router.get(
    '/media',
    requireAuth,
    requirePermission('media.index'),
    async (req: any, res: Response) => {
      try {
        const { folderId = '0', page = '1', perPage = '50' } = req.query;
        const folderIdNum = parseInt(folderId as string);
        const pageNum = parseInt(page as string);
        const perPageNum = parseInt(perPage as string);
        const skip = (pageNum - 1) * perPageNum;

        const where: any = {
          folderId: folderIdNum,
          deletedAt: null,
        };

        const [files, total] = await Promise.all([
          db.mediaFile.findMany({
            where,
            include: {
              folder: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: perPageNum,
          }),
          db.mediaFile.count({ where }),
        ]);

        res.json({
          success: true,
          data: {
            files,
            meta: {
              currentPage: pageNum,
              perPage: perPageNum,
              total,
              lastPage: Math.ceil(total / perPageNum),
            },
          },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // List folders
  router.get(
    '/media/folders',
    requireAuth,
    requirePermission('media.index'),
    async (req: any, res: Response) => {
      try {
        const { parentId = '0' } = req.query;
        const parentIdNum = parseInt(parentId as string);

        const folders = await db.mediaFolder.findMany({
          where: {
            parentId: parentIdNum,
            deletedAt: null,
          },
          orderBy: { name: 'asc' },
        });

        res.json({
          success: true,
          data: { folders },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Upload file
  router.post(
    '/media/upload',
    requireAuth,
    requirePermission('media.upload'),
    upload.single('file'),
    async (req: any, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No file uploaded',
          });
        }

        const userId = req.user!.id;
        const { folderId = '0' } = req.body;
        const folderIdNum = parseInt(folderId);

        const filePath = `/media/${req.file.filename}`;
        const fullUrl = `${process.env.APP_URL || 'http://localhost:3000'}${filePath}`;

        // Create media file record
        const mediaFile = await db.mediaFile.create({
          data: {
            name: req.file.originalname,
            folderId: folderIdNum,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fullUrl,
            userId,
          },
        });

        // Enqueue image processing if it's an image
        if (req.file.mimetype.startsWith('image/')) {
          await queueService.enqueue('media.processImage', {
            mediaFileId: mediaFile.id,
            filePath: req.file.filename,
            mimeType: req.file.mimetype,
          });
        }

        // Audit log
        await auditService.log({
          userId,
          module: 'media',
          action: 'upload',
          referenceId: BigInt(mediaFile.id),
          referenceName: req.file.originalname,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.status(201).json({
          success: true,
          data: { file: mediaFile },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Delete file
  router.delete(
    '/media/:id',
    requireAuth,
    requirePermission('media.delete'),
    async (req: any, res: Response) => {
      try {
        const fileId = parseInt(req.params.id);
        const userId = req.user!.id;

        const file = await db.mediaFile.findUnique({
          where: { id: fileId },
        });

        if (!file) {
          return res.status(404).json({
            success: false,
            error: 'File not found',
          });
        }

        // Soft delete
        await db.mediaFile.update({
          where: { id: fileId },
          data: { deletedAt: new Date() },
        });

        // Audit log
        await auditService.log({
          userId,
          module: 'media',
          action: 'delete',
          referenceId: BigInt(fileId),
          referenceName: file.name,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          message: 'File deleted successfully',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Create folder
  router.post(
    '/media/folders',
    requireAuth,
    requirePermission('media.upload'),
    async (req: any, res: Response) => {
      try {
        const { name, parentId = 0 } = req.body;
        const userId = req.user!.id;

        if (!name) {
          return res.status(400).json({
            success: false,
            error: 'Folder name is required',
          });
        }

        const folder = await db.mediaFolder.create({
          data: {
            name,
            parentId: parseInt(parentId),
            userId,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
          },
        });

        res.status(201).json({
          success: true,
          data: { folder },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );
}

