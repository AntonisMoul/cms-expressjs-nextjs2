import { Router } from 'express';
import { PrismaClient } from '@cms/shared';
import { authRoutes } from './auth';
import { setupAdminRoutes } from './admin';
import { requireAuth } from '../middleware/auth';

export function setupRoutes(db: PrismaClient): Router {
  const router = Router();

  // Public auth routes (no auth required)
  router.use('/auth', authRoutes(db));

  // Admin routes - all routes under /admin require authentication
  // requireAuth is applied at the mount point, so all routes inherit it
  router.use('/admin', requireAuth, setupAdminRoutes(db));

  return router;
}

