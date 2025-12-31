import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { transliterate as tr } from 'transliteration';
import { SlugCreateData, SlugCheckResponse, SLUG_PREFIXES } from '@cms/shared';

export class SlugService {
  constructor(private prisma: PrismaClient) {}

  async create(data: SlugCreateData): Promise<string> {
    const { entityType, entityId, locale, key, prefix } = data;

    // Generate slug if not provided
    let finalKey = key;
    if (!finalKey) {
      finalKey = await this.generateSlug(entityType, entityId, locale);
    }

    // Ensure uniqueness
    const uniqueKey = await this.ensureUnique(finalKey, entityType, locale, prefix, entityId);

    // Create slug record
    await this.prisma.slug.create({
      data: {
        key: uniqueKey,
        referenceId: entityId,
        referenceType: entityType,
        prefix: prefix || null,
      },
    });

    return uniqueKey;
  }

  async update(
    entityType: string,
    entityId: number,
    locale: string,
    newKey: string,
    prefix?: string
  ): Promise<string> {
    // Check if slug exists
    const existingSlug = await this.prisma.slug.findFirst({
      where: {
        referenceId: entityId,
        referenceType: entityType,
        prefix: prefix || null,
      },
    });

    if (!existingSlug) {
      return this.create({ entityType, entityId, locale, key: newKey, prefix });
    }

    // Ensure uniqueness
    const uniqueKey = await this.ensureUnique(newKey, entityType, locale, prefix, entityId);

    // Update slug
    await this.prisma.slug.update({
      where: { id: existingSlug.id },
      data: { key: uniqueKey },
    });

    return uniqueKey;
  }

  async checkAvailability(
    entityType: string,
    locale: string,
    slug: string,
    prefix?: string,
    excludeId?: number
  ): Promise<SlugCheckResponse> {
    const where: any = {
      key: slug,
      referenceType: entityType,
      prefix: prefix || null,
    };

    if (excludeId) {
      where.referenceId = { not: excludeId };
    }

    const existing = await this.prisma.slug.findFirst({ where });

    if (!existing) {
      return { available: true };
    }

    // Generate suggestion
    const suggestion = await this.generateUniqueSlug(slug, entityType, locale, prefix, excludeId);

    return {
      available: false,
      suggestion,
      message: 'Slug is already in use',
    };
  }

  async findBySlug(slug: string, entityType?: string, prefix?: string): Promise<any | null> {
    const where: any = {
      key: slug,
      isActive: true,
    };

    if (entityType) {
      where.referenceType = entityType;
    }

    if (prefix !== undefined) {
      where.prefix = prefix;
    }

    const slugRecord = await this.prisma.slug.findFirst({ where });
    return slugRecord;
  }

  private async generateSlug(entityType: string, entityId: number, locale: string): Promise<string> {
    // This would typically get the title from the entity
    // For now, return a generic slug
    const timestamp = Date.now();
    return `entity-${entityId}-${timestamp}`;
  }

  private async ensureUnique(
    slug: string,
    entityType: string,
    locale: string,
    prefix?: string,
    excludeId?: number
  ): Promise<string> {
    const check = await this.checkAvailability(entityType, locale, slug, prefix, excludeId);

    if (check.available) {
      return slug;
    }

    return check.suggestion || `${slug}-${Date.now()}`;
  }

  private async generateUniqueSlug(
    baseSlug: string,
    entityType: string,
    locale: string,
    prefix?: string,
    excludeId?: number
  ): Promise<string> {
    let counter = 1;
    let suggestion = `${baseSlug}-${counter}`;

    while (!(await this.checkAvailability(entityType, locale, suggestion, prefix, excludeId)).available) {
      counter++;
      suggestion = `${baseSlug}-${counter}`;
    }

    return suggestion;
  }

  static transliterate(text: string): string {
    // First transliterate to Latin characters
    const transliterated = tr(text);

    // Then create URL-safe slug
    return slugify(transliterated, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }

  static getPrefix(entityType: string): string | null {
    switch (entityType) {
      case 'Post':
        return SLUG_PREFIXES.POSTS;
      case 'Category':
        return SLUG_PREFIXES.CATEGORIES;
      case 'Tag':
        return SLUG_PREFIXES.TAGS;
      case 'Page':
        return SLUG_PREFIXES.PAGES;
      default:
        return null;
    }
  }
}
