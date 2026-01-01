import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BlogService } from '../service';
import { AuditService, SlugService } from '@cms/core';

const prisma = new PrismaClient();
const blogService = new BlogService(prisma);
const auditService = new AuditService(prisma);
const slugService = new SlugService(prisma);

export class BlogCategoriesAdminController {
  static async index(req: Request, res: Response) {
    try {
      const categories = await blogService.getCategories();

      res.json({
        success: true,
        data: { categories },
      });
    } catch (error) {
      console.error('Blog categories index error:', error);
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

      const category = await blogService.createCategory(data, authorId);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'create_category',
        category.id,
        category.name,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({
        success: true,
        data: { category },
        message: 'Category created successfully',
      });
    } catch (error: any) {
      console.error('Category create error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Category name already exists',
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

      // Get category with translations
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          translations: true,
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }

      const categoryWithTranslations = {
        id: category.id,
        name: category.name,
        parentId: category.parentId,
        description: category.description,
        status: category.status,
        authorId: category.authorId,
        authorType: category.authorType,
        icon: category.icon,
        order: category.order,
        isFeatured: category.isFeatured,
        isDefault: category.isDefault,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        translations: category.translations,
      };

      res.json({
        success: true,
        data: { category: categoryWithTranslations },
      });
    } catch (error) {
      console.error('Category show error:', error);
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

      const category = await blogService.updateCategory(id, data);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'update_category',
        category.id,
        category.name,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { category },
        message: 'Category updated successfully',
      });
    } catch (error: any) {
      console.error('Category update error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Category name already exists',
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

      // Get category before deleting
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }

      await blogService.deleteCategory(id);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'delete_category',
        category.id,
        category.name,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Category delete error:', error);
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

      await blogService.createCategoryTranslation(id, langCode, {
        name,
        description,
      });

      const category = await prisma.category.findUnique({
        where: { id },
      });

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'create_category_translation',
        category!.id,
        `${category!.name} (${langCode})`,
        { langCode, name },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation created successfully',
      });
    } catch (error) {
      console.error('Create category translation error:', error);
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

      await blogService.updateCategoryTranslation(id, langCode, {
        name,
        description,
      });

      const category = await prisma.category.findUnique({
        where: { id },
      });

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'update_category_translation',
        category!.id,
        `${category!.name} (${langCode})`,
        { langCode, name },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation updated successfully',
      });
    } catch (error) {
      console.error('Update category translation error:', error);
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

      const category = await prisma.category.findUnique({
        where: { id },
      });

      await blogService.deleteCategoryTranslation(id, langCode);

      // Audit log
      await auditService.logContentAction(
        authorId,
        'blog',
        'delete_category_translation',
        category!.id,
        `${category!.name} (${langCode})`,
        { langCode },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Translation deleted successfully',
      });
    } catch (error) {
      console.error('Delete category translation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

