import { PrismaClient } from '@prisma/client';
import { Slug, CreateSlugRequest, SlugCheckRequest, SlugCheckResponse } from '../types';

export class SlugService {
  constructor(private prisma: PrismaClient) {}

  private transliterate(text: string): string {
    // Basic transliteration for Greek and common special characters
    const transliterations: Record<string, string> = {
      'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
      'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
      'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
      'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
      'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'Th',
      'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
      'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O',
      'Ά': 'A', 'Έ': 'E', 'Ή': 'I', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ώ': 'O',
      'ς': 's', // Greek final sigma
      'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss', // German
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', // Turkish
      'ñ': 'n', // Spanish
      'ø': 'o', 'å': 'a', // Norwegian/Danish
    };

    return text
      .split('')
      .map(char => transliterations[char] || char)
      .join('');
  }

  private generateSlug(text: string): string {
    return this.transliterate(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  async createSlug(data: CreateSlugRequest): Promise<Slug> {
    const fullPath = data.prefix ? `${data.prefix}/${data.key}` : data.key;

    const slug = await this.prisma.slug.create({
      data: {
        key: data.key,
        entityId: data.entityId,
        entityType: data.entityType,
        prefix: data.prefix,
        fullPath,
        locale: data.locale || 'en',
      },
    });

    return {
      id: slug.id,
      key: slug.key,
      entityId: slug.entityId,
      entityType: slug.entityType,
      prefix: slug.prefix,
      fullPath: slug.fullPath,
      locale: slug.locale,
      isActive: slug.isActive,
      createdAt: slug.createdAt,
      updatedAt: slug.updatedAt,
    };
  }

  async updateSlug(id: string, data: Partial<CreateSlugRequest>): Promise<Slug> {
    const updateData: any = {};

    if (data.key) {
      updateData.key = data.key;
      updateData.fullPath = data.prefix ? `${data.prefix}/${data.key}` : data.key;
    }

    if (data.prefix !== undefined) {
      updateData.prefix = data.prefix;
      updateData.fullPath = data.prefix ? `${data.prefix}/${updateData.key || data.key}` : (updateData.key || data.key);
    }

    if (data.locale) updateData.locale = data.locale;

    const slug = await this.prisma.slug.update({
      where: { id },
      data: updateData,
    });

    return {
      id: slug.id,
      key: slug.key,
      entityId: slug.entityId,
      entityType: slug.entityType,
      prefix: slug.prefix,
      fullPath: slug.fullPath,
      locale: slug.locale,
      isActive: slug.isActive,
      createdAt: slug.createdAt,
      updatedAt: slug.updatedAt,
    };
  }

  async deleteSlug(id: string): Promise<void> {
    await this.prisma.slug.delete({
      where: { id },
    });
  }

  async getSlugById(id: string): Promise<Slug | null> {
    const slug = await this.prisma.slug.findUnique({
      where: { id },
    });

    if (!slug) return null;

    return {
      id: slug.id,
      key: slug.key,
      entityId: slug.entityId,
      entityType: slug.entityType,
      prefix: slug.prefix,
      fullPath: slug.fullPath,
      locale: slug.locale,
      isActive: slug.isActive,
      createdAt: slug.createdAt,
      updatedAt: slug.updatedAt,
    };
  }

  async getSlugByEntity(entityType: string, entityId: string, locale = 'en'): Promise<Slug | null> {
    const slug = await this.prisma.slug.findFirst({
      where: {
        entityType,
        entityId,
        locale,
        isActive: true,
      },
    });

    if (!slug) return null;

    return {
      id: slug.id,
      key: slug.key,
      entityId: slug.entityId,
      entityType: slug.entityType,
      prefix: slug.prefix,
      fullPath: slug.fullPath,
      locale: slug.locale,
      isActive: slug.isActive,
      createdAt: slug.createdAt,
      updatedAt: slug.updatedAt,
    };
  }

  async resolveSlug(fullSlug: string, locale = 'en'): Promise<Slug | null> {
    const slug = await this.prisma.slug.findFirst({
      where: {
        fullPath: fullSlug,
        locale,
        isActive: true,
      },
    });

    if (!slug) return null;

    return {
      id: slug.id,
      key: slug.key,
      entityId: slug.entityId,
      entityType: slug.entityType,
      prefix: slug.prefix,
      fullPath: slug.fullPath,
      locale: slug.locale,
      isActive: slug.isActive,
      createdAt: slug.createdAt,
      updatedAt: slug.updatedAt,
    };
  }

  async checkSlugAvailability(request: SlugCheckRequest): Promise<SlugCheckResponse> {
    const { entityType, locale = 'en', slug, excludeId } = request;

    const where: any = {
      key: slug,
      locale,
      isActive: true,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingSlug = await this.prisma.slug.findFirst({
      where,
    });

    const available = !existingSlug;

    let suggestion: string | undefined;
    if (!available) {
      // Generate suggestion by appending number
      let counter = 1;
      let suggestedSlug = `${slug}-${counter}`;

      while (await this.prisma.slug.findFirst({
        where: {
          key: suggestedSlug,
          locale,
          isActive: true,
          ...(excludeId && { id: { not: excludeId } }),
        },
      })) {
        counter++;
        suggestedSlug = `${slug}-${counter}`;
      }

      suggestion = suggestedSlug;
    }

    return {
      available,
      suggestion,
    };
  }

  async generateUniqueSlug(title: string, entityType: string, locale = 'en', excludeId?: string): Promise<string> {
    let baseSlug = this.generateSlug(title);
    let finalSlug = baseSlug;

    if (!baseSlug) {
      baseSlug = 'untitled';
      finalSlug = baseSlug;
    }

    // Check if base slug is available
    const checkResult = await this.checkSlugAvailability({
      entityType,
      locale,
      slug: baseSlug,
      excludeId,
    });

    if (checkResult.available) {
      return baseSlug;
    }

    // Use suggestion if available
    if (checkResult.suggestion) {
      return checkResult.suggestion;
    }

    // Fallback: keep trying with incrementing numbers
    let counter = 1;
    while (true) {
      finalSlug = `${baseSlug}-${counter}`;
      const result = await this.checkSlugAvailability({
        entityType,
        locale,
        slug: finalSlug,
        excludeId,
      });

      if (result.available) {
        break;
      }
      counter++;
    }

    return finalSlug;
  }

  async createSlugForEntity(
    entityType: string,
    entityId: string,
    title: string,
    prefix?: string,
    locale = 'en'
  ): Promise<Slug> {
    const key = await this.generateUniqueSlug(title, entityType, locale);

    return this.createSlug({
      entityType,
      entityId,
      key,
      prefix,
      locale,
    });
  }

  async updateSlugForEntity(
    entityType: string,
    entityId: string,
    title: string,
    prefix?: string,
    locale = 'en'
  ): Promise<Slug> {
    const existingSlug = await this.getSlugByEntity(entityType, entityId, locale);

    if (!existingSlug) {
      return this.createSlugForEntity(entityType, entityId, title, prefix, locale);
    }

    const newKey = await this.generateUniqueSlug(title, entityType, locale, existingSlug.id);

    return this.updateSlug(existingSlug.id, {
      key: newKey,
      prefix,
      locale,
    });
  }

  async deactivateSlug(id: string): Promise<void> {
    await this.prisma.slug.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getSlugsByEntityType(entityType: string, locale = 'en'): Promise<Slug[]> {
    const slugs = await this.prisma.slug.findMany({
      where: {
        entityType,
        locale,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return slugs.map(slug => ({
      id: slug.id,
      key: slug.key,
      entityId: slug.entityId,
      entityType: slug.entityType,
      prefix: slug.prefix,
      fullPath: slug.fullPath,
      locale: slug.locale,
      isActive: slug.isActive,
      createdAt: slug.createdAt,
      updatedAt: slug.updatedAt,
    }));
  }
}

