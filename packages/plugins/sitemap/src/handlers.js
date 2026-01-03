"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSitemapJobHandlers = getSitemapJobHandlers;
const core_1 = require("@cms/core");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
function getSitemapJobHandlers(ctx) {
    return [
        {
            name: 'sitemap.generate',
            handler: async (payload) => {
                const db = ctx.db;
                const settings = ctx.settings;
                const slugService = new core_1.SlugService(db);
                // Get sitemap settings
                const enabled = await settings.get('sitemap_enabled');
                if (enabled !== '1') {
                    console.log('Sitemap generation is disabled');
                    return;
                }
                const itemsPerPage = parseInt(await settings.get('sitemap_items_per_page') || '1000');
                // Collect all published content
                const urls = [];
                // Get published pages
                const pages = await db.page.findMany({
                    where: { status: 'published' },
                    orderBy: { updatedAt: 'desc' },
                });
                for (const page of pages) {
                    const slug = await slugService.getByEntity('Page', page.id);
                    if (slug && slug.isActive) {
                        const prefix = slug.prefix || '';
                        urls.push({
                            url: `${prefix ? `/${prefix}` : ''}/${slug.key}`,
                            lastmod: page.updatedAt,
                            priority: '0.8',
                        });
                    }
                }
                // Get published posts
                const posts = await db.post.findMany({
                    where: { status: 'published' },
                    orderBy: { updatedAt: 'desc' },
                });
                for (const post of posts) {
                    const slug = await slugService.getByEntity('Post', post.id);
                    if (slug && slug.isActive) {
                        const prefix = slug.prefix || 'blog';
                        urls.push({
                            url: `/${prefix}/${slug.key}`,
                            lastmod: post.updatedAt,
                            priority: '0.7',
                        });
                    }
                }
                // Get published categories
                const categories = await db.category.findMany({
                    where: { status: 'published' },
                    orderBy: { updatedAt: 'desc' },
                });
                for (const category of categories) {
                    const slug = await slugService.getByEntity('Category', category.id);
                    if (slug && slug.isActive) {
                        const prefix = slug.prefix || 'blog';
                        urls.push({
                            url: `/${prefix}/${slug.key}`,
                            lastmod: category.updatedAt,
                            priority: '0.6',
                        });
                    }
                }
                // Generate XML sitemap
                const baseUrl = process.env.APP_URL || 'http://localhost:3000';
                let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
                for (const item of urls) {
                    const fullUrl = `${baseUrl}${item.url}`;
                    const lastmod = item.lastmod.toISOString().split('T')[0];
                    sitemapXml += `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${item.priority}</priority>
  </url>
`;
                }
                sitemapXml += `</urlset>`;
                // Save sitemap to public directory
                const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
                await fs.writeFile(sitemapPath, sitemapXml, 'utf-8');
                console.log(`Sitemap generated with ${urls.length} URLs`);
            },
            maxAttempts: 3,
            backoff: 60,
        },
    ];
}
//# sourceMappingURL=handlers.js.map