"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMenuRoutes = registerMenuRoutes;
const zod_1 = require("zod");
const createMenuSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120),
    slug: zod_1.z.string().max(120).optional(),
    status: zod_1.z.enum(['published', 'draft']).default('published'),
});
const createMenuNodeSchema = zod_1.z.object({
    menuId: zod_1.z.number(),
    parentId: zod_1.z.number().default(0),
    referenceId: zod_1.z.number().optional(),
    referenceType: zod_1.z.string().optional(),
    url: zod_1.z.string().max(120).optional(),
    iconFont: zod_1.z.string().max(50).optional(),
    position: zod_1.z.number().default(0),
    title: zod_1.z.string().max(120).optional(),
    cssClass: zod_1.z.string().max(120).optional(),
    target: zod_1.z.string().default('_self').max(20),
});
function registerMenuRoutes(router, ctx, requireAuth, requirePermission) {
    const db = ctx.db;
    const auditService = ctx.audit;
    // List menus
    router.get('/menus', requireAuth, requirePermission('menus.index'), async (req, res) => {
        try {
            const menus = await db.menu.findMany({
                include: {
                    nodes: {
                        orderBy: { position: 'asc' },
                    },
                    locations: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            res.json({
                success: true,
                data: { menus },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Get menu by ID
    router.get('/menus/:id', requireAuth, requirePermission('menus.index'), async (req, res) => {
        try {
            const menu = await db.menu.findUnique({
                where: { id: parseInt(req.params.id) },
                include: {
                    nodes: {
                        orderBy: { position: 'asc' },
                    },
                    locations: true,
                },
            });
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    error: 'Menu not found',
                });
            }
            // Build tree structure
            const buildTree = (parentId = 0) => {
                return menu.nodes
                    .filter((node) => node.parentId === parentId)
                    .map((node) => ({
                    ...node,
                    children: buildTree(node.id),
                }));
            };
            const tree = buildTree();
            res.json({
                success: true,
                data: {
                    menu: {
                        ...menu,
                        tree,
                    },
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Create menu
    router.post('/menus', requireAuth, requirePermission('menus.create'), async (req, res) => {
        try {
            const data = createMenuSchema.parse(req.body);
            const userId = req.user.id;
            const menu = await db.menu.create({
                data: {
                    name: data.name,
                    slug: data.slug,
                    status: data.status,
                },
            });
            // Audit log
            await auditService.log({
                userId,
                module: 'menus',
                action: 'create',
                referenceId: BigInt(menu.id),
                referenceName: menu.name,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.status(201).json({
                success: true,
                data: { menu },
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
    // Update menu
    router.put('/menus/:id', requireAuth, requirePermission('menus.edit'), async (req, res) => {
        try {
            const menuId = parseInt(req.params.id);
            const data = createMenuSchema.partial().parse(req.body);
            const userId = req.user.id;
            const menu = await db.menu.update({
                where: { id: menuId },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.slug !== undefined && { slug: data.slug }),
                    ...(data.status && { status: data.status }),
                },
            });
            // Audit log
            await auditService.log({
                userId,
                module: 'menus',
                action: 'update',
                referenceId: BigInt(menu.id),
                referenceName: menu.name,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.json({
                success: true,
                data: { menu },
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
    // Delete menu
    router.delete('/menus/:id', requireAuth, requirePermission('menus.delete'), async (req, res) => {
        try {
            const menuId = parseInt(req.params.id);
            const userId = req.user.id;
            const menu = await db.menu.findUnique({
                where: { id: menuId },
            });
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    error: 'Menu not found',
                });
            }
            await db.menu.delete({
                where: { id: menuId },
            });
            // Audit log
            await auditService.log({
                userId,
                module: 'menus',
                action: 'delete',
                referenceId: BigInt(menuId),
                referenceName: menu.name,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            res.json({
                success: true,
                message: 'Menu deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Create menu node
    router.post('/menus/:id/nodes', requireAuth, requirePermission('menus.edit'), async (req, res) => {
        try {
            const menuId = parseInt(req.params.id);
            const data = createMenuNodeSchema.parse({
                ...req.body,
                menuId,
            });
            const node = await db.menuNode.create({
                data: {
                    menuId: data.menuId,
                    parentId: data.parentId,
                    referenceId: data.referenceId,
                    referenceType: data.referenceType,
                    url: data.url,
                    iconFont: data.iconFont,
                    position: data.position,
                    title: data.title,
                    cssClass: data.cssClass,
                    target: data.target,
                },
            });
            res.status(201).json({
                success: true,
                data: { node },
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
    // Update menu node
    router.put('/menus/nodes/:nodeId', requireAuth, requirePermission('menus.edit'), async (req, res) => {
        try {
            const nodeId = parseInt(req.params.nodeId);
            const data = createMenuNodeSchema.partial().parse(req.body);
            const node = await db.menuNode.update({
                where: { id: nodeId },
                data: {
                    ...(data.parentId !== undefined && { parentId: data.parentId }),
                    ...(data.referenceId !== undefined && { referenceId: data.referenceId }),
                    ...(data.referenceType !== undefined && { referenceType: data.referenceType }),
                    ...(data.url !== undefined && { url: data.url }),
                    ...(data.iconFont !== undefined && { iconFont: data.iconFont }),
                    ...(data.position !== undefined && { position: data.position }),
                    ...(data.title !== undefined && { title: data.title }),
                    ...(data.cssClass !== undefined && { cssClass: data.cssClass }),
                    ...(data.target !== undefined && { target: data.target }),
                },
            });
            res.json({
                success: true,
                data: { node },
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
    // Delete menu node
    router.delete('/menus/nodes/:nodeId', requireAuth, requirePermission('menus.edit'), async (req, res) => {
        try {
            const nodeId = parseInt(req.params.nodeId);
            await db.menuNode.delete({
                where: { id: nodeId },
            });
            res.json({
                success: true,
                message: 'Menu node deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Update menu tree (reorder nodes)
    router.put('/menus/:id/tree', requireAuth, requirePermission('menus.edit'), async (req, res) => {
        try {
            const menuId = parseInt(req.params.id);
            const { tree } = req.body; // Array of { id, parentId, position }
            if (!Array.isArray(tree)) {
                return res.status(400).json({
                    success: false,
                    error: 'Tree must be an array',
                });
            }
            // Update each node
            for (const item of tree) {
                await db.menuNode.update({
                    where: { id: item.id },
                    data: {
                        parentId: item.parentId || 0,
                        position: item.position || 0,
                    },
                });
            }
            res.json({
                success: true,
                message: 'Menu tree updated successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    });
    // Get menu node (for AJAX)
    router.get('/menus/ajax/get-node', requireAuth, requirePermission('menus.index'), async (req, res) => {
        try {
            const { referenceType, referenceId } = req.query;
            if (!referenceType || !referenceId) {
                return res.status(400).json({
                    success: false,
                    error: 'referenceType and referenceId are required',
                });
            }
            // Get entity based on reference type
            let entity = null;
            if (referenceType === 'Page') {
                entity = await db.page.findUnique({
                    where: { id: parseInt(referenceId) },
                });
            }
            else if (referenceType === 'Post') {
                entity = await db.post.findUnique({
                    where: { id: parseInt(referenceId) },
                });
            }
            else if (referenceType === 'Category') {
                entity = await db.category.findUnique({
                    where: { id: parseInt(referenceId) },
                });
            }
            if (!entity) {
                return res.status(404).json({
                    success: false,
                    error: 'Entity not found',
                });
            }
            res.json({
                success: true,
                data: {
                    title: entity.name,
                    url: entity.slug ? `/${entity.slug.prefix}/${entity.slug.key}` : '#',
                },
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