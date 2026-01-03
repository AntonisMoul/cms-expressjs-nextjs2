"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWidgetRoutes = registerWidgetRoutes;
const zod_1 = require("zod");
const saveWidgetsSchema = zod_1.z.object({
    sidebarId: zod_1.z.string(),
    theme: zod_1.z.string(),
    widgets: zod_1.z.array(zod_1.z.object({
        widgetId: zod_1.z.string(),
        position: zod_1.z.number(),
        data: zod_1.z.record(zod_1.z.any()),
    })),
});
function registerWidgetRoutes(router, ctx, requireAuth, requirePermission) {
    const db = ctx.db;
    const auditService = ctx.audit;
    // Get widgets for sidebar
    router.get('/widgets', requireAuth, requirePermission('widgets.index'), async (req, res) => {
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
                    sidebarId: sidebarId,
                    theme: theme,
                },
                orderBy: { position: 'asc' },
            });
            res.json({
                success: true,
                data: { widgets },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Save widgets to sidebar
    router.post('/widgets/save-widgets-to-sidebar', requireAuth, requirePermission('widgets.index'), async (req, res) => {
        try {
            const data = saveWidgetsSchema.parse(req.body);
            const userId = req.user.id;
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
    });
    // Delete widget
    router.delete('/widgets/delete', requireAuth, requirePermission('widgets.index'), async (req, res) => {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Widget ID is required',
                });
            }
            await db.widget.delete({
                where: { id: parseInt(id) },
            });
            res.json({
                success: true,
                message: 'Widget deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
}
//# sourceMappingURL=routes.js.map