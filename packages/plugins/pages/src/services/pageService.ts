import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Page, PageTranslation, PageMeta, PageCreateData, PageUpdateData, PageListOptions, PageListResponse, PageFilters, PageStatus, PAGE_STATUSES } from '../models/types';
import { SlugService } from '@cms/core';

export class PageService {
  constructor(private prisma: PrismaClient) {}

  async create(data: PageCreateData, locale: string = 'en'): Promise<Page> {
    const { meta, ...pageData } = data;

    // Generate translation group ID if not provided
    const translationGroupId = pageData.translationGroupId || randomUUID();

    // Create the page
    const page = await this.prisma.page.create({
      data: {
        ...pageData,
        translationGroupId,
      },
      include: {
        user: true,
        translations: true,
        meta: true,
      },
    });

    // Create translation for the current locale
    if (locale !== 'en') {
      await this.prisma.pageTranslation.create({
        data: {
          langCode: locale,
          pagesId: page.id,
          name: pageData.name,
          description: pageData.description,
          content: pageData.content,
        },
      });
    }

    // Create meta data if provided
    if (meta) {
      await this.createMeta(page.id, meta);
    }

    // Generate slug
    await this.generateSlug(page.id, page.name, locale);

    return page;
  }

  async update(id: number, data: PageUpdateData, locale: string = 'en'): Promise<Page> {
    const { meta, ...pageData } = data;

    // Update the page
    const page = await this.prisma.page.update({
      where: { id },
      data: pageData,
      include: {
        user: true,
        translations: true,
        meta: true,
      },
    });

    // Update or create translation
    await this.prisma.pageTranslation.upsert({
      where: {
        langCode_pagesId: {
          langCode: locale,
          pagesId: id,
        },
      },
      update: {
        name: pageData.name,
        description: pageData.description,
        content: pageData.content,
      },
      create: {
        langCode: locale,
        pagesId: id,
        name: pageData.name,
        description: pageData.description,
        content: pageData.content,
      },
    });

    // Update meta data if provided
    if (meta) {
      await this.updateMeta(id, meta);
    }

    // Update slug if name changed
    if (pageData.name) {
      await this.updateSlug(id, pageData.name, locale);
    }

    return page;
  }

  async delete(id: number): Promise<void> {
    // Delete meta data
    await this.prisma.pageMeta.deleteMany({
      where: { pageId: id },
    });

    // Delete translations
    await this.prisma.pageTranslation.deleteMany({
      where: { pagesId: id },
    });

    // Delete the page
    await this.prisma.page.delete({
      where: { id },
    });
  }

  async findById(id: number, locale?: string): Promise<Page | null> {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        user: true,
        translations: locale ? {
          where: { langCode: locale },
        } : true,
        meta: true,
      },
    });

    if (!page) return null;

    // If we have a translation for the requested locale, merge it
    if (locale && page.translations.length > 0) {
      const translation = page.translations[0];
      return {
        ...page,
        name: translation.name || page.name,
        description: translation.description || page.description,
        content: translation.content || page.content,
      };
    }

    return page;
  }

  async findBySlug(slug: string, locale: string = 'en'): Promise<Page | null> {
    // Find slug record
    const slugRecord = await this.prisma.slug.findFirst({
      where: {
        key: slug,
        referenceType: 'Page',
        prefix: null, // Pages don't use prefix
        isActive: true,
      },
    });

    if (!slugRecord) return null;

    return this.findById(slugRecord.referenceId, locale);
  }

  async list(options: PageListOptions = {}): Promise<PageListResponse> {
    const {
      page = 1,
      perPage = 15,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const where: any = {};

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { content: { contains: filters.search } },
      ];
    }

    if (filters.translationGroupId) {
      where.translationGroupId = filters.translationGroupId;
    }

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        include: {
          user: true,
          translations: true,
          meta: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.page.count({ where }),
    ]);

    return {
      pages,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async publish(id: number): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data: { status: PAGE_STATUSES.PUBLISHED },
      include: {
        user: true,
        translations: true,
        meta: true,
      },
    });
  }

  async unpublish(id: number): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data: { status: PAGE_STATUSES.DRAFT },
      include: {
        user: true,
        translations: true,
        meta: true,
      },
    });
  }

  async createTranslation(sourcePageId: number, targetLocale: string): Promise<PageTranslation> {
    const sourcePage = await this.findById(sourcePageId);

    if (!sourcePage) {
      throw new Error('Source page not found');
    }

    return this.prisma.pageTranslation.create({
      data: {
        langCode: targetLocale,
        pagesId: sourcePageId,
        name: sourcePage.name,
        description: sourcePage.description,
        content: sourcePage.content,
      },
    });
  }

  async getTranslations(pageId: number): Promise<PageTranslation[]> {
    return this.prisma.pageTranslation.findMany({
      where: { pagesId: pageId },
    });
  }

  private async createMeta(pageId: number, meta: Record<string, any>): Promise<void> {
    const metaEntries = Object.entries(meta).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      pageId,
    }));

    await this.prisma.pageMeta.createMany({
      data: metaEntries,
    });
  }

  private async updateMeta(pageId: number, meta: Record<string, any>): Promise<void> {
    // Delete existing meta
    await this.prisma.pageMeta.deleteMany({
      where: { pageId },
    });

    // Create new meta
    await this.createMeta(pageId, meta);
  }

  private async generateSlug(pageId: number, name: string, locale: string): Promise<void> {
    const slug = SlugService.transliterate(name);

    await SlugService.create({
      entityType: 'Page',
      entityId: pageId,
      locale,
      key: slug,
    });
  }

  private async updateSlug(pageId: number, name: string, locale: string): Promise<void> {
    const slug = SlugService.transliterate(name);

    await SlugService.update(
      'Page',
      pageId,
      locale,
      slug
    );
  }
}
