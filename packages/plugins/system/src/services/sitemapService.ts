import { PrismaClient } from '@prisma/client';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import {
  SitemapEntry,
  ChangeFrequency,
  SitemapUrl,
  CreateSitemapEntryRequest,
  UpdateSitemapEntryRequest
} from '../models/types';

const prisma = new PrismaClient();

export class SitemapService {
  // Sitemap entry CRUD operations
  async getSitemapEntries(): Promise<SitemapEntry[]> {
    return await prisma.sitemapEntry.findMany({
      orderBy: { priority: 'desc' }
    });
  }

  async getActiveSitemapEntries(): Promise<SitemapEntry[]> {
    return await prisma.sitemapEntry.findMany({
      where: { is_active: true },
      orderBy: { priority: 'desc' }
    });
  }

  async createSitemapEntry(data: CreateSitemapEntryRequest): Promise<SitemapEntry> {
    return await prisma.sitemapEntry.create({
      data: {
        url: data.url,
        lastmod: data.lastmod,
        changefreq: data.changefreq,
        priority: data.priority || 0.5,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        is_active: data.is_active !== false
      }
    });
  }

  async updateSitemapEntry(id: number, data: UpdateSitemapEntryRequest): Promise<SitemapEntry> {
    const updateData: any = {};

    if (data.url) updateData.url = data.url;
    if (data.lastmod !== undefined) updateData.lastmod = data.lastmod;
    if (data.changefreq) updateData.changefreq = data.changefreq;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.entity_type !== undefined) updateData.entity_type = data.entity_type;
    if (data.entity_id !== undefined) updateData.entity_id = data.entity_id;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    return await prisma.sitemapEntry.update({
      where: { id },
      data: updateData
    });
  }

  async deleteSitemapEntry(id: number): Promise<void> {
    await prisma.sitemapEntry.delete({
      where: { id }
    });
  }

  // Sitemap generation
  async generateSitemap(baseUrl: string): Promise<string> {
    const entries = await this.getActiveSitemapEntries();

    const urls: SitemapUrl[] = entries.map(entry => ({
      url: entry.url,
      lastmod: entry.lastmod?.toISOString(),
      changefreq: entry.changefreq as ChangeFrequency,
      priority: entry.priority
    }));

    // Add homepage if not present
    if (!urls.some(url => url.url === '/')) {
      urls.unshift({
        url: '/',
        changefreq: ChangeFrequency.WEEKLY,
        priority: 1.0
      });
    }

    const stream = new SitemapStream({ hostname: baseUrl });
    const readable = Readable.from(urls);

    return new Promise((resolve, reject) => {
      readable
        .pipe(stream)
        .pipe(streamToPromise)
        .then((data: Buffer) => {
          resolve(data.toString());
        })
        .catch(reject);
    });
  }

  // Auto-populate sitemap from content
  async populateFromContent(baseUrl: string): Promise<void> {
    // Clear existing auto-generated entries
    await prisma.sitemapEntry.deleteMany({
      where: {
        entity_type: { not: null },
        entity_id: { not: null }
      }
    });

    // Add pages
    const pages = await this.getPagesForSitemap();
    for (const page of pages) {
      await this.createSitemapEntry({
        url: page.url,
        lastmod: page.updated_at,
        changefreq: ChangeFrequency.MONTHLY,
        priority: page.is_homepage ? 1.0 : 0.8,
        entity_type: 'page',
        entity_id: page.id
      });
    }

    // Add blog posts
    const posts = await this.getPostsForSitemap();
    for (const post of posts) {
      await this.createSitemapEntry({
        url: post.url,
        lastmod: post.updated_at,
        changefreq: ChangeFrequency.WEEKLY,
        priority: 0.6,
        entity_type: 'post',
        entity_id: post.id
      });
    }

    // Add categories
    const categories = await this.getCategoriesForSitemap();
    for (const category of categories) {
      await this.createSitemapEntry({
        url: category.url,
        lastmod: category.updated_at,
        changefreq: ChangeFrequency.WEEKLY,
        priority: 0.4,
        entity_type: 'category',
        entity_id: category.id
      });
    }
  }

  // Update single entry based on content changes
  async updateEntryFromContent(entityType: string, entityId: number): Promise<void> {
    let url: string;
    let lastmod: Date;
    let changefreq: ChangeFrequency;
    let priority: number;

    switch (entityType) {
      case 'page':
        const pageData = await this.getPageData(entityId);
        if (!pageData) return;
        url = pageData.url;
        lastmod = pageData.updated_at;
        changefreq = ChangeFrequency.MONTHLY;
        priority = pageData.is_homepage ? 1.0 : 0.8;
        break;

      case 'post':
        const postData = await this.getPostData(entityId);
        if (!postData) return;
        url = postData.url;
        lastmod = postData.updated_at;
        changefreq = ChangeFrequency.WEEKLY;
        priority = 0.6;
        break;

      case 'category':
        const categoryData = await this.getCategoryData(entityId);
        if (!categoryData) return;
        url = categoryData.url;
        lastmod = categoryData.updated_at;
        changefreq = ChangeFrequency.WEEKLY;
        priority = 0.4;
        break;

      default:
        return;
    }

    await prisma.sitemapEntry.upsert({
      where: {
        url: url
      },
      update: {
        lastmod,
        changefreq,
        priority,
        updated_at: new Date()
      },
      create: {
        url,
        lastmod,
        changefreq,
        priority,
        entity_type: entityType,
        entity_id: entityId,
        is_active: true
      }
    });
  }

  // Remove entry when content is deleted
  async removeEntryFromContent(entityType: string, entityId: number): Promise<void> {
    await prisma.sitemapEntry.deleteMany({
      where: {
        entity_type: entityType,
        entity_id: entityId
      }
    });
  }

  // Sitemap statistics
  async getSitemapStats(): Promise<{
    total: number;
    active: number;
    byType: Record<string, number>;
    lastModified?: Date;
  }> {
    const [total, active, byTypeResult, lastModified] = await Promise.all([
      prisma.sitemapEntry.count(),
      prisma.sitemapEntry.count({ where: { is_active: true } }),
      prisma.sitemapEntry.groupBy({
        by: ['entity_type'],
        _count: { id: true },
        where: { entity_type: { not: null } }
      }),
      prisma.sitemapEntry.findFirst({
        select: { updated_at: true },
        orderBy: { updated_at: 'desc' }
      })
    ]);

    const byType: Record<string, number> = {};
    byTypeResult.forEach(result => {
      if (result.entity_type) {
        byType[result.entity_type] = result._count.id;
      }
    });

    return {
      total,
      active,
      byType,
      lastModified: lastModified?.updated_at
    };
  }

  // Helper methods for content integration
  private async getPagesForSitemap(): Promise<Array<{ id: number; url: string; updated_at: Date; is_homepage: boolean }>> {
    // This would integrate with the pages plugin
    // For now, return empty array
    return [];
  }

  private async getPostsForSitemap(): Promise<Array<{ id: number; url: string; updated_at: Date }>> {
    // This would integrate with the blog plugin
    // For now, return empty array
    return [];
  }

  private async getCategoriesForSitemap(): Promise<Array<{ id: number; url: string; updated_at: Date }>> {
    // This would integrate with the blog plugin
    // For now, return empty array
    return [];
  }

  private async getPageData(id: number): Promise<{ url: string; updated_at: Date; is_homepage: boolean } | null> {
    // This would integrate with the pages plugin
    return null;
  }

  private async getPostData(id: number): Promise<{ url: string; updated_at: Date } | null> {
    // This would integrate with the blog plugin
    return null;
  }

  private async getCategoryData(id: number): Promise<{ url: string; updated_at: Date } | null> {
    // This would integrate with the blog plugin
    return null;
  }

  // Submit sitemap to search engines (placeholder for future implementation)
  async submitToSearchEngines(sitemapUrl: string): Promise<void> {
    // This would submit the sitemap to Google, Bing, etc.
    // For now, just log it
    console.log(`Sitemap submitted: ${sitemapUrl}`);
  }
}
