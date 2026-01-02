import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { PluginContext } from '@cms/shared';
import { z } from 'zod';
import { AuditService } from '@cms/core';

const saveWidgetsSchema = z.object({
  sidebarId: z.string(),
  theme: z.string(),
  widgets: z.array(z.object({
    widgetId: z.string(),
    position: z.number(),
    data: z.record(z.any()),
  })),
});

export function registerWidgetRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
) {
  const db = ctx.db as PrismaClient;
  const auditService = ctx.audit as AuditService;

  // Get widgets for sidebar
  router.get(
    '/widgets',
    requireAuth,
    requirePermission('widgets.index'),
    async (req: any, res: Response) => {
      try {
        const { sidebarId, theme } = req.query;

        if (!sidebarId || !theme) {
          return res.status(400).json({
            success: false,
            error: 'sidebarId and theme are required',
          });
        }

        const widgets = await db.widget.findMany({
          where: {
            sidebarId: sidebarId as string,
            theme: theme as string,
          },
          orderBy: { position: 'asc' },
        });

        res.json({
          success: true,
          data: { widgets },
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Save widgets to sidebar
  router.post(
    '/widgets/save-widgets-to-sidebar',
    requireAuth,
    requirePermission('widgets.index'),
    async (req: any, res: Response) => {
      try {
        const data = saveWidgetsSchema.parse(req.body);
        const userId = req.user!.id;

        // Delete existing widgets for this sidebar
        await db.widget.deleteMany({
          where: {
            sidebarId: data.sidebarId,
            theme: data.theme,
          },
        });

        // Create new widgets
        if (data.widgets.length > 0) {
          await db.widget.createMany({
            data: data.widgets.map((widget) => ({
              widgetId: widget.widgetId,
              sidebarId: data.sidebarId,
              theme: data.theme,
              position: widget.position,
              data: JSON.stringify(widget.data),
            })),
          });
        }

        // Audit log
        await auditService.log({
          userId,
          module: 'widgets',
          action: 'update',
          referenceName: `Sidebar: ${data.sidebarId}`,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });

        res.json({
          success: true,
          message: 'Widgets saved successfully',
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: error.errors,
          });
        }

        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Delete widget
  router.delete(
    '/widgets/delete',
    requireAuth,
    requirePermission('widgets.index'),
    async (req: any, res: Response) => {
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Widget ID is required',
          });
        }

        await db.widget.delete({
          where: { id: parseInt(id as string) },
        });

        res.json({
          success: true,
          message: 'Widget deleted successfully',
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

