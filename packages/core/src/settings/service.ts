import { PrismaClient } from '@cms/shared';

export class SettingsService {
  constructor(private db: PrismaClient) {}

  async get(key: string): Promise<string | null> {
    const setting = await this.db.setting.findUnique({
      where: { key },
    });
    return setting?.value || null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getMany(keys: string[]): Promise<Record<string, string>> {
    const settings = await this.db.setting.findMany({
      where: {
        key: { in: keys },
      },
    });

    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value || '';
    }
    return result;
  }

  async setMany(data: Record<string, string>): Promise<void> {
    const operations = Object.entries(data).map(([key, value]) =>
      this.db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await Promise.all(operations);
  }

  async delete(key: string): Promise<void> {
    await this.db.setting.delete({
      where: { key },
    });
  }

  async getAll(): Promise<Record<string, string>> {
    const settings = await this.db.setting.findMany();
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value || '';
    }
    return result;
  }
}

