import { Router } from 'express';
import { PluginContext } from '@cms/shared';
import { registerPostRoutes } from './posts';
import { registerCategoryRoutes } from './categories';
import { registerTagRoutes } from './tags';

export function registerBlogRoutes(
  router: Router,
  ctx: PluginContext,
  requireAuth: any,
  requirePermission: any
): void {
  registerPostRoutes(router, ctx, requireAuth, requirePermission);
  registerCategoryRoutes(router, ctx, requireAuth, requirePermission);
  registerTagRoutes(router, ctx, requireAuth, requirePermission);
}

