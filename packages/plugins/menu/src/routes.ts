import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { PluginContext } from '@cms/shared';
import { z } from 'zod';
import { AuditService } from '@cms/core';

const createMenuSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().max(120).optional(),
  status: z.enum(['published', 'draft']).default('published'),
});

const createMenuNodeSchema = z.object({
  menuId: z.number(),
  parentId: z.number().default(0),
  referenceId: z.number().optional(),
  referenceType: z.string().optional(),
  url: z.string().max(120).optional(),
  iconFont: z.string().max(50).optional(),
  position: z.number().default(0),
  title: z.string().max(120).optional(),
  cssClass: z.string().max(120).optional(),
  target: z.string().default('_self'),
});

export function registerMenuRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
) {
  const db = ctx.db as PrismaClient;
  const auditService = ctx.audit as AuditService;

  // List menus
  router.get(
    '/menus',
    requireAuth,
    requirePermission('menus.index'),
    async (req: any, res: Response) => {
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
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Get menu by ID
  router.get(
    '/menus/:id',
    requireAuth,
    requirePermission('menus.index'),
    async (req: any, res: Response) => {
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
        const buildTree = (parentId: number = 0): any[] => {
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
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Create menu
  router.post(
    '/menus',
    requireAuth,
    requirePermission('menus.create'),
    async (req: any, res: Response) => {
      try {
        const data = createMenuSchema.parse(req.body);
        const userId = req.user!.id;

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

  // Update menu
  router.put(
    '/menus/:id',
    requireAuth,
    requirePermission('menus.edit'),
    async (req: any, res: Response) => {
      try {
        const menuId = parseInt(req.params.id);
        const data = createMenuSchema.partial().parse(req.body);
        const userId = req.user!.id;

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

  // Delete menu
  router.delete(
    '/menus/:id',
    requireAuth,
    requirePermission('menus.delete'),
    async (req: any, res: Response) => {
      try {
        const menuId = parseInt(req.params.id);
        const userId = req.user!.id;

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
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Create menu node
  router.post(
    '/menus/:id/nodes',
    requireAuth,
    requirePermission('menus.edit'),
    async (req: any, res: Response) => {
      try {
        const menuId = parseInt(req.params.id);
        const data = createMenuNodeSchema.parse({
          ...req.body,
          menuId,
        });

        const node = await db.menuNode.create({
          data: {
            menuId: data.menuId as number,
            parentId: data.parentId as number | undefined,
            referenceId: data.referenceId as number | null | undefined,
            referenceType: data.referenceType as string | null | undefined,
            url: data.url as string | null | undefined,
            iconFont: data.iconFont as string | null | undefined,
            position: data.position as number | undefined,
            title: data.title as string | null | undefined,
            cssClass: data.cssClass as string | null | undefined,
            target: data.target as string | undefined,
          },
        });

        res.status(201).json({
          success: true,
          data: { node },
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

  // Update menu node
  router.put(
    '/menus/nodes/:nodeId',
    requireAuth,
    requirePermission('menus.edit'),
    async (req: any, res: Response) => {
      try {
        const nodeId = parseInt(req.params.nodeId);
        const data = createMenuNodeSchema.partial().parse(req.body);

        const updateData: any = {};
        if (data.parentId !== undefined) updateData.parentId = data.parentId;
        if (data.referenceId !== undefined) updateData.referenceId = data.referenceId;
        if (data.referenceType !== undefined) updateData.referenceType = data.referenceType;
        if (data.url !== undefined) updateData.url = data.url;
        if (data.iconFont !== undefined) updateData.iconFont = data.iconFont;
        if (data.position !== undefined) updateData.position = data.position;
        if (data.title !== undefined) updateData.title = data.title;
        if (data.cssClass !== undefined) updateData.cssClass = data.cssClass;
        if (data.target !== undefined) updateData.target = data.target;

        const node = await db.menuNode.update({
          where: { id: nodeId },
          data: updateData,
        });

        res.json({
          success: true,
          data: { node },
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

  // Delete menu node
  router.delete(
    '/menus/nodes/:nodeId',
    requireAuth,
    requirePermission('menus.edit'),
    async (req: any, res: Response) => {
      try {
        const nodeId = parseInt(req.params.nodeId);

        await db.menuNode.delete({
          where: { id: nodeId },
        });

        res.json({
          success: true,
          message: 'Menu node deleted successfully',
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Update menu tree (reorder nodes)
  router.put(
    '/menus/:id/tree',
    requireAuth,
    requirePermission('menus.edit'),
    async (req: any, res: Response) => {
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
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );

  // Get menu node (for AJAX)
  router.get(
    '/menus/ajax/get-node',
    requireAuth,
    requirePermission('menus.index'),
    async (req: any, res: Response) => {
      try {
        const { referenceType, referenceId } = req.query;

        if (!referenceType || !referenceId) {
          return res.status(400).json({
            success: false,
            error: 'referenceType and referenceId are required',
          });
        }

        // Get entity based on reference type
        let entity: any = null;
        if (referenceType === 'Page') {
          entity = await db.page.findUnique({
            where: { id: parseInt(referenceId as string) },
          });
        } else if (referenceType === 'Post') {
          entity = await db.post.findUnique({
            where: { id: parseInt(referenceId as string) },
          });
        } else if (referenceType === 'Category') {
          entity = await db.category.findUnique({
            where: { id: parseInt(referenceId as string) },
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
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error',
        });
      }
    }
  );
}

