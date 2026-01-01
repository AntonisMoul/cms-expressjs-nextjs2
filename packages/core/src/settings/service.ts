import { PrismaClient } from '@prisma/client';
import { Setting, SettingGroup } from '../types';

export class SettingsService {
  private cache: Map<string, string> = new Map();

  constructor(private prisma: PrismaClient) {}

  async get(key: string, defaultValue?: string): Promise<string | undefined> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });

    const value = setting?.value || defaultValue;

    // Cache the value
    if (value !== undefined) {
      this.cache.set(key, value);
    }

    return value;
  }

  async set(key: string, value: string): Promise<void> {
    await this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // Update cache
    this.cache.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.prisma.setting.delete({
      where: { key },
    });

    // Remove from cache
    this.cache.delete(key);
  }

  async getAll(): Promise<Setting[]> {
    const settings = await this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });

    return settings.map(setting => ({
      id: setting.id,
      key: setting.key,
      value: setting.value,
    }));
  }

  async getGroup(prefix: string): Promise<SettingGroup[]> {
    const settings = await this.prisma.setting.findMany({
      where: {
        key: {
          startsWith: prefix,
        },
      },
      orderBy: { key: 'asc' },
    });

    return settings.map(setting => ({
      key: setting.key,
      value: setting.value,
    }));
  }

  async setGroup(settings: Record<string, string>): Promise<void> {
    const operations = Object.entries(settings).map(([key, value]) =>
      this.prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await this.prisma.$transaction(operations);

    // Update cache
    Object.entries(settings).forEach(([key, value]) => {
      this.cache.set(key, value);
    });
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
  }

  // Helper methods for common settings
  async getSiteName(): Promise<string> {
    return this.get('site_name', 'My CMS') as Promise<string>;
  }

  async getSiteDescription(): Promise<string> {
    return this.get('site_description', '') as Promise<string>;
  }

  async getSiteUrl(): Promise<string> {
    return this.get('site_url', 'http://localhost:3000') as Promise<string>;
  }

  async isMaintenanceMode(): Promise<boolean> {
    const value = await this.get('maintenance_mode', 'false');
    return value === 'true';
  }

  async getTimezone(): Promise<string> {
    return this.get('timezone', 'UTC') as Promise<string>;
  }

  async getDateFormat(): Promise<string> {
    return this.get('date_format', 'Y-m-d') as Promise<string>;
  }

  async getTimeFormat(): Promise<string> {
    return this.get('time_format', 'H:i:s') as Promise<string>;
  }

  async getDefaultLocale(): Promise<string> {
    return this.get('default_locale', 'en') as Promise<string>;
  }
}

