import { PrismaClient } from '@cms/shared';

// Transliterate Greek to Latin
function transliterateGreek(text: string): string {
  const greekMap: Record<string, string> = {
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z',
    'η': 'i', 'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm',
    'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's',
    'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z',
    'Η': 'I', 'Θ': 'Th', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M',
    'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S',
    'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O',
  };

  return text
    .split('')
    .map((char) => greekMap[char] || char)
    .join('');
}

function slugify(text: string): string {
  // Transliterate Greek first
  let slug = transliterateGreek(text);

  // Convert to lowercase
  slug = slug.toLowerCase();

  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug || 'page';
}

export interface SlugAvailability {
  available: boolean;
  suggested?: string;
}

export class SlugService {
  constructor(private db: PrismaClient) {}

  async generate(
    text: string,
    model: string,
    options?: {
      prefix?: string;
      locale?: string;
      excludeId?: number;
    }
  ): Promise<string> {
    let slug = slugify(text);

    if (!slug) {
      slug = `item-${Date.now()}`;
    }

    const prefix = options?.prefix || '';
    const locale = options?.locale;

    // Check uniqueness and append number if needed
    let finalSlug = slug;
    let index = 1;

    while (await this.exists(finalSlug, prefix, locale, options?.excludeId)) {
      finalSlug = `${slug}-${index}`;
      index++;
    }

    return finalSlug;
  }

  async checkAvailability(
    slug: string,
    prefix: string = '',
    locale?: string,
    excludeId?: number
  ): Promise<SlugAvailability> {
    const exists = await this.exists(slug, prefix, locale, excludeId);

    if (!exists) {
      return { available: true };
    }

    // Suggest alternative
    let suggested = slug;
    let index = 2;
    while (await this.exists(suggested, prefix, locale, excludeId)) {
      suggested = `${slug}-${index}`;
      index++;
    }

    return {
      available: false,
      suggested,
    };
  }

  private async exists(
    slug: string,
    prefix: string,
    locale?: string,
    excludeId?: number
  ): Promise<boolean> {
    const where: any = {
      key: slug,
      prefix,
      isActive: true,
    };

    if (locale) {
      where.locale = locale;
    } else {
      where.locale = null;
    }

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.db.slug.count({ where });
    return count > 0;
  }

  async create(
    entityType: string,
    entityId: number,
    slug: string,
    prefix: string = '',
    locale?: string
  ) {
    return this.db.slug.create({
      data: {
        key: slug,
        referenceId: entityId,
        referenceType: entityType,
        prefix,
        locale: locale || null,
        isActive: true,
      },
    });
  }

  async update(
    slugId: number,
    newSlug: string,
    prefix?: string,
    locale?: string
  ) {
    // Get old slug for redirect
    const oldSlug = await this.db.slug.findUnique({
      where: { id: slugId },
    });

    // Update slug
    const updated = await this.db.slug.update({
      where: { id: slugId },
      data: {
        key: newSlug,
        ...(prefix !== undefined && { prefix }),
        ...(locale !== undefined && { locale: locale || null }),
      },
    });

    // TODO: Create redirect from old slug to new slug
    // This would be stored in a redirects table

    return updated;
  }

  async resolve(slug: string, prefix?: string, locale?: string) {
    const where: any = {
      key: slug,
      isActive: true,
    };

    if (prefix !== undefined) {
      where.prefix = prefix;
    }

    if (locale) {
      where.locale = locale;
    } else {
      where.locale = null;
    }

    return this.db.slug.findFirst({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getByEntity(entityType: string, entityId: number, locale?: string) {
    const where: any = {
      referenceType: entityType,
      referenceId: entityId,
      isActive: true,
    };

    if (locale) {
      where.locale = locale;
    } else {
      where.locale = null;
    }

    return this.db.slug.findFirst({
      where,
    });
  }
}

