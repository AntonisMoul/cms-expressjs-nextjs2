import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { PrismaClient, PluginService } from '@cms/core';
import { plugin as pagesPlugin } from '@cms/plugins-pages';
import { plugin as blogPlugin } from '@cms/plugins-blog';
import { plugin as mediaPlugin } from '@cms/plugins-media';
import { menuPlugin } from '@cms/menu';
import { widgetsPlugin } from '@cms/widgets';
import { themesPlugin } from '@cms/themes';
import { systemPlugin } from '@cms/system';
import { translationsPlugin } from '@cms/translations';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import settingsRoutes from './routes/settings';
import localesRoutes from './routes/locales';
import slugsRoutes from './routes/slugs';

// Initialize Prisma and Plugin Service
const prisma = new PrismaClient();
const pluginService = new PluginService(prisma);

// Register plugins
async function registerPlugins() {
  await pluginService.registerPlugin(pagesPlugin);
  await pluginService.registerPlugin(blogPlugin);
  await pluginService.registerPlugin(mediaPlugin);
  await pluginService.registerPlugin(menuPlugin);
  await pluginService.registerPlugin(widgetsPlugin);
  await pluginService.registerPlugin(themesPlugin);
  await pluginService.registerPlugin(systemPlugin);
  await pluginService.registerPlugin(translationsPlugin);
}

registerPlugins();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/system/locales', localesRoutes);
app.use('/api/v1/admin/slugs', slugsRoutes);

// Plugin routes
pluginService.registerApiRoutes(app);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
    });
  }

  // Generic error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
