import { PrismaClient } from '@prisma/client';
import { Locale, LocaleCreateData, LocaleUpdateData, DEFAULT_LOCALES } from '@cms/shared';

export class LocaleService {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Locale[]> {
    return this.prisma.language.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async getActive(): Promise<Locale[]> {
    return this.prisma.language.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getDefault(): Promise<Locale | null> {
    return this.prisma.language.findFirst({
      where: { isDefault: true },
    });
  }

  async getByCode(code: string): Promise<Locale | null> {
    return this.prisma.language.findUnique({
      where: { code },
    });
  }

  async create(data: LocaleCreateData): Promise<Locale> {
    // If this is the default locale, unset others
    if (data.isDefault) {
      await this.prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.language.create({
      data: {
        code: data.code,
        name: data.name,
        flag: data.flag,
        isDefault: data.isDefault || false,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
        isRtl: data.isRtl || false,
      },
    });
  }

  async update(id: number, data: LocaleUpdateData): Promise<Locale> {
    // If setting as default, unset others
    if (data.isDefault) {
      await this.prisma.language.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    return this.prisma.language.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    // Prevent deletion of default locale
    const locale = await this.prisma.language.findUnique({
      where: { id },
    });

    if (locale?.isDefault) {
      throw new Error('Cannot delete default locale');
    }

    await this.prisma.language.delete({
      where: { id },
    });
  }

  async setDefault(id: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      }),
      this.prisma.language.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);
  }

  async seedDefaultLocales(): Promise<void> {
    for (const locale of DEFAULT_LOCALES) {
      await this.prisma.language.upsert({
        where: { code: locale.code },
        update: locale,
        create: locale,
      });
    }
  }
}
