"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesPublicController = void 0;
const client_1 = require("@prisma/client");
const service_1 = require("../service");
const prisma = new client_1.PrismaClient();
const pagesService = new service_1.PagesService(prisma);
class PagesPublicController {
    static async getPage(req, res) {
        try {
            const { slug } = req.params;
            const locale = req.query.locale || 'en';
            // For now, we'll use the slug parameter directly
            // In a full implementation, this would resolve the slug through the SlugService
            const page = await pagesService.getPublishedPages().then(pages => pages.find(p => p.id === slug) // This is a temporary implementation
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
        }
        catch (error) {
            console.error('Get page error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async getPages(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const pages = await pagesService.getPublishedPages();
            // Limit results
            const limitedPages = pages.slice(0, limit);
            res.json({
                success: true,
                data: { pages: limitedPages },
            });
        }
        catch (error) {
            console.error('Get pages error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async getFeaturedPages(req, res) {
        try {
            const pages = await pagesService.getPublishedPages();
            const featuredPages = pages.filter(page => page.isFeatured);
            res.json({
                success: true,
                data: { pages: featuredPages },
            });
        }
        catch (error) {
            console.error('Get featured pages error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.PagesPublicController = PagesPublicController;
//# sourceMappingURL=controller.js.map