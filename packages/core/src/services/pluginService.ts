import { Plugin, PluginContext } from '@cms/shared';
import { PrismaClient } from '@prisma/client';
import { AuthMiddleware } from '../middleware/auth';

export class PluginService {
  private plugins: Plugin[] = [];
  private prisma: PrismaClient;
  private authMiddleware: AuthMiddleware;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.authMiddleware = new AuthMiddleware(prisma);
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    // Add to plugins list
    this.plugins.push(plugin);

    const context: PluginContext = {
      prisma: this.prisma,
      config: {
        get: (key: string, defaultValue?: any) => {
          // Simple config implementation - in production this would be more sophisticated
          return process.env[key] || defaultValue;
        },
        set: (key: string, value: any) => {
          // Simple config implementation
          process.env[key] = value;
        },
      },
      logger: {
        info: (message: string, meta?: any) => console.log(`[${plugin.name}] ${message}`, meta),
        error: (message: string, error?: Error, meta?: any) => console.error(`[${plugin.name}] ${message}`, error, meta),
        warn: (message: string, meta?: any) => console.warn(`[${plugin.name}] ${message}`, meta),
        debug: (message: string, meta?: any) => console.debug(`[${plugin.name}] ${message}`, meta),
      },
      cache: {
        get: async <T>(key: string): Promise<T | null> => {
          // Simple in-memory cache - in production this would use Redis
          return null;
        },
        set: async (key: string, value: any, ttl?: number): Promise<void> => {
          // Simple in-memory cache implementation
        },
        del: async (key: string): Promise<void> => {
          // Simple in-memory cache implementation
        },
        clear: async (): Promise<void> => {
          // Simple in-memory cache implementation
        },
      },
    };

    // Register API routes if provided
    if (plugin.registerApiRoutes) {
      // Note: API routes will be registered when the Express app is set up
    }

    // Initialize plugin if init method exists
    if (plugin.init) {
      await plugin.init(context);
    }
  }

  getPlugins(): Plugin[] {
    return this.plugins;
  }

  getPermissions(): string[] {
    return this.plugins.flatMap(plugin => plugin.permissions?.map(p => p.key) || []);
  }

  getNavigationItems(): any[] {
    return this.plugins.flatMap(plugin => plugin.adminNavigation || []);
  }

  getSettingsPanels(): any[] {
    return this.plugins.flatMap(plugin => plugin.settingsPanels || []);
  }

  // Method to register API routes with Express router
  registerApiRoutes(router: any): void {
    this.plugins.forEach(plugin => {
      if (plugin.registerApiRoutes) {
        const context: PluginContext = {
          prisma: this.prisma,
          config: {
            get: (key: string, defaultValue?: any) => process.env[key] || defaultValue,
            set: (key: string, value: any) => { process.env[key] = value; },
          },
          logger: {
            info: (message: string, meta?: any) => console.log(`[${plugin.name}] ${message}`, meta),
            error: (message: string, error?: Error, meta?: any) => console.error(`[${plugin.name}] ${message}`, error, meta),
            warn: (message: string, meta?: any) => console.warn(`[${plugin.name}] ${message}`, meta),
            debug: (message: string, meta?: any) => console.debug(`[${plugin.name}] ${message}`, meta),
          },
          cache: {
            get: async <T>(key: string): Promise<T | null> => null,
            set: async (key: string, value: any, ttl?: number): Promise<void> => {},
            del: async (key: string): Promise<void> => {},
            clear: async (): Promise<void> => {},
          },
        };

        plugin.registerApiRoutes(router, context);
      }
    });
  }
}
