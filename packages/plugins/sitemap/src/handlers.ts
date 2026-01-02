import { PluginContext, JobHandler } from '@cms/shared';
import * as fs from 'fs/promises';
import * as path from 'path';

export function getSitemapJobHandlers(ctx: PluginContext): JobHandler[] {
  return [
    {
      name: 'sitemap.generate',
      handler: async (payload: any) => {
        const db = ctx.db as any;
        const settings = ctx.settings as any;

        // Get sitemap settings
        const enabled = await settings.get('sitemap_enabled');
        if (enabled !== '1') {
          console.log('Sitemap generation is disabled');
          return;
        }

        const itemsPerPage = parseInt(await settings.get('sitemap_items_per_page') || '1000');

        // Collect all published content
        const urls: Array<{ url: string; lastmod: Date; priority: string }> = [];

        // Get published pages
        const pages = await db.page.findMany({
          where: { status: 'published' },
          include: { slug: true },
          orderBy: { updatedAt: 'desc' },
        });

        for (const page of pages) {
          if (page.slug && page.slug.isActive) {
            const prefix = page.slug.prefix || '';
            const slug = page.slug.key;
            urls.push({
              url: `${prefix ? `/${prefix}` : ''}/${slug}`,
              lastmod: page.updatedAt,
              priority: '0.8',
            });
          }
        }

        // Get published posts
        const posts = await db.post.findMany({
          where: { status: 'published' },
          include: { slug: true },
          orderBy: { updatedAt: 'desc' },
        });

        for (const post of posts) {
          if (post.slug && post.slug.isActive) {
            const prefix = post.slug.prefix || 'blog';
            const slug = post.slug.key;
            urls.push({
              url: `/${prefix}/${slug}`,
              lastmod: post.updatedAt,
              priority: '0.7',
            });
          }
        }

        // Get published categories
        const categories = await db.category.findMany({
          where: { status: 'published' },
          include: { slug: true },
          orderBy: { updatedAt: 'desc' },
        });

        for (const category of categories) {
          if (category.slug && category.slug.isActive) {
            const prefix = category.slug.prefix || 'blog';
            const slug = category.slug.key;
            urls.push({
              url: `/${prefix}/${slug}`,
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

