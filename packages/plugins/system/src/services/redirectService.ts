import { PrismaClient } from '@prisma/client';
import {
  Redirect,
  RedirectStatusCode,
  CreateRedirectRequest,
  UpdateRedirectRequest,
  BulkRedirectUpdate
} from '../models/types';

const prisma = new PrismaClient();

export class RedirectService {
  // Redirect CRUD operations
  async getRedirects(): Promise<Redirect[]> {
    return await prisma.redirect.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async getRedirectById(id: number): Promise<Redirect | null> {
    return await prisma.redirect.findUnique({
      where: { id }
    });
  }

  async getRedirectByFromUrl(fromUrl: string): Promise<Redirect | null> {
    return await prisma.redirect.findUnique({
      where: { from_url: fromUrl }
    });
  }

  async createRedirect(data: CreateRedirectRequest): Promise<Redirect> {
    // Validate URLs
    this.validateUrl(data.from_url);
    this.validateUrl(data.to_url);

    return await prisma.redirect.create({
      data: {
        from_url: this.normalizeUrl(data.from_url),
        to_url: this.normalizeUrl(data.to_url),
        status_code: data.status_code || RedirectStatusCode.MOVED_PERMANENTLY,
        is_active: data.is_active !== false
      }
    });
  }

  async updateRedirect(id: number, data: UpdateRedirectRequest): Promise<Redirect> {
    const updateData: any = {};

    if (data.from_url) {
      this.validateUrl(data.from_url);
      updateData.from_url = this.normalizeUrl(data.from_url);
    }

    if (data.to_url) {
      this.validateUrl(data.to_url);
      updateData.to_url = this.normalizeUrl(data.to_url);
    }

    if (data.status_code !== undefined) {
      updateData.status_code = data.status_code;
    }

    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active;
    }

    return await prisma.redirect.update({
      where: { id },
      data: updateData
    });
  }

  async deleteRedirect(id: number): Promise<void> {
    await prisma.redirect.delete({
      where: { id }
    });
  }

  async bulkUpdateRedirects(data: BulkRedirectUpdate): Promise<void> {
    const updates = data.ids.map(id =>
      prisma.redirect.update({
        where: { id },
        data: data.updates
      })
    );

    await prisma.$transaction(updates);
  }

  async bulkDeleteRedirects(ids: number[]): Promise<void> {
    await prisma.redirect.deleteMany({
      where: {
        id: { in: ids }
      }
    });
  }

  // Redirect processing
  async processRedirect(fromUrl: string): Promise<Redirect | null> {
    const redirect = await this.getRedirectByFromUrl(fromUrl);

    if (!redirect || !redirect.is_active) {
      return null;
    }

    // Increment hit counter
    await prisma.redirect.update({
      where: { id: redirect.id },
      data: {
        hits: { increment: 1 },
        last_hit: new Date()
      }
    });

    return redirect;
  }

  // Statistics and analytics
  async getRedirectStats(): Promise<{
    total: number;
    active: number;
    totalHits: number;
    topRedirects: Array<{ from_url: string; to_url: string; hits: number }>;
  }> {
    const [total, active, totalHitsResult, topRedirects] = await Promise.all([
      prisma.redirect.count(),
      prisma.redirect.count({ where: { is_active: true } }),
      prisma.redirect.aggregate({
        _sum: { hits: true }
      }),
      prisma.redirect.findMany({
        select: {
          from_url: true,
          to_url: true,
          hits: true
        },
        orderBy: { hits: 'desc' },
        take: 10
      })
    ]);

    return {
      total,
      active,
      totalHits: totalHitsResult._sum.hits || 0,
      topRedirects
    };
  }

  // Import/Export functionality
  async exportRedirects(): Promise<Redirect[]> {
    return await prisma.redirect.findMany({
      orderBy: { created_at: 'asc' }
    });
  }

  async importRedirects(redirects: CreateRedirectRequest[]): Promise<void> {
    const creates = redirects.map(redirect =>
      prisma.redirect.upsert({
        where: { from_url: redirect.from_url },
        update: {
          to_url: redirect.to_url,
          status_code: redirect.status_code,
          is_active: redirect.is_active
        },
        create: {
          from_url: redirect.from_url,
          to_url: redirect.to_url,
          status_code: redirect.status_code || RedirectStatusCode.MOVED_PERMANENTLY,
          is_active: redirect.is_active !== false
        }
      })
    );

    await prisma.$transaction(creates);
  }

  // Utility methods
  private validateUrl(url: string): void {
    if (!url || typeof url !== 'string') {
      throw new Error('URL is required and must be a string');
    }

    // Basic URL validation
    if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with / or http:// or https://');
    }
  }

  private normalizeUrl(url: string): string {
    // Remove leading/trailing whitespace
    url = url.trim();

    // Ensure leading slash for relative URLs
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      url = '/' + url;
    }

    return url;
  }

  // Check for redirect loops
  async checkForLoops(fromUrl: string, toUrl: string, excludeId?: number): Promise<boolean> {
    let currentUrl = toUrl;
    const visited = new Set<string>();
    const maxDepth = 10;

    for (let i = 0; i < maxDepth; i++) {
      if (visited.has(currentUrl)) {
        return true; // Loop detected
      }

      visited.add(currentUrl);

      const redirect = await prisma.redirect.findFirst({
        where: {
          from_url: currentUrl,
          is_active: true,
          ...(excludeId && { id: { not: excludeId } })
        }
      });

      if (!redirect) {
        break; // No more redirects
      }

      currentUrl = redirect.to_url;
    }

    return false;
  }
}
