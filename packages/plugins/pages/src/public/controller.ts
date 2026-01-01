import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PagesService } from '../service';

const prisma = new PrismaClient();
const pagesService = new PagesService(prisma);

export class PagesPublicController {
  static async getPage(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const locale = req.query.locale as string || 'en';

      // For now, we'll use the slug parameter directly
      // In a full implementation, this would resolve the slug through the SlugService
      const page = await pagesService.getPublishedPages().then(pages =>
        pages.find(p => p.id === slug) // This is a temporary implementation
      );

      if (!page) {
        return res.status(404).json({
          success: false,
          error: 'Page not found',
        });
      }

      res.json({
        success: true,
        data: { page },
      });
    } catch (error) {
      console.error('Get page error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getPages(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const pages = await pagesService.getPublishedPages();

      // Limit results
      const limitedPages = pages.slice(0, limit);

      res.json({
        success: true,
        data: { pages: limitedPages },
      });
    } catch (error) {
      console.error('Get pages error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getFeaturedPages(req: Request, res: Response) {
    try {
      const pages = await pagesService.getPublishedPages();
      const featuredPages = pages.filter(page => page.isFeatured);

      res.json({
        success: true,
        data: { pages: featuredPages },
      });
    } catch (error) {
      console.error('Get featured pages error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

