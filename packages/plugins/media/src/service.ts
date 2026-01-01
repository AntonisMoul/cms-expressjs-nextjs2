import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { MediaFolder, MediaFile, CreateMediaFolderRequest, UpdateMediaFolderRequest, MediaListRequest, PaginatedResponse } from '@cms/core';

export class MediaService {
  private uploadPath: string;

  constructor(private prisma: PrismaClient) {
    this.uploadPath = process.env.UPLOAD_PATH || './uploads';
  }

  // Folder operations
  async createFolder(data: CreateMediaFolderRequest, userId: string): Promise<MediaFolder> {
    const slug = data.name ? this.slugify(data.name) : `folder-${Date.now()}`;

    const folder = await this.prisma.mediaFolder.create({
      data: {
        userId,
        name: data.name,
        slug,
        parentId: data.parentId || '0',
        color: data.color,
      },
    });

    return {
      id: folder.id,
      userId: folder.userId,
      name: folder.name,
      slug: folder.slug,
      parentId: folder.parentId,
      color: folder.color,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      deletedAt: folder.deletedAt || undefined,
    };
  }

  async updateFolder(id: string, data: UpdateMediaFolderRequest): Promise<MediaFolder> {
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = this.slugify(data.name);
    }

    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.color !== undefined) updateData.color = data.color;

    const folder = await this.prisma.mediaFolder.update({
      where: { id },
      data: updateData,
    });

    return {
      id: folder.id,
      userId: folder.userId,
      name: folder.name,
      slug: folder.slug,
      parentId: folder.parentId,
      color: folder.color,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      deletedAt: folder.deletedAt || undefined,
    };
  }

  async deleteFolder(id: string): Promise<void> {
    // Move all files in this folder to root
    await this.prisma.mediaFile.updateMany({
      where: { folderId: id },
      data: { folderId: '0' },
    });

    // Delete the folder
    await this.prisma.mediaFolder.delete({
      where: { id },
    });
  }

  async getFolders(): Promise<MediaFolder[]> {
    const folders = await this.prisma.mediaFolder.findMany({
      where: { deletedAt: null },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' },
      ],
    });

    return folders.map(folder => ({
      id: folder.id,
      userId: folder.userId,
      name: folder.name,
      slug: folder.slug,
      parentId: folder.parentId,
      color: folder.color,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      deletedAt: folder.deletedAt || undefined,
    }));
  }

  async getFolderTree(): Promise<any[]> {
    const folders = await this.getFolders();
    return this.buildFolderTree(folders);
  }

  private buildFolderTree(folders: MediaFolder[]): any[] {
    const folderMap = new Map<string, any>();
    const rootFolders: any[] = [];

    // Create folder objects
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        ...folder,
        children: [],
      });
    });

    // Build tree structure
    folders.forEach(folder => {
      const folderObj = folderMap.get(folder.id);

      if (folder.parentId === '0') {
        rootFolders.push(folderObj);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folderObj);
        } else {
          // Parent doesn't exist, treat as root
          rootFolders.push(folderObj);
        }
      }
    });

    return rootFolders;
  }

  // File operations
  async uploadFile(file: Express.Multer.File, folderId: string = '0', userId: string, visibility: string = 'public'): Promise<MediaFile> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, fileName);

    // Ensure upload directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Move file to upload directory
    await fs.writeFile(filePath, file.buffer);

    // Create database record
    const mediaFile = await this.prisma.mediaFile.create({
      data: {
        userId,
        name: file.originalname,
        folderId,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${fileName}`,
        visibility,
      },
    });

    return {
      id: mediaFile.id,
      userId: mediaFile.userId,
      name: mediaFile.name,
      folderId: mediaFile.folderId,
      mimeType: mediaFile.mimeType,
      size: mediaFile.size,
      url: mediaFile.url,
      options: mediaFile.options || undefined,
      alt: mediaFile.alt || undefined,
      visibility: mediaFile.visibility,
      createdAt: mediaFile.createdAt,
      updatedAt: mediaFile.updatedAt,
      deletedAt: mediaFile.deletedAt || undefined,
    };
  }

  async getFiles(options: MediaListRequest = {}): Promise<PaginatedResponse<MediaFile>> {
    const {
      folderId = '0',
      search,
      type,
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      folderId,
    };

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (type) {
      if (type === 'image') {
        where.mimeType = {
          startsWith: 'image/',
        };
      } else if (type === 'video') {
        where.mimeType = {
          startsWith: 'video/',
        };
      } else if (type === 'audio') {
        where.mimeType = {
          startsWith: 'audio/',
        };
      } else if (type === 'document') {
        where.mimeType = {
          in: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
          ],
        };
      }
    }

    const [files, total] = await Promise.all([
      this.prisma.mediaFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.mediaFile.count({ where }),
    ]);

    const data = files.map(file => ({
      id: file.id,
      userId: file.userId,
      name: file.name,
      folderId: file.folderId,
      mimeType: file.mimetype,
      size: file.size,
      url: file.url,
      options: file.options || undefined,
      alt: file.alt || undefined,
      visibility: file.visibility,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined,
    }));

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateFile(id: string, data: { name?: string; alt?: string; folderId?: string }): Promise<MediaFile> {
    const file = await this.prisma.mediaFile.update({
      where: { id },
      data,
    });

    return {
      id: file.id,
      userId: file.userId,
      name: file.name,
      folderId: file.folderId,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
      options: file.options || undefined,
      alt: file.alt || undefined,
      visibility: file.visibility,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined,
    };
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.prisma.mediaFile.findUnique({
      where: { id },
    });

    if (file) {
      // Delete physical file
      try {
        const filePath = path.join(process.cwd(), 'public', file.url);
        await fs.unlink(filePath);
      } catch (error) {
        // File might not exist, continue with database deletion
        console.warn(`Could not delete physical file: ${file.url}`);
      }

      // Soft delete from database
      await this.prisma.mediaFile.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
  }

  async moveFile(id: string, newFolderId: string): Promise<MediaFile> {
    const file = await this.prisma.mediaFile.update({
      where: { id },
      data: { folderId: newFolderId },
    });

    return {
      id: file.id,
      userId: file.userId,
      name: file.name,
      folderId: file.folderId,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
      options: file.options || undefined,
      alt: file.alt || undefined,
      visibility: file.visibility,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined,
    };
  }

  // Utility methods
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  async getFileById(id: string): Promise<MediaFile | null> {
    const file = await this.prisma.mediaFile.findUnique({
      where: { id, deletedAt: null },
    });

    if (!file) return null;

    return {
      id: file.id,
      userId: file.userId,
      name: file.name,
      folderId: file.folderId,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
      options: file.options || undefined,
      alt: file.alt || undefined,
      visibility: file.visibility,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined,
    };
  }

  // Get storage usage for user
  async getStorageUsage(userId: string): Promise<{ used: number; files: number }> {
    const result = await this.prisma.mediaFile.aggregate({
      where: {
        userId,
        deletedAt: null,
      },
      _sum: {
        size: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      used: result._sum.size || 0,
      files: result._count.id,
    };
  }

  // Bulk operations
  async deleteFiles(fileIds: string[]): Promise<void> {
    const files = await this.prisma.mediaFile.findMany({
      where: { id: { in: fileIds } },
    });

    // Delete physical files
    await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = path.join(process.cwd(), 'public', file.url);
          await fs.unlink(filePath);
        } catch (error) {
          console.warn(`Could not delete physical file: ${file.url}`);
        }
      })
    );

    // Soft delete from database
    await this.prisma.mediaFile.updateMany({
      where: { id: { in: fileIds } },
      data: { deletedAt: new Date() },
    });
  }

  async moveFiles(fileIds: string[], newFolderId: string): Promise<void> {
    await this.prisma.mediaFile.updateMany({
      where: { id: { in: fileIds } },
      data: { folderId: newFolderId },
    });
  }
}

