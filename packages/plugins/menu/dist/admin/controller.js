"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuAdminController = void 0;
const client_1 = require("@prisma/client");
const service_1 = require("../service");
const core_1 = require("@cms/core");
const prisma = new client_1.PrismaClient();
const menuService = new service_1.MenuService(prisma);
const auditService = new core_1.AuditService(prisma);
class MenuAdminController {
    static async getMenus(req, res) {
        try {
            const menus = await menuService.getAllMenus();
            res.json({
                success: true,
                data: { menus },
            });
        }
        catch (error) {
            console.error('Get menus error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async createMenu(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id;
            const menu = await menuService.createMenu(data);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'create_menu', menu.id, menu.name, data, req.ip, req.get('User-Agent'));
            res.status(201).json({
                success: true,
                data: { menu },
                message: 'Menu created successfully',
            });
        }
        catch (error) {
            console.error('Create menu error:', error);
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    error: 'Menu slug already exists',
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async getMenu(req, res) {
        try {
            const { id } = req.params;
            const menu = await menuService.getMenuWithNodes(id);
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    error: 'Menu not found',
                });
            }
            res.json({
                success: true,
                data: { menu },
            });
        }
        catch (error) {
            console.error('Get menu error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async updateMenu(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const userId = req.user.id;
            const menu = await menuService.updateMenu(id, data);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'update_menu', menu.id, menu.name, data, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                data: { menu },
                message: 'Menu updated successfully',
            });
        }
        catch (error) {
            console.error('Update menu error:', error);
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    error: 'Menu slug already exists',
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async deleteMenu(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const menu = await menuService.getMenuById(id);
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    error: 'Menu not found',
                });
            }
            await menuService.deleteMenu(id);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'delete_menu', menu.id, menu.name, undefined, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Menu deleted successfully',
            });
        }
        catch (error) {
            console.error('Delete menu error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Menu node operations
    static async createMenuNode(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id;
            const node = await menuService.createMenuNode(data);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'create_menu_node', node.id, node.title || 'Menu Item', data, req.ip, req.get('User-Agent'));
            res.status(201).json({
                success: true,
                data: { node },
                message: 'Menu item created successfully',
            });
        }
        catch (error) {
            console.error('Create menu node error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async updateMenuNode(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const userId = req.user.id;
            const node = await menuService.updateMenuNode(id, data);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'update_menu_node', node.id, node.title || 'Menu Item', data, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                data: { node },
                message: 'Menu item updated successfully',
            });
        }
        catch (error) {
            console.error('Update menu node error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async deleteMenuNode(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get node before deleting for audit log
            const node = await prisma.menuNode.findUnique({
                where: { id },
            });
            if (!node) {
                return res.status(404).json({
                    success: false,
                    error: 'Menu item not found',
                });
            }
            await menuService.deleteMenuNode(id);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'delete_menu_node', node.id, node.title || 'Menu Item', undefined, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Menu item deleted successfully',
            });
        }
        catch (error) {
            console.error('Delete menu node error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async reorderMenuNodes(req, res) {
        try {
            const { menuId, nodeOrders } = req.body;
            const userId = req.user.id;
            await menuService.reorderMenuNodes(menuId, nodeOrders);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'reorder_menu_nodes', menuId, 'Menu nodes reordered', { nodeOrders }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Menu items reordered successfully',
            });
        }
        catch (error) {
            console.error('Reorder menu nodes error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Menu location operations
    static async assignMenuToLocation(req, res) {
        try {
            const { menuId, location } = req.body;
            const userId = req.user.id;
            const menuLocation = await menuService.assignMenuToLocation(menuId, location);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'assign_menu_to_location', menuLocation.id, `Menu assigned to ${location}`, { menuId, location }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                data: { menuLocation },
                message: 'Menu assigned to location successfully',
            });
        }
        catch (error) {
            console.error('Assign menu to location error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async removeMenuFromLocation(req, res) {
        try {
            const { location } = req.params;
            const userId = req.user.id;
            await menuService.removeMenuFromLocation(location);
            // Audit log
            await auditService.logContentAction(userId, 'menu', 'remove_menu_from_location', location, `Menu removed from ${location}`, { location }, req.ip, req.get('User-Agent'));
            res.json({
                success: true,
                message: 'Menu removed from location successfully',
            });
        }
        catch (error) {
            console.error('Remove menu from location error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async getLocations(req, res) {
        try {
            const locations = await menuService.getAllLocations();
            res.json({
                success: true,
                data: { locations },
            });
        }
        catch (error) {
            console.error('Get locations error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async getMenuStructure(req, res) {
        try {
            const { id } = req.params;
            const structure = await menuService.buildMenuStructure(id);
            res.json({
                success: true,
                data: { structure },
            });
        }
        catch (error) {
            console.error('Get menu structure error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Get menu by location for frontend rendering
    static async getMenuByLocation(req, res) {
        try {
            const { location } = req.params;
            const menu = await menuService.getMenuByLocation(location);
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    error: 'Menu not found for this location',
                });
            }
            res.json({
                success: true,
                data: { menu },
            });
        }
        catch (error) {
            console.error('Get menu by location error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.MenuAdminController = MenuAdminController;
//# sourceMappingURL=controller.js.map