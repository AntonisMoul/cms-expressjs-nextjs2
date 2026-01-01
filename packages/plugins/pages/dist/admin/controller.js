"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesAdminController = void 0;
const client_1 = require("@prisma/client");
const service_1 = require("../service");
const core_1 = require("@cms/core");
const prisma = new client_1.PrismaClient();
const pagesService = new service_1.PagesService(prisma);
const auditService = new core_1.AuditService(prisma);
const slugService = new core_1.SlugService(prisma);
class PagesAdminController {
    static async index(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                search: req.query.search,
                status: req.query.status,
                author: req.query.author,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'desc',
            };
            const result = await pagesService.getPages(options);
            res.json({
                success: true,
                data: result.data,
                pagination: result.pagination,
            });
        }
        catch (error) {
            console.error('Pages index error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async create(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id;
            const page = await pagesService.createPage(data, userId);
            // Create slug for the page
            await slugService.createSlugForEntity('page', page.id, page.name);
            // Audit log
            await auditService.logContentAction(userId, 'pages', 'create', page.id, page.name, data, req.ip, req.get('User-Agent'));
            res.status(201).json({
                success: true,
                data: { page },
                message: 'Page created successfully',
            });
        }
        catch (error) {
            console.error('Page create error:', error);
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    error: 'Page name already exists',
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async show(req, res) {
        try {
            const { id } = req.params;
            const page = await pagesService.getPageWithTranslations(id);
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
            console.error('Page show error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const userId = req.user.id;
            const existingPage = await pagesService.getPageById(id);
            if (!existingPage) {
                return res.status(404).json({
                    success: false,
                    error: 'Page not found',
                });
            }
            const page = await pagesService.updatePage(id, data);
            // Update slug if name changed
            if (data.name && data.name !== existingPage.name) {
                await slugService.updateSlugForEntity('page', page.id, page.name);
            }
            // Audit log
            await auditService.logContentAction(userId, 'pages', 'update', page.id, page.name, data, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                data: { page },
                message: 'Page updated successfully',
            });
        }
        catch (error) {
            console.error('Page update error:', error);
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    error: 'Page name already exists',
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const page = await pagesService.getPageById(id);
            if (!page) {
                return res.status(404).json({
                    success: false,
                    error: 'Page not found',
                });
            }
            await pagesService.deletePage(id);
            // Deactivate slug
            await slugService.deactivateSlug(id);
            // Audit log
            await auditService.logContentAction(userId, 'pages', 'delete', page.id, page.name, undefined, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Page deleted successfully',
            });
        }
        catch (error) {
            console.error('Page delete error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Translation methods
    static async createTranslation(req, res) {
        try {
            const { id } = req.params;
            const { langCode, name, description, content } = req.body;
            const userId = req.user.id;
            await pagesService.createPageTranslation(id, langCode, {
                name,
                description,
                content,
            });
            const page = await pagesService.getPageById(id);
            // Audit log
            await auditService.logContentAction(userId, 'pages', 'create_translation', page.id, `${page.name} (${langCode})`, { langCode, name }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Translation created successfully',
            });
        }
        catch (error) {
            console.error('Create translation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async updateTranslation(req, res) {
        try {
            const { id, langCode } = req.params;
            const { name, description, content } = req.body;
            const userId = req.user.id;
            await pagesService.updatePageTranslation(id, langCode, {
                name,
                description,
                content,
            });
            const page = await pagesService.getPageById(id);
            // Audit log
            await auditService.logContentAction(userId, 'pages', 'update_translation', page.id, `${page.name} (${langCode})`, { langCode, name }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Translation updated successfully',
            });
        }
        catch (error) {
            console.error('Update translation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async deleteTranslation(req, res) {
        try {
            const { id, langCode } = req.params;
            const userId = req.user.id;
            const page = await pagesService.getPageById(id);
            await pagesService.deletePageTranslation(id, langCode);
            // Audit log
            await auditService.logContentAction(userId, 'pages', 'delete_translation', page.id, `${page.name} (${langCode})`, { langCode }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Translation deleted successfully',
            });
        }
        catch (error) {
            console.error('Delete translation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.PagesAdminController = PagesAdminController;
//# sourceMappingURL=controller.js.map