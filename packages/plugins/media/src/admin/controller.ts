import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { MediaService } from '../service';
import { AuditService } from '@cms/core';

const prisma = new PrismaClient();
const mediaService = new MediaService(prisma);
const auditService = new AuditService(prisma);

export class MediaAdminController {
  static async getFolders(req: Request, res: Response) {
    try {
      const folders = await mediaService.getFolderTree();

      res.json({
        success: true,
        data: { folders },
      });
    } catch (error) {
      console.error('Get folders error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async createFolder(req: Request, res: Response) {
    try {
      const data = req.body;
      const userId = req.user!.id;

      const folder = await mediaService.createFolder(data, userId);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'create_folder',
        folder.id,
        folder.name || 'Unnamed Folder',
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({
        success: true,
        data: { folder },
        message: 'Folder created successfully',
      });
    } catch (error: any) {
      console.error('Create folder error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Folder name already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async updateFolder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;

      const folder = await mediaService.updateFolder(id, data);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'update_folder',
        folder.id,
        folder.name || 'Unnamed Folder',
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { folder },
        message: 'Folder updated successfully',
      });
    } catch (error: any) {
      console.error('Update folder error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Folder name already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async deleteFolder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Get folder before deleting
      const folder = await prisma.mediaFolder.findUnique({
        where: { id },
      });

      if (!folder) {
        return res.status(404).json({
          success: false,
          error: 'Folder not found',
        });
      }

      await mediaService.deleteFolder(id);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'delete_folder',
        folder.id,
        folder.name || 'Unnamed Folder',
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Folder deleted successfully',
      });
    } catch (error) {
      console.error('Delete folder error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getFiles(req: Request, res: Response) {
    try {
      const options = {
        folderId: req.query.folderId as string,
        search: req.query.search as string,
        type: req.query.type as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };

      const result = await mediaService.getFiles(options);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Get files error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async uploadFiles(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const { folderId = '0', visibility = 'public' } = req.body;
      const userId = req.user!.id;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files provided',
        });
      }

      const uploadedFiles = await Promise.all(
        files.map(file => mediaService.uploadFile(file, folderId, userId, visibility))
      );

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'upload_files',
        uploadedFiles.map(f => f.id).join(','),
        `${uploadedFiles.length} files uploaded`,
        { count: uploadedFiles.length, folderId },
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({
        success: true,
        data: { files: uploadedFiles },
        message: `${uploadedFiles.length} files uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload files error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async updateFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;

      const file = await mediaService.updateFile(id, data);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'update_file',
        file.id,
        file.name,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { file },
        message: 'File updated successfully',
      });
    } catch (error) {
      console.error('Update file error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const file = await mediaService.getFileById(id);
      if (!file) {
        return res.status(404).json({
          success: false,
          error: 'File not found',
        });
      }

      await mediaService.deleteFile(id);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'delete_file',
        file.id,
        file.name,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async moveFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { folderId } = req.body;
      const userId = req.user!.id;

      const file = await mediaService.moveFile(id, folderId);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'move_file',
        file.id,
        file.name,
        { folderId },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { file },
        message: 'File moved successfully',
      });
    } catch (error) {
      console.error('Move file error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getStorageUsage(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const usage = await mediaService.getStorageUsage(userId);

      res.json({
        success: true,
        data: { usage },
      });
    } catch (error) {
      console.error('Get storage usage error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Bulk operations
  static async bulkDelete(req: Request, res: Response) {
    try {
      const { fileIds } = req.body;
      const userId = req.user!.id;

      if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'File IDs are required',
        });
      }

      await mediaService.deleteFiles(fileIds);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'bulk_delete_files',
        fileIds.join(','),
        `${fileIds.length} files deleted`,
        { count: fileIds.length },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: `${fileIds.length} files deleted successfully`,
      });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async bulkMove(req: Request, res: Response) {
    try {
      const { fileIds, folderId } = req.body;
      const userId = req.user!.id;

      if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'File IDs are required',
        });
      }

      await mediaService.moveFiles(fileIds, folderId);

      // Audit log
      await auditService.logContentAction(
        userId,
        'media',
        'bulk_move_files',
        fileIds.join(','),
        `${fileIds.length} files moved`,
        { count: fileIds.length, folderId },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: `${fileIds.length} files moved successfully`,
      });
    } catch (error) {
      console.error('Bulk move error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

