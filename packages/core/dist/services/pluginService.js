import { AuthMiddleware } from '../middleware/auth';
export class PluginService {
    plugins = [];
    prisma;
    authMiddleware;
    constructor(prisma) {
        this.prisma = prisma;
        this.authMiddleware = new AuthMiddleware(prisma);
    }
    async registerPlugin(plugin) {
        // Add to plugins list
        this.plugins.push(plugin);
        const context = {
            prisma: this.prisma,
            config: {
                get: (key, defaultValue) => {
                    // Simple config implementation - in production this would be more sophisticated
                    return process.env[key] || defaultValue;
                },
                set: (key, value) => {
                    // Simple config implementation
                    process.env[key] = value;
                },
            },
            logger: {
                info: (message, meta) => console.log(`[${plugin.name}] ${message}`, meta),
                error: (message, error, meta) => console.error(`[${plugin.name}] ${message}`, error, meta),
                warn: (message, meta) => console.warn(`[${plugin.name}] ${message}`, meta),
                debug: (message, meta) => console.debug(`[${plugin.name}] ${message}`, meta),
            },
            cache: {
                get: async (key) => {
                    // Simple in-memory cache - in production this would use Redis
                    return null;
                },
                set: async (key, value, ttl) => {
                    // Simple in-memory cache implementation
                },
                del: async (key) => {
                    // Simple in-memory cache implementation
                },
                clear: async () => {
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
    getPlugins() {
        return this.plugins;
    }
    getPermissions() {
        return this.plugins.flatMap(plugin => plugin.permissions?.map(p => p.key) || []);
    }
    getNavigationItems() {
        return this.plugins.flatMap(plugin => plugin.adminNavigation || []);
    }
    getSettingsPanels() {
        return this.plugins.flatMap(plugin => plugin.settingsPanels || []);
    }
    // Method to register API routes with Express router
    registerApiRoutes(router) {
        this.plugins.forEach(plugin => {
            if (plugin.registerApiRoutes) {
                const context = {
                    prisma: this.prisma,
                    config: {
                        get: (key, defaultValue) => process.env[key] || defaultValue,
                        set: (key, value) => { process.env[key] = value; },
                    },
                    logger: {
                        info: (message, meta) => console.log(`[${plugin.name}] ${message}`, meta),
                        error: (message, error, meta) => console.error(`[${plugin.name}] ${message}`, error, meta),
                        warn: (message, meta) => console.warn(`[${plugin.name}] ${message}`, meta),
                        debug: (message, meta) => console.debug(`[${plugin.name}] ${message}`, meta),
                    },
                    cache: {
                        get: async (key) => null,
                        set: async (key, value, ttl) => { },
                        del: async (key) => { },
                        clear: async () => { },
                    },
                };
                plugin.registerApiRoutes(router, context);
            }
        });
    }
}
