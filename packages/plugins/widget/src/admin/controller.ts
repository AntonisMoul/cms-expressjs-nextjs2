import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { WidgetService } from '../service';
import { AuditService } from '@cms/core';

const prisma = new PrismaClient();
const widgetService = new WidgetService(prisma);
const auditService = new AuditService(prisma);

// Register some basic widget types
widgetService.registerWidgetType({
  id: 'text',
  name: 'Text Widget',
  description: 'Display custom text content',
  settings: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'content', label: 'Content', type: 'textarea', required: true },
  ],
});

widgetService.registerWidgetType({
  id: 'custom_html',
  name: 'Custom HTML',
  description: 'Display custom HTML content',
  settings: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'html', label: 'HTML Content', type: 'textarea', required: true },
  ],
});

widgetService.registerWidgetType({
  id: 'image',
  name: 'Image Widget',
  description: 'Display an image',
  settings: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'image', label: 'Image', type: 'image', required: true },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'link', label: 'Link URL', type: 'text' },
  ],
});

widgetService.registerWidgetType({
  id: 'menu',
  name: 'Menu Widget',
  description: 'Display a navigation menu',
  settings: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'menu_id', label: 'Menu', type: 'select', required: true },
  ],
});

// Register widget groups
widgetService.registerWidgetGroup({
  id: 'primary_sidebar',
  name: 'Primary Sidebar',
  description: 'Widgets displayed in the main sidebar',
  widgets: widgetService.getAllWidgetTypes(),
});

export class WidgetAdminController {
  static async getWidgets(req: Request, res: Response) {
    try {
      const { sidebarId, theme = 'default' } = req.query;

      let widgets;
      if (sidebarId) {
        widgets = await widgetService.getWidgetsBySidebar(sidebarId as string, theme as string);
      } else {
        widgets = await widgetService.getAllWidgets(theme as string);
      }

      res.json({
        success: true,
        data: { widgets },
      });
    } catch (error) {
      console.error('Get widgets error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async createWidget(req: Request, res: Response) {
    try {
      const data = req.body;
      const userId = req.user!.id;

      const widget = await widgetService.createWidget(data);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'create_widget',
        widget.id,
        `Widget: ${widget.widgetId}`,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({
        success: true,
        data: { widget },
        message: 'Widget created successfully',
      });
    } catch (error: any) {
      console.error('Create widget error:', error);

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getWidget(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const widget = await widgetService.getWidgetById(id);

      if (!widget) {
        return res.status(404).json({
          success: false,
          error: 'Widget not found',
        });
      }

      // Get widget type info
      const widgetType = widgetService.getWidgetType(widget.widgetId);

      res.json({
        success: true,
        data: { widget, widgetType },
      });
    } catch (error) {
      console.error('Get widget error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async updateWidget(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;

      const widget = await widgetService.updateWidget(id, data);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'update_widget',
        widget.id,
        `Widget: ${widget.widgetId}`,
        data,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { widget },
        message: 'Widget updated successfully',
      });
    } catch (error: any) {
      console.error('Update widget error:', error);

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async deleteWidget(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const widget = await widgetService.getWidgetById(id);
      if (!widget) {
        return res.status(404).json({
          success: false,
          error: 'Widget not found',
        });
      }

      await widgetService.deleteWidget(id);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'delete_widget',
        widget.id,
        `Widget: ${widget.widgetId}`,
        undefined,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Widget deleted successfully',
      });
    } catch (error) {
      console.error('Delete widget error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Widget types
  static async getWidgetTypes(req: Request, res: Response) {
    try {
      const widgetTypes = widgetService.getAllWidgetTypes();

      res.json({
        success: true,
        data: { widgetTypes },
      });
    } catch (error) {
      console.error('Get widget types error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getWidgetGroups(req: Request, res: Response) {
    try {
      const widgetGroups = widgetService.getAllWidgetGroups();

      res.json({
        success: true,
        data: { widgetGroups },
      });
    } catch (error) {
      console.error('Get widget groups error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Sidebars
  static async getSidebars(req: Request, res: Response) {
    try {
      const sidebars = widgetService.getAvailableSidebars();

      res.json({
        success: true,
        data: { sidebars },
      });
    } catch (error) {
      console.error('Get sidebars error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getSidebarWidgets(req: Request, res: Response) {
    try {
      const { sidebarId } = req.params;
      const { theme = 'default' } = req.query;

      const widgets = await widgetService.getWidgetsBySidebar(sidebarId, theme as string);

      res.json({
        success: true,
        data: { widgets },
      });
    } catch (error) {
      console.error('Get sidebar widgets error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Reordering
  static async reorderWidgets(req: Request, res: Response) {
    try {
      const { sidebarId, widgetIds } = req.body;
      const { theme = 'default' } = req.query;
      const userId = req.user!.id;

      await widgetService.reorderWidgets(sidebarId, widgetIds, theme as string);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'reorder_widgets',
        sidebarId,
        `Reordered widgets in ${sidebarId}`,
        { widgetIds, theme },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: 'Widgets reordered successfully',
      });
    } catch (error) {
      console.error('Reorder widgets error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Move widget
  static async moveWidget(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { sidebarId, position } = req.body;
      const userId = req.user!.id;

      const widget = await widgetService.moveWidget(id, sidebarId, position);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'move_widget',
        widget.id,
        `Widget moved to ${sidebarId}`,
        { sidebarId, position },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { widget },
        message: 'Widget moved successfully',
      });
    } catch (error) {
      console.error('Move widget error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Clone widget
  static async cloneWidget(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { sidebarId, theme = 'default' } = req.body;
      const userId = req.user!.id;

      const widget = await widgetService.cloneWidget(id, sidebarId, theme);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'clone_widget',
        widget.id,
        `Widget cloned to ${sidebarId}`,
        { sidebarId, theme },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        data: { widget },
        message: 'Widget cloned successfully',
      });
    } catch (error) {
      console.error('Clone widget error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Bulk operations
  static async bulkDelete(req: Request, res: Response) {
    try {
      const { widgetIds } = req.body;
      const userId = req.user!.id;

      if (!widgetIds || !Array.isArray(widgetIds) || widgetIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Widget IDs are required',
        });
      }

      await widgetService.deleteWidgets(widgetIds);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'bulk_delete_widgets',
        widgetIds.join(','),
        `${widgetIds.length} widgets deleted`,
        { count: widgetIds.length },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: `${widgetIds.length} widgets deleted successfully`,
      });
    } catch (error) {
      console.error('Bulk delete widgets error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async bulkMove(req: Request, res: Response) {
    try {
      const { widgetIds, sidebarId, theme = 'default' } = req.body;
      const userId = req.user!.id;

      if (!widgetIds || !Array.isArray(widgetIds) || widgetIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Widget IDs are required',
        });
      }

      await widgetService.moveWidgetsToSidebar(widgetIds, sidebarId, theme);

      // Audit log
      await auditService.logContentAction(
        userId,
        'widget',
        'bulk_move_widgets',
        widgetIds.join(','),
        `${widgetIds.length} widgets moved to ${sidebarId}`,
        { count: widgetIds.length, sidebarId, theme },
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        success: true,
        message: `${widgetIds.length} widgets moved successfully`,
      });
    } catch (error) {
      console.error('Bulk move widgets error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}