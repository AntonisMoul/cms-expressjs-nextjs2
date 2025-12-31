import { PrismaClient } from '@prisma/client';
import { CacheData, BulkCacheClear } from '../models/types';

const prisma = new PrismaClient();

export class CacheService {
  // Cache operations
  async get(key: string): Promise<any | null> {
    const entry = await prisma.cacheEntry.findUnique({
      where: { key }
    });

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expires_at && entry.expires_at < new Date()) {
      await this.delete(key);
      return null;
    }

    try {
      return JSON.parse(entry.value);
    } catch {
      return entry.value;
    }
  }

  async set(key: string, value: any, options?: { tags?: string[]; ttl?: number }): Promise<void> {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    const expiresAt = options?.ttl ? new Date(Date.now() + options.ttl * 1000) : null;

    await prisma.cacheEntry.upsert({
      where: { key },
      update: {
        value: serializedValue,
        tags: options?.tags?.join(','),
        expires_at: expiresAt,
        updated_at: new Date()
      },
      create: {
        key,
        value: serializedValue,
        tags: options?.tags?.join(','),
        expires_at: expiresAt
      }
    });
  }

  async delete(key: string): Promise<void> {
    await prisma.cacheEntry.delete({
      where: { key }
    }).catch(() => {
      // Ignore if key doesn't exist
    });
  }

  async has(key: string): Promise<boolean> {
    const entry = await prisma.cacheEntry.findUnique({
      where: { key },
      select: { id: true, expires_at: true }
    });

    if (!entry) {
      return false;
    }

    // Check if expired
    if (entry.expires_at && entry.expires_at < new Date()) {
      await this.delete(key);
      return false;
    }

    return true;
  }

  async clear(options?: BulkCacheClear): Promise<number> {
    let where: any = {};

    if (options?.tags && options.tags.length > 0) {
      // Clear by tags - find entries that have any of the specified tags
      where.tags = {
        contains: options.tags.join(',')
      };
    }

    if (options?.pattern) {
      // Clear by pattern using SQL LIKE
      where.key = {
        contains: options.pattern
      };
    }

    const result = await prisma.cacheEntry.deleteMany({
      where
    });

    return result.count;
  }

  async clearExpired(): Promise<number> {
    const result = await prisma.cacheEntry.deleteMany({
      where: {
        expires_at: {
          lt: new Date()
        }
      }
    });

    return result.count;
  }

  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    const entries = await prisma.cacheEntry.findMany({
      where: {
        key: { in: keys }
      }
    });

    const result: Record<string, any> = {};

    for (const entry of entries) {
      // Check if expired
      if (entry.expires_at && entry.expires_at < new Date()) {
        await this.delete(entry.key);
        continue;
      }

      try {
        result[entry.key] = JSON.parse(entry.value);
      } catch {
        result[entry.key] = entry.value;
      }
    }

    return result;
  }

  async setMultiple(data: Record<string, CacheData>): Promise<void> {
    const operations = Object.entries(data).map(([key, cacheData]) => {
      const serializedValue = typeof cacheData.value === 'string' ? cacheData.value : JSON.stringify(cacheData.value);
      const expiresAt = cacheData.ttl ? new Date(Date.now() + cacheData.ttl * 1000) : null;

      return prisma.cacheEntry.upsert({
        where: { key },
        update: {
          value: serializedValue,
          tags: cacheData.tags?.join(','),
          expires_at: expiresAt,
          updated_at: new Date()
        },
        create: {
          key,
          value: serializedValue,
          tags: cacheData.tags?.join(','),
          expires_at: expiresAt
        }
      });
    });

    await prisma.$transaction(operations);
  }

  // Cache statistics and management
  async getStats(): Promise<{
    entries: number;
    expired: number;
    totalSize: number;
    tags: string[];
  }> {
    const [totalEntries, expiredEntries, allEntries] = await Promise.all([
      prisma.cacheEntry.count(),
      prisma.cacheEntry.count({
        where: {
          expires_at: {
            lt: new Date()
          }
        }
      }),
      prisma.cacheEntry.findMany({
        select: {
          tags: true,
          value: true
        }
      })
    ]);

    // Calculate approximate size
    let totalSize = 0;
    const tagSet = new Set<string>();

    for (const entry of allEntries) {
      totalSize += entry.value.length;

      if (entry.tags) {
        entry.tags.split(',').forEach(tag => {
          if (tag.trim()) tagSet.add(tag.trim());
        });
      }
    }

    return {
      entries: totalEntries,
      expired: expiredEntries,
      totalSize,
      tags: Array.from(tagSet)
    };
  }

  async getKeysByTag(tag: string): Promise<string[]> {
    const entries = await prisma.cacheEntry.findMany({
      where: {
        tags: {
          contains: tag
        }
      },
      select: {
        key: true
      }
    });

    return entries.map(entry => entry.key);
  }

  async getKeysByPattern(pattern: string): Promise<string[]> {
    const entries = await prisma.cacheEntry.findMany({
      where: {
        key: {
          contains: pattern
        }
      },
      select: {
        key: true
      }
    });

    return entries.map(entry => entry.key);
  }

  // Maintenance operations
  async cleanup(): Promise<{
    expiredRemoved: number;
    totalEntries: number;
  }> {
    const expiredRemoved = await this.clearExpired();
    const totalEntries = await prisma.cacheEntry.count();

    return {
      expiredRemoved,
      totalEntries
    };
  }

  // Cache warming (pre-populate common data)
  async warmCache(warmData: Record<string, CacheData>): Promise<void> {
    await this.setMultiple(warmData);
  }

  // Memory-based cache for performance-critical data
  private memoryCache = new Map<string, { value: any; expiresAt?: number }>();

  async getFromMemory(key: string): Promise<any | null> {
    const cached = this.memoryCache.get(key);

    if (!cached) {
      return null;
    }

    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.value;
  }

  async setInMemory(key: string, value: any, ttl?: number): Promise<void> {
    const expiresAt = ttl ? Date.now() + ttl * 1000 : undefined;
    this.memoryCache.set(key, { value, expiresAt });
  }

  clearMemory(): void {
    this.memoryCache.clear();
  }

  getMemoryStats(): { entries: number; size: number } {
    return {
      entries: this.memoryCache.size,
      size: JSON.stringify([...this.memoryCache.entries()]).length
    };
  }
}
