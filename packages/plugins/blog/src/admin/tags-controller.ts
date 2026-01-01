import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BlogService } from '../service';
import { AuditService } from '@cms/core';

const prisma = new PrismaClient();
const blogService = new BlogService(prisma);
const auditService = new AuditService(prisma);

export class BlogTagsAdminController {
  static async index(req: Request, res: Response) {
    try {
      const tags = await blogService.getTags();

      res.json({
        success: true,
        data: { tags },
      });
    } catch (error) {
      console.error('Blog tags index error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const authorId = req.user!.id;

      const tag = await blogService.createTag(data, authorId);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'create_tag',
        tag.id,
        tag.name,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({
        success: true,
        data: { tag },
        message: 'Tag created successfully',
      });
    } catch (error: any) {
      console.error('Tag create error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Tag name already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get tag with translations
      const tag = await prisma.tag.findUnique({
        where: { id },
        include: {
          translations: true,
        },
      });

      if (!tag) {
        return res.status(404).json({
          success: false,
          error: 'Tag not found',
        });
      }

      const tagWithTranslations = {
        id: tag.id,
        name: tag.name,
        authorId: tag.authorId,
        authorType: tag.authorType,
        description: tag.description,
        status: tag.status,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        translations: tag.translations,
      };

      res.json({
        success: true,
        data: { tag: tagWithTranslations },
      });
    } catch (error) {
      console.error('Tag show error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const authorId = req.user!.id;

      const tag = await blogService.updateTag(id, data);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'update_tag',
        tag.id,
        tag.name,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { tag },
        message: 'Tag updated successfully',
      });
    } catch (error: any) {
      console.error('Tag update error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Tag name already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authorId = req.user!.id;

      // Get tag before deleting
      const tag = await prisma.tag.findUnique({
        where: { id },
      });

      if (!tag) {
        return res.status(404).json({
          success: false,
          error: 'Tag not found',
        });
      }

      await blogService.deleteTag(id);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'delete_tag',
        tag.id,
        tag.name,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Tag deleted successfully',
      });
    } catch (error) {
      console.error('Tag delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Translation methods
  static async createTranslation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { langCode, name, description } = req.body;
      const authorId = req.user!.id;

      await blogService.createTagTranslation(id, langCode, {
        name,
        description,
      });

      const tag = await prisma.tag.findUnique({
        where: { id },
      });

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'create_tag_translation',
        tag!.id,
        `${tag!.name} (${langCode})`,
        { langCode, name },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation created successfully',
      });
    } catch (error) {
      console.error('Create tag translation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async updateTranslation(req: Request, res: Response) {
    try {
      const { id, langCode } = req.params;
      const { name, description } = req.body;
      const authorId = req.user!.id;

      await blogService.updateTagTranslation(id, langCode, {
        name,
        description,
      });

      const tag = await prisma.tag.findUnique({
        where: { id },
      });

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'update_tag_translation',
        tag!.id,
        `${tag!.name} (${langCode})`,
        { langCode, name },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation updated successfully',
      });
    } catch (error) {
      console.error('Update tag translation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async deleteTranslation(req: Request, res: Response) {
    try {
      const { id, langCode } = req.params;
      const authorId = req.user!.id;

      const tag = await prisma.tag.findUnique({
        where: { id },
      });

      await blogService.deleteTagTranslation(id, langCode);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'delete_tag_translation',
        tag!.id,
        `${tag!.name} (${langCode})`,
        { langCode },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation deleted successfully',
      });
    } catch (error) {
      console.error('Delete tag translation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

