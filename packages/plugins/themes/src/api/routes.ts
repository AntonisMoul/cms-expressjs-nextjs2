import { Router } from 'express';
import { ThemeService } from '../services/themeService';
import { AuthMiddleware, PrismaClient } from '@cms/core';
import { CreateThemeRequest, UpdateThemeRequest, CreateThemeOptionRequest, UpdateThemeOptionRequest, UpdateThemeSettingRequest } from '../models/types';

const prisma = new PrismaClient();
const authMiddleware = new AuthMiddleware(prisma);
const themeService = new ThemeService();

const router = Router();

// Theme CRUD routes
router.get('/themes', authMiddleware.authenticate, authMiddleware.requirePermission('themes.view'), async (req, res) => {
  try {
    const themes = await themeService.getThemes();
    res.json(themes);
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ error: 'Failed to fetch themes' });
  }
});

router.get('/themes/:id', authMiddleware.authenticate, authMiddleware.requirePermission('themes.view'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const theme = await themeService.getThemeById(id);

    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    res.json(theme);
  } catch (error) {
    console.error('Error fetching theme:', error);
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
});

router.post('/themes', authMiddleware.authenticate, authMiddleware.requirePermission('themes.create'), async (req, res) => {
  try {
    const data: CreateThemeRequest = req.body;
    const theme = await themeService.createTheme(data);
    res.status(201).json(theme);
  } catch (error) {
    console.error('Error creating theme:', error);
    res.status(500).json({ error: 'Failed to create theme' });
  }
});

router.put('/themes/:id', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateThemeRequest = req.body;
    const theme = await themeService.updateTheme(id, data);
    res.json(theme);
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

router.put('/themes/:id/activate', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const theme = await themeService.activateTheme(id);
    res.json(theme);
  } catch (error) {
    console.error('Error activating theme:', error);
    res.status(500).json({ error: 'Failed to activate theme' });
  }
});

router.put('/themes/:id/deactivate', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const theme = await themeService.deactivateTheme(id);
    res.json(theme);
  } catch (error) {
    console.error('Error deactivating theme:', error);
    res.status(500).json({ error: 'Failed to deactivate theme' });
  }
});

router.delete('/themes/:id', authMiddleware.authenticate, authMiddleware.requirePermission('themes.delete'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await themeService.deleteTheme(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting theme:', error);
    res.status(500).json({ error: 'Failed to delete theme' });
  }
});

// Theme Options routes
router.get('/themes/:themeId/options', authMiddleware.authenticate, authMiddleware.requirePermission('themes.view'), async (req, res) => {
  try {
    const themeId = parseInt(req.params.themeId);
    const options = await themeService.getThemeOptions(themeId);
    res.json(options);
  } catch (error) {
    console.error('Error fetching theme options:', error);
    res.status(500).json({ error: 'Failed to fetch theme options' });
  }
});

router.post('/themes/:themeId/options', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const themeId = parseInt(req.params.themeId);
    const data: CreateThemeOptionRequest = { ...req.body, theme_id: themeId };
    const option = await themeService.createThemeOption(data);
    res.status(201).json(option);
  } catch (error) {
    console.error('Error creating theme option:', error);
    res.status(500).json({ error: 'Failed to create theme option' });
  }
});

router.put('/theme-options/:id', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateThemeOptionRequest = req.body;
    const option = await themeService.updateThemeOption(id, data);
    res.json(option);
  } catch (error) {
    console.error('Error updating theme option:', error);
    res.status(500).json({ error: 'Failed to update theme option' });
  }
});

router.delete('/theme-options/:id', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await themeService.deleteThemeOption(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting theme option:', error);
    res.status(500).json({ error: 'Failed to delete theme option' });
  }
});

// Theme Settings routes
router.get('/themes/:themeId/settings', authMiddleware.authenticate, authMiddleware.requirePermission('themes.view'), async (req, res) => {
  try {
    const themeId = parseInt(req.params.themeId);
    const settings = await themeService.getThemeSettings(themeId);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    res.status(500).json({ error: 'Failed to fetch theme settings' });
  }
});

router.put('/themes/:themeId/settings/:optionKey', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const themeId = parseInt(req.params.themeId);
    const optionKey = req.params.optionKey;
    const data: UpdateThemeSettingRequest = req.body;
    const setting = await themeService.updateThemeSetting(themeId, optionKey, data);
    res.json(setting);
  } catch (error) {
    console.error('Error updating theme setting:', error);
    res.status(500).json({ error: 'Failed to update theme setting' });
  }
});

router.put('/themes/:themeId/settings', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const themeId = parseInt(req.params.themeId);
    const settings = req.body;
    await themeService.updateMultipleThemeSettings(themeId, settings);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating theme settings:', error);
    res.status(500).json({ error: 'Failed to update theme settings' });
  }
});

router.delete('/themes/:themeId/settings', authMiddleware.authenticate, authMiddleware.requirePermission('themes.edit'), async (req, res) => {
  try {
    const themeId = parseInt(req.params.themeId);
    await themeService.resetThemeSettings(themeId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error resetting theme settings:', error);
    res.status(500).json({ error: 'Failed to reset theme settings' });
  }
});

// Public routes for frontend
router.get('/public/active-theme', async (req, res) => {
  try {
    const themeInfo = await themeService.getActiveThemeInfo();
    if (!themeInfo) {
      return res.status(404).json({ error: 'No active theme found' });
    }
    res.json(themeInfo);
  } catch (error) {
    console.error('Error fetching active theme:', error);
    res.status(500).json({ error: 'Failed to fetch active theme' });
  }
});

// Theme statistics
router.get('/themes/stats', authMiddleware.authenticate, authMiddleware.requirePermission('themes.view'), async (req, res) => {
  try {
    const stats = await themeService.getThemeStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching theme stats:', error);
    res.status(500).json({ error: 'Failed to fetch theme stats' });
  }
});
