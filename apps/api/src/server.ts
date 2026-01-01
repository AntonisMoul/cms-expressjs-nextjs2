import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import { publicRoutes } from './routes/public';
import { pagesPlugin } from '@cms/pages';
import { blogPlugin } from '@cms/blog';
import { mediaPlugin } from '@cms/media';
import { menuPlugin } from '@cms/menu';
import { widgetPlugin } from '@cms/widget';
import { menuPlugin } from '@cms/menu';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/public', publicRoutes);

// Register plugin routes
const pluginRouter = express.Router();
if (pagesPlugin.registerApiRoutes) {
  pagesPlugin.registerApiRoutes(pluginRouter, { prisma });
}
if (blogPlugin.registerApiRoutes) {
  blogPlugin.registerApiRoutes(pluginRouter, { prisma });
}
if (mediaPlugin.registerApiRoutes) {
  mediaPlugin.registerApiRoutes(pluginRouter, { prisma });
}
if (menuPlugin.registerApiRoutes) {
  menuPlugin.registerApiRoutes(pluginRouter, { prisma });
}
if (widgetPlugin.registerApiRoutes) {
  widgetPlugin.registerApiRoutes(pluginRouter, { prisma });
}
app.use('/api/v1', pluginRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.errors,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
  });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
