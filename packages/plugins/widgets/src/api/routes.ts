import { Router } from 'express';
import { WidgetService } from '../services/widgetService';
import { AuthMiddleware, PrismaClient } from '@cms/core';
import { CreateWidgetRequest, UpdateWidgetRequest, CreateSidebarRequest, UpdateSidebarRequest } from '../models/types';

const prisma = new PrismaClient();
const authMiddleware = new AuthMiddleware(prisma);
const widgetService = new WidgetService();

const router = Router();

// Widget CRUD routes
router.get('/widgets', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.view'), async (req, res) => {
  try {
    const sidebarId = req.query.sidebar_id ? parseInt(req.query.sidebar_id as string) : undefined;
    const widgets = await widgetService.getWidgets(sidebarId);
    res.json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ error: 'Failed to fetch widgets' });
  }
});

router.get('/widgets/:id', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.view'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const widget = await widgetService.getWidgetWithConfig(id);

    if (!widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }

    res.json(widget);
  } catch (error) {
    console.error('Error fetching widget:', error);
    res.status(500).json({ error: 'Failed to fetch widget' });
  }
});

router.post('/widgets', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.create'), async (req, res) => {
  try {
    const data: CreateWidgetRequest = req.body;
    const widget = await widgetService.createWidget(data);
    res.status(201).json(widget);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ error: 'Failed to create widget' });
  }
});

router.put('/widgets/:id', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateWidgetRequest = req.body;
    const widget = await widgetService.updateWidget(id, data);

    // Update settings if config provided
    if (data.config) {
      await widgetService.updateWidgetSettings(id, data.config);
    }

    res.json(widget);
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ error: 'Failed to update widget' });
  }
});

router.delete('/widgets/:id', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.delete'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await widgetService.deleteWidget(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ error: 'Failed to delete widget' });
  }
});

router.post('/widgets/reorder', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.edit'), async (req, res) => {
  try {
    const { sidebar_id, widget_ids } = req.body;
    await widgetService.reorderWidgets(sidebar_id, widget_ids);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error reordering widgets:', error);
    res.status(500).json({ error: 'Failed to reorder widgets' });
  }
});

// Widget Settings routes
router.get('/widgets/:id/settings', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.view'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const settings = await widgetService.getWidgetSettings(id);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching widget settings:', error);
    res.status(500).json({ error: 'Failed to fetch widget settings' });
  }
});

router.put('/widgets/:id/settings', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const settings = req.body;
    await widgetService.updateWidgetSettings(id, settings);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating widget settings:', error);
    res.status(500).json({ error: 'Failed to update widget settings' });
  }
});

// Sidebar CRUD routes
router.get('/sidebars', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.view'), async (req, res) => {
  try {
    const sidebars = await widgetService.getSidebars();
    res.json(sidebars);
  } catch (error) {
    console.error('Error fetching sidebars:', error);
    res.status(500).json({ error: 'Failed to fetch sidebars' });
  }
});

router.get('/sidebars/:id', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.view'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sidebar = await widgetService.getSidebarById(id);

    if (!sidebar) {
      return res.status(404).json({ error: 'Sidebar not found' });
    }

    res.json(sidebar);
  } catch (error) {
    console.error('Error fetching sidebar:', error);
    res.status(500).json({ error: 'Failed to fetch sidebar' });
  }
});

router.post('/sidebars', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.edit'), async (req, res) => {
  try {
    const data: CreateSidebarRequest = req.body;
    const sidebar = await widgetService.createSidebar(data);
    res.status(201).json(sidebar);
  } catch (error) {
    console.error('Error creating sidebar:', error);
    res.status(500).json({ error: 'Failed to create sidebar' });
  }
});

router.put('/sidebars/:id', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateSidebarRequest = req.body;
    const sidebar = await widgetService.updateSidebar(id, data);
    res.json(sidebar);
  } catch (error) {
    console.error('Error updating sidebar:', error);
    res.status(500).json({ error: 'Failed to update sidebar' });
  }
});

router.delete('/sidebars/:id', authMiddleware.authenticate, authMiddleware.requirePermission('widgets.delete'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await widgetService.deleteSidebar(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting sidebar:', error);
    res.status(500).json({ error: 'Failed to delete sidebar' });
  }
});

// Public routes for frontend rendering
router.get('/public/sidebars/:location/widgets', async (req, res) => {
  try {
    const location = req.params.location;
    const widgets = await widgetService.getWidgetsForSidebar(location);
    res.json(widgets);
  } catch (error) {
    console.error('Error fetching public widgets:', error);
    res.status(500).json({ error: 'Failed to fetch widgets' });
  }
});

export default router;
