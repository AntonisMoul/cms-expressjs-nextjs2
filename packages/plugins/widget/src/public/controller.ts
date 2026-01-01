import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { WidgetService } from '../service';

const prisma = new PrismaClient();
const widgetService = new WidgetService(prisma);

export class WidgetPublicController {
  static async getSidebarWidgets(req: Request, res: Response) {
    try {
      const { sidebarId } = req.params;
      const { theme = 'default' } = req.query;

      const sidebarWidgets = await widgetService.getSidebarWidgets(sidebarId, theme as string);

      res.json({
        success: true,
        data: { widgets: sidebarWidgets },
      });
    } catch (error) {
      console.error('Get sidebar widgets error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async renderSidebar(req: Request, res: Response) {
    try {
      const { sidebarId } = req.params;
      const { theme = 'default' } = req.query;

      const sidebarWidgets = await widgetService.getSidebarWidgets(sidebarId, theme as string);

      // Generate HTML for the entire sidebar
      const html = await this.generateSidebarHtml(sidebarWidgets);

      res.json({
        success: true,
        data: { html, widgets: sidebarWidgets },
      });
    } catch (error) {
      console.error('Render sidebar error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getWidgetHtml(req: Request, res: Response) {
    try {
      const { widgetId } = req.params;

      const widget = await widgetService.getWidgetById(widgetId);

      if (!widget) {
        return res.status(404).json({
          success: false,
          error: 'Widget not found',
        });
      }

      const html = await widgetService.renderWidget(widget);

      res.json({
        success: true,
        data: { html, widget },
      });
    } catch (error) {
      console.error('Get widget HTML error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Private helper methods
  private static async generateSidebarHtml(sidebarWidgets: Array<{ widget: any; html: string }>): Promise<string> {
    const widgetHtmls = sidebarWidgets.map(({ html }) => html);

    return `<div class="widget-sidebar">
      ${widgetHtmls.join('\n')}
    </div>`;
  }
}