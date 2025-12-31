import { Router } from 'express';
import { TranslationService } from '../services/translationService';
import { AuthMiddleware, PrismaClient } from '@cms/core';
import {
  CreateLanguageRequest,
  UpdateLanguageRequest,
  CreateTranslationRequest,
  UpdateTranslationRequest,
  BulkTranslationUpdate,
  CreateTranslationGroupRequest,
  UpdateTranslationGroupRequest,
  CreateTranslationKeyRequest,
  UpdateTranslationKeyRequest,
  TranslationImport
} from '../models/types';

const prisma = new PrismaClient();
const authMiddleware = new AuthMiddleware(prisma);
const translationService = new TranslationService();

const router = Router();

// Language management
router.get('/languages', authMiddleware.authenticate, authMiddleware.requirePermission('translations.view'), async (req, res) => {
  try {
    const languages = await translationService.getLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

router.get('/languages/active', async (req, res) => {
  try {
    const languages = await translationService.getActiveLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Error fetching active languages:', error);
    res.status(500).json({ error: 'Failed to fetch active languages' });
  }
});

router.post('/languages', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const data: CreateLanguageRequest = req.body;
    const language = await translationService.createLanguage(data);
    res.status(201).json(language);
  } catch (error) {
    console.error('Error creating language:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create language' });
  }
});

router.put('/languages/:id', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateLanguageRequest = req.body;
    const language = await translationService.updateLanguage(id, data);
    res.json(language);
  } catch (error) {
    console.error('Error updating language:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update language' });
  }
});

router.delete('/languages/:id', authMiddleware.authenticate, authMiddleware.requirePermission('translations.delete'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await translationService.deleteLanguage(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting language:', error);
    res.status(500).json({ error: 'Failed to delete language' });
  }
});

// Translation management
router.get('/translations', authMiddleware.authenticate, authMiddleware.requirePermission('translations.view'), async (req, res) => {
  try {
    const languageId = req.query.language_id ? parseInt(req.query.language_id as string) : undefined;
    const translations = await translationService.getTranslations(languageId);
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

router.post('/translations', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const data: CreateTranslationRequest = req.body;
    const translation = await translationService.createTranslation(data);
    res.status(201).json(translation);
  } catch (error) {
    console.error('Error creating translation:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create translation' });
  }
});

router.put('/translations/:languageId/:key', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const languageId = parseInt(req.params.languageId);
    const key = req.params.key;
    const data: UpdateTranslationRequest = req.body;
    const translation = await translationService.updateTranslation(languageId, key, data);
    res.json(translation);
  } catch (error) {
    console.error('Error updating translation:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update translation' });
  }
});

router.delete('/translations/:languageId/:key', authMiddleware.authenticate, authMiddleware.requirePermission('translations.delete'), async (req, res) => {
  try {
    const languageId = parseInt(req.params.languageId);
    const key = req.params.key;
    await translationService.deleteTranslation(languageId, key);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting translation:', error);
    res.status(500).json({ error: 'Failed to delete translation' });
  }
});

router.post('/translations/bulk', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const data: BulkTranslationUpdate = req.body;
    await translationService.bulkUpdateTranslations(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error bulk updating translations:', error);
    res.status(500).json({ error: 'Failed to bulk update translations' });
  }
});

// Translation keys
router.get('/keys', authMiddleware.authenticate, authMiddleware.requirePermission('translations.view'), async (req, res) => {
  try {
    const keys = await translationService.getTranslationKeys();
    res.json(keys);
  } catch (error) {
    console.error('Error fetching translation keys:', error);
    res.status(500).json({ error: 'Failed to fetch translation keys' });
  }
});

router.post('/keys', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const data: CreateTranslationKeyRequest = req.body;
    const key = await translationService.createTranslationKey(data);
    res.status(201).json(key);
  } catch (error) {
    console.error('Error creating translation key:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create translation key' });
  }
});

router.put('/keys/:id', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateTranslationKeyRequest = req.body;
    const key = await translationService.updateTranslationKey(id, data);
    res.json(key);
  } catch (error) {
    console.error('Error updating translation key:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update translation key' });
  }
});

router.delete('/keys/:id', authMiddleware.authenticate, authMiddleware.requirePermission('translations.delete'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await translationService.deleteTranslationKey(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting translation key:', error);
    res.status(500).json({ error: 'Failed to delete translation key' });
  }
});

// Translation groups
router.get('/groups', authMiddleware.authenticate, authMiddleware.requirePermission('translations.view'), async (req, res) => {
  try {
    const groups = await translationService.getTranslationGroups();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching translation groups:', error);
    res.status(500).json({ error: 'Failed to fetch translation groups' });
  }
});

router.post('/groups', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const data: CreateTranslationGroupRequest = req.body;
    const group = await translationService.createTranslationGroup(data);
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating translation group:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create translation group' });
  }
});

// Statistics
router.get('/stats', authMiddleware.authenticate, authMiddleware.requirePermission('translations.view'), async (req, res) => {
  try {
    const stats = await translationService.getTranslationStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching translation stats:', error);
    res.status(500).json({ error: 'Failed to fetch translation statistics' });
  }
});

// Import/Export
router.get('/export', authMiddleware.authenticate, authMiddleware.requirePermission('translations.view'), async (req, res) => {
  try {
    const data = await translationService.exportTranslations();
    res.json(data);
  } catch (error) {
    console.error('Error exporting translations:', error);
    res.status(500).json({ error: 'Failed to export translations' });
  }
});

router.post('/import', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const data: TranslationImport = req.body;
    await translationService.importTranslations(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error importing translations:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to import translations' });
  }
});

// File-based import/export
router.get('/export/:languageCode', authMiddleware.authenticate, authMiddleware.requirePermission('translations.view'), async (req, res) => {
  try {
    const { languageCode } = req.params;
    const translations = await translationService.exportToFile(languageCode);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${languageCode}.json"`);
    res.json(translations);
  } catch (error) {
    console.error('Error exporting language file:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to export language file' });
  }
});

router.post('/import/:languageCode', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const { languageCode } = req.params;
    const translations = req.body;
    await translationService.importFromFile(languageCode, translations);
    res.json({ success: true });
  } catch (error) {
    console.error('Error importing language file:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to import language file' });
  }
});

// Populate missing translations
router.post('/populate/:languageId', authMiddleware.authenticate, authMiddleware.requirePermission('translations.edit'), async (req, res) => {
  try {
    const languageId = parseInt(req.params.languageId);
    await translationService.populateMissingTranslations(languageId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error populating translations:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to populate translations' });
  }
});

// Public translation endpoint for frontend
router.get('/public/:languageCode', async (req, res) => {
  try {
    const { languageCode } = req.params;
    const context = await translationService.getTranslationContext(languageCode);

    if (!context) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.json(context);
  } catch (error) {
    console.error('Error fetching public translations:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});
