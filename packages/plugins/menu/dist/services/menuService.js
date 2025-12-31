"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MenuService {
    // Menu CRUD operations
    async getMenus() {
        return await prisma.menu.findMany({
            include: {
                items: {
                    orderBy: { position: 'asc' }
                },
                locations: true
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async getMenuById(id) {
        return await prisma.menu.findUnique({
            where: { id },
            include: {
                items: {
                    orderBy: { position: 'asc' }
                },
                locations: true
            }
        });
    }
    async createMenu(data) {
        const slug = data.slug || this.generateSlug(data.name);
        return await prisma.menu.create({
            data: {
                name: data.name,
                slug,
                status: data.status || 'published'
            }
        });
    }
    async updateMenu(id, data) {
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.slug)
            updateData.slug = data.slug;
        if (data.status)
            updateData.status = data.status;
        return await prisma.menu.update({
            where: { id },
            data: updateData
        });
    }
    async deleteMenu(id) {
        await prisma.menu.delete({
            where: { id }
        });
    }
    // Menu Item CRUD operations
    async getMenuItems(menuId) {
        return await prisma.menuItem.findMany({
            where: { menu_id: menuId },
            orderBy: { position: 'asc' }
        });
    }
    async createMenuItem(data) {
        // Get max position for this menu/parent combination
        const maxPosition = await this.getMaxPosition(data.menu_id, data.parent_id || 0);
        const position = data.position !== undefined ? data.position : maxPosition + 1;
        return await prisma.menuItem.create({
            data: {
                menu_id: data.menu_id,
                parent_id: data.parent_id || 0,
                title: data.title,
                url: data.url,
                target: data.target || '_self',
                icon_class: data.icon_class,
                css_class: data.css_class,
                position
            }
        });
    }
    async updateMenuItem(id, data) {
        const updateData = {};
        if (data.parent_id !== undefined)
            updateData.parent_id = data.parent_id;
        if (data.title)
            updateData.title = data.title;
        if (data.url)
            updateData.url = data.url;
        if (data.target)
            updateData.target = data.target;
        if (data.icon_class !== undefined)
            updateData.icon_class = data.icon_class;
        if (data.css_class !== undefined)
            updateData.css_class = data.css_class;
        if (data.position !== undefined)
            updateData.position = data.position;
        return await prisma.menuItem.update({
            where: { id },
            data: updateData
        });
    }
    async deleteMenuItem(id) {
        await prisma.menuItem.delete({
            where: { id }
        });
    }
    async reorderMenuItems(menuId, items) {
        const updates = items.map(item => prisma.menuItem.update({
            where: { id: item.id },
            data: {
                parent_id: item.parent_id,
                position: item.position
            }
        }));
        await prisma.$transaction(updates);
    }
    // Menu Location CRUD operations
    async getMenuLocations() {
        return await prisma.menuLocation.findMany({
            include: {
                menu: true
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async createMenuLocation(data) {
        return await prisma.menuLocation.create({
            data: {
                name: data.name,
                location: data.location,
                menu_id: data.menu_id
            }
        });
    }
    async updateMenuLocation(id, data) {
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.location)
            updateData.location = data.location;
        if (data.menu_id !== undefined)
            updateData.menu_id = data.menu_id;
        return await prisma.menuLocation.update({
            where: { id },
            data: updateData
        });
    }
    async deleteMenuLocation(id) {
        await prisma.menuLocation.delete({
            where: { id }
        });
    }
    // Helper methods
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    async getMaxPosition(menuId, parentId) {
        const result = await prisma.menuItem.findFirst({
            where: {
                menu_id: menuId,
                parent_id: parentId
            },
            orderBy: { position: 'desc' },
            select: { position: true }
        });
        return result?.position || 0;
    }
    // Build hierarchical menu structure
    buildHierarchicalMenu(items) {
        const itemMap = new Map();
        const roots = [];
        // Convert items to hierarchical format
        items.forEach(item => {
            const hierarchicalItem = {
                ...item,
                children: [],
                depth: 0
            };
            itemMap.set(item.id, hierarchicalItem);
        });
        // Build hierarchy
        items.forEach(item => {
            const hierarchicalItem = itemMap.get(item.id);
            if (item.parent_id && item.parent_id !== 0) {
                const parent = itemMap.get(item.parent_id);
                if (parent) {
                    parent.children.push(hierarchicalItem);
                    hierarchicalItem.depth = parent.depth + 1;
                }
                else {
                    // Orphan item, treat as root
                    roots.push(hierarchicalItem);
                }
            }
            else {
                roots.push(hierarchicalItem);
            }
        });
        // Sort children by position
        const sortByPosition = (a, b) => a.position - b.position;
        roots.sort(sortByPosition);
        roots.forEach(root => {
            this.sortChildrenRecursive(root, sortByPosition);
        });
        return roots;
    }
    sortChildrenRecursive(item, sortFn) {
        item.children.sort(sortFn);
        item.children.forEach(child => this.sortChildrenRecursive(child, sortFn));
    }
    // Get menu for frontend rendering
    async getMenuForLocation(location) {
        const menuLocation = await prisma.menuLocation.findUnique({
            where: { location },
            include: {
                menu: {
                    include: {
                        items: {
                            orderBy: { position: 'asc' }
                        }
                    }
                }
            }
        });
        return menuLocation?.menu || null;
    }
}
exports.MenuService = MenuService;
