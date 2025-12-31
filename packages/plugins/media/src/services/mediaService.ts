import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import {
  MediaFile,
  MediaFolder,
  MediaGallery,
  MediaFileCreateData,
  MediaFileUpdateData,
  MediaFolderCreateData,
  MediaFolderUpdateData,
  MediaGalleryCreateData,
  MediaGalleryUpdateData,
  MediaListOptions,
  MediaListResponse,
  MediaFilters,
  FolderTreeNode,
  DEFAULT_UPLOAD_CONFIG,
  UploadConfig,
} from '../models/types';
import { SlugService } from '@cms/core';

export class MediaService {
  constructor(
    private prisma: PrismaClient,
    private config: UploadConfig = DEFAULT_UPLOAD_CONFIG
  ) {}

  // File operations
  async createFile(data: MediaFileCreateData): Promise<MediaFile> {
    const file = await this.prisma.mediaFile.create({
      data: {
        ...data,
        disk: data.disk || 'local',
        isPublic: data.isPublic ?? true,
      },
      include: {
        user: true,
        folder: true,
      },
    });

    return {
      ...file,
      url: this.getFileUrl(file),
      thumbnailUrl: this.getThumbnailUrl(file),
    };
  }

  async updateFile(id: number, data: MediaFileUpdateData): Promise<MediaFile> {
    const file = await this.prisma.mediaFile.update({
      where: { id },
      data,
      include: {
        user: true,
        folder: true,
      },
    });

    return {
      ...file,
      url: this.getFileUrl(file),
      thumbnailUrl: this.getThumbnailUrl(file),
    };
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.prisma.mediaFile.findUnique({
      where: { id },
      select: { path: true },
    });

    if (file) {
      // Delete physical file
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.warn(`Failed to delete physical file: ${file.path}`, error);
      }

      // Delete from database
      await this.prisma.mediaFile.delete({
        where: { id },
      });
    }
  }

  async getFile(id: number): Promise<MediaFile | null> {
    const file = await this.prisma.mediaFile.findUnique({
      where: { id },
      include: {
        user: true,
        folder: true,
      },
    });

    if (!file) return null;

    return {
      ...file,
      url: this.getFileUrl(file),
      thumbnailUrl: this.getThumbnailUrl(file),
    };
  }

  async listFiles(options: MediaListOptions = {}): Promise<MediaListResponse> {
    const {
      page = 1,
      perPage = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const where: any = {};

    // Apply filters
    if (filters.folderId !== undefined) {
      where.folderId = filters.folderId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.mimeType) {
      where.mimeType = {
        startsWith: filters.mimeType,
      };
    }

    if (filters.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { alt: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const [files, total] = await Promise.all([
      this.prisma.mediaFile.findMany({
        where,
        include: {
          user: true,
          folder: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.mediaFile.count({ where }),
    ]);

    // Add computed URLs
    const filesWithUrls = files.map(file => ({
      ...file,
      url: this.getFileUrl(file),
      thumbnailUrl: this.getThumbnailUrl(file),
    }));

    return {
      files: filesWithUrls,
      folders: [], // Will be populated separately
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  // Folder operations
  async createFolder(data: MediaFolderCreateData): Promise<MediaFolder> {
    const slug = data.slug || SlugService.transliterate(data.name);

    return this.prisma.mediaFolder.create({
      data: {
        ...data,
        slug,
        parentId: data.parentId || 0,
      },
      include: {
        user: true,
        parent: true,
        children: true,
        _count: {
          select: { files: true },
        },
      },
    });
  }

  async updateFolder(id: number, data: MediaFolderUpdateData): Promise<MediaFolder> {
    const updateData: any = { ...data };

    if (data.name) {
      updateData.slug = data.slug || SlugService.transliterate(data.name);
    }

    return this.prisma.mediaFolder.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        parent: true,
        children: true,
        _count: {
          select: { files: true },
        },
      },
    });
  }

  async deleteFolder(id: number): Promise<void> {
    // Move files to parent folder or root
    const folder = await this.prisma.mediaFolder.findUnique({
      where: { id },
      select: { parentId: true },
    });

    if (folder) {
      await this.prisma.mediaFile.updateMany({
        where: { folderId: id },
        data: { folderId: folder.parentId || null },
      });
    }

    // Delete folder
    await this.prisma.mediaFolder.delete({
      where: { id },
    });
  }

  async getFolderTree(): Promise<FolderTreeNode[]> {
    const folders = await this.prisma.mediaFolder.findMany({
      include: {
        children: {
          include: {
            children: true,
            _count: {
              select: { files: true },
            },
          },
          _count: {
            select: { files: true },
          },
        },
        _count: {
          select: { files: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const folderMap = new Map<number, FolderTreeNode>();
    const roots: FolderTreeNode[] = [];

    // Create all folder nodes
    folders.forEach(folder => {
      const node: FolderTreeNode = {
        id: folder.id,
        name: folder.name,
        slug: folder.slug,
        parentId: folder.parentId,
        color: folder.color,
        children: [],
        fileCount: folder._count.files,
      };
      folderMap.set(folder.id, node);
    });

    // Build hierarchy
    folderMap.forEach(folder => {
      if (folder.parentId === 0 || folder.parentId === null) {
        roots.push(folder);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folder);
        }
      }
    });

    return roots;
  }

  // Gallery operations
  async createGallery(data: MediaGalleryCreateData): Promise<MediaGallery> {
    const gallery = await this.prisma.mediaGallery.create({
      data: {
        name: data.name,
        description: data.description,
        isFeatured: data.isFeatured || false,
        userId: data.userId,
        slug: data.slug,
      },
      include: {
        user: true,
        items: {
          include: {
            file: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    // Add files to gallery if provided
    if (data.fileIds && data.fileIds.length > 0) {
      await this.addFilesToGallery(gallery.id, data.fileIds);
    }

    return gallery;
  }

  async addFilesToGallery(galleryId: number, fileIds: number[]): Promise<void> {
    // Get current max order
    const lastItem = await this.prisma.mediaGalleryItem.findFirst({
      where: { galleryId },
      orderBy: { order: 'desc' },
    });

    const startOrder = lastItem ? lastItem.order + 1 : 0;

    const items = fileIds.map((fileId, index) => ({
      galleryId,
      fileId,
      order: startOrder + index,
    }));

    await this.prisma.mediaGalleryItem.createMany({
      data: items,
    });
  }

  // Utility methods
  private getFileUrl(file: MediaFile): string {
    return `/uploads/media/${file.path}`;
  }

  private getThumbnailUrl(file: MediaFile): string | undefined {
    if (file.mimeType.startsWith('image/')) {
      return `/uploads/media/thumbnails/${file.path}`;
    }
    return undefined;
  }

  generateFileHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }

  sanitizeFileName(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  isValidMimeType(mimeType: string): boolean {
    return this.config.allowedMimeTypes.includes(mimeType);
  }

  isValidFileSize(size: number): boolean {
    return size <= this.config.maxFileSize;
  }
}
