import { Router, RequestHandler } from 'express';
import { MenuService } from '../services/menuService';
import { AuthMiddleware, PrismaClient } from '@cms/core';
import { CreateMenuRequest, UpdateMenuRequest, CreateMenuItemRequest, UpdateMenuItemRequest, CreateMenuLocationRequest, UpdateMenuLocationRequest } from '../models/types';

const prisma = new PrismaClient();
const authMiddleware = new AuthMiddleware(prisma);

const router = Router();
const menuService = new MenuService();

// Menu CRUD routes
router.get('/menus', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.view') as RequestHandler as RequestHandler, async (req, res) => {
  try {
    const menus = await menuService.getMenus();
    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});

router.get('/menus/:id', authMiddleware.authenticate, authMiddleware.requirePermission('menus.view') as RequestHandler, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const menu = await menuService.getMenuById(id);

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

router.post('/menus', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.create') as RequestHandler, async (req, res) => {
  try {
    const data: CreateMenuRequest = req.body;
    const menu = await menuService.createMenu(data);
    res.status(201).json(menu);
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).json({ error: 'Failed to create menu' });
  }
});

router.put('/menus/:id', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateMenuRequest = req.body;
    const menu = await menuService.updateMenu(id, data);
    res.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ error: 'Failed to update menu' });
  }
});

router.delete('/menus/:id', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.delete') as RequestHandler, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await menuService.deleteMenu(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ error: 'Failed to delete menu' });
  }
});

// Menu Item routes
router.get('/menus/:menuId/items', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.view') as RequestHandler, async (req, res) => {
  try {
    const menuId = parseInt(req.params.menuId);
    const items = await menuService.getMenuItems(menuId);
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

router.post('/menus/:menuId/items', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const menuId = parseInt(req.params.menuId);
    const data: CreateMenuItemRequest = { ...req.body, menu_id: menuId };
    const item = await menuService.createMenuItem(data);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

router.put('/menu-items/:id', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateMenuItemRequest = req.body;
    const item = await menuService.updateMenuItem(id, data);
    res.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

router.delete('/menu-items/:id', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await menuService.deleteMenuItem(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

router.post('/menus/:menuId/items/reorder', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const menuId = parseInt(req.params.menuId);
    const items = req.body.items;
    await menuService.reorderMenuItems(menuId, items);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error reordering menu items:', error);
    res.status(500).json({ error: 'Failed to reorder menu items' });
  }
});

// Menu Location routes
router.get('/menu-locations', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.view') as RequestHandler, async (req, res) => {
  try {
    const locations = await menuService.getMenuLocations();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching menu locations:', error);
    res.status(500).json({ error: 'Failed to fetch menu locations' });
  }
});

router.post('/menu-locations', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const data: CreateMenuLocationRequest = req.body;
    const location = await menuService.createMenuLocation(data);
    res.status(201).json(location);
  } catch (error) {
    console.error('Error creating menu location:', error);
    res.status(500).json({ error: 'Failed to create menu location' });
  }
});

router.put('/menu-locations/:id', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateMenuLocationRequest = req.body;
    const location = await menuService.updateMenuLocation(id, data);
    res.json(location);
  } catch (error) {
    console.error('Error updating menu location:', error);
    res.status(500).json({ error: 'Failed to update menu location' });
  }
});

router.delete('/menu-locations/:id', authMiddleware.authenticate as RequestHandler, authMiddleware.requirePermission('menus.edit') as RequestHandler, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await menuService.deleteMenuLocation(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting menu location:', error);
    res.status(500).json({ error: 'Failed to delete menu location' });
  }
});

// Public route to get menu for frontend rendering
router.get('/public/menus/:location', async (req, res) => {
  try {
    const location = req.params.location;
    const menu = await menuService.getMenuForLocation(location);

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Build hierarchical structure
    const hierarchicalItems = menuService.buildHierarchicalMenu(menu.items || []);
    const menuWithHierarchy = {
      ...menu,
      items: hierarchicalItems
    };

    res.json(menuWithHierarchy);
  } catch (error) {
    console.error('Error fetching public menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

export default router;
