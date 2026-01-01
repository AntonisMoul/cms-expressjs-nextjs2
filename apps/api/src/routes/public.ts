import { Router } from 'express';

const router = Router();

// Public routes that don't require authentication
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

// Placeholder for public content routes
// These will be extended when we implement plugins
router.get('/pages', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Public pages endpoint',
    },
  });
});

router.get('/posts', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Public posts endpoint',
    },
  });
});

// Slug resolution endpoint
router.get('/resolve-slug/:slug(*)', (req, res) => {
  const { slug } = req.params;
  res.json({
    success: true,
    data: {
      message: 'Slug resolution endpoint',
      slug,
    },
  });
});

export { router as publicRoutes };

