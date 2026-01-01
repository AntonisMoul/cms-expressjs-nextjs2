"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetPublicController = void 0;
const client_1 = require("@prisma/client");
const service_1 = require("../service");
const prisma = new client_1.PrismaClient();
const widgetService = new service_1.WidgetService(prisma);
class WidgetPublicController {
    static async getSidebarWidgets(req, res) {
        try {
            const { sidebarId } = req.params;
            const { theme = 'default' } = req.query;
            const sidebarWidgets = await widgetService.getSidebarWidgets(sidebarId, theme);
            res.json({
                success: true,
                data: { widgets: sidebarWidgets },
            });
        }
        catch (error) {
            console.error('Get sidebar widgets error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async renderSidebar(req, res) {
        try {
            const { sidebarId } = req.params;
            const { theme = 'default' } = req.query;
            const sidebarWidgets = await widgetService.getSidebarWidgets(sidebarId, theme);
            // Generate HTML for the entire sidebar
            const html = await this.generateSidebarHtml(sidebarWidgets);
            res.json({
                success: true,
                data: { html, widgets: sidebarWidgets },
            });
        }
        catch (error) {
            console.error('Render sidebar error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async getWidgetHtml(req, res) {
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
        }
        catch (error) {
            console.error('Get widget HTML error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Private helper methods
    static async generateSidebarHtml(sidebarWidgets) {
        const widgetHtmls = sidebarWidgets.map(({ html }) => html);
        return `<div class="widget-sidebar">
      ${widgetHtmls.join('\n')}
    </div>`;
    }
}
exports.WidgetPublicController = WidgetPublicController;
//# sourceMappingURL=controller.js.map