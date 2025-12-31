"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const core_1 = require("@cms/core");
// Dynamic imports for plugins - these will be loaded in the async function
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const settings_1 = __importDefault(require("./routes/settings"));
const locales_1 = __importDefault(require("./routes/locales"));
const slugs_1 = __importDefault(require("./routes/slugs"));
// Initialize Prisma and Plugin Service
const prisma = new core_1.PrismaClient();
const pluginService = new core_1.PluginService(prisma);
// Register plugins
async function registerPlugins() {
    // Dynamic imports for plugins
    const pagesPlugin = (await import('../../packages/plugins/pages/src/index.ts')).plugin;
    const blogPlugin = (await import('../../packages/plugins/blog/src/index.ts')).plugin;
    const mediaPlugin = (await import('../../packages/plugins/media/src/index.ts')).plugin;
    const menuPlugin = (await import('../../packages/plugins/menu/src/index.ts')).menuPlugin;
    const widgetsPlugin = (await import('../../packages/plugins/widgets/src/index.ts')).widgetsPlugin;
    const themesPlugin = (await import('../../packages/plugins/themes/src/index.ts')).themesPlugin;
    const systemPlugin = (await import('../../packages/plugins/system/src/index.ts')).systemPlugin;
    const translationsPlugin = (await import('../../packages/plugins/translations/src/index.ts')).translationsPlugin;
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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Compression
app.use((0, compression_1.default)());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/settings', settings_1.default);
app.use('/api/v1/system/locales', locales_1.default);
app.use('/api/v1/admin/slugs', slugs_1.default);
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
app.use((err, req, res, next) => {
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
