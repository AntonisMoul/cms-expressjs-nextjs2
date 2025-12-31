import { PrismaClient } from '@prisma/client';
import { Setting } from '@cms/shared';

export class SettingsService {
  constructor(private prisma: PrismaClient) {}

  async get(key: string, defaultValue?: string): Promise<string | null> {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });

    return setting?.value ?? defaultValue ?? null;
  }

  async set(key: string, value: string | null): Promise<Setting> {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async delete(key: string): Promise<void> {
    await this.prisma.setting.delete({
      where: { key },
    }).catch(() => {
      // Ignore if setting doesn't exist
    });
  }

  async getAll(): Promise<Record<string, string>> {
    const settings = await this.prisma.setting.findMany();
    return settings.reduce((acc, setting) => {
      if (setting.value !== null) {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  async getByPrefix(prefix: string): Promise<Record<string, string>> {
    const settings = await this.prisma.setting.findMany({
      where: {
        key: {
          startsWith: prefix,
        },
      },
    });

    return settings.reduce((acc, setting) => {
      if (setting.value !== null) {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  async setMultiple(settings: Record<string, string | null>): Promise<void> {
    const operations = Object.entries(settings).map(([key, value]) =>
      this.prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await this.prisma.$transaction(operations);
  }
}
