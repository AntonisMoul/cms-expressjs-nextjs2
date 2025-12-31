import slugify from 'slugify';
import { transliterate as tr } from 'transliteration';
import { SLUG_PREFIXES } from '@cms/shared';
export class SlugService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async update(entityType, entityId, locale, newKey, prefix) {
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
    async checkAvailability(entityType, locale, slug, prefix, excludeId) {
        const where = {
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
    async findBySlug(slug, entityType, prefix) {
        const where = {
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
    async generateSlug(entityType, entityId, locale) {
        // This would typically get the title from the entity
        // For now, return a generic slug
        const timestamp = Date.now();
        return `entity-${entityId}-${timestamp}`;
    }
    async ensureUnique(slug, entityType, locale, prefix, excludeId) {
        const check = await this.checkAvailability(entityType, locale, slug, prefix, excludeId);
        if (check.available) {
            return slug;
        }
        return check.suggestion || `${slug}-${Date.now()}`;
    }
    async generateUniqueSlug(baseSlug, entityType, locale, prefix, excludeId) {
        let counter = 1;
        let suggestion = `${baseSlug}-${counter}`;
        while (!(await this.checkAvailability(entityType, locale, suggestion, prefix, excludeId)).available) {
            counter++;
            suggestion = `${baseSlug}-${counter}`;
        }
        return suggestion;
    }
    static transliterate(text) {
        // First transliterate to Latin characters
        const transliterated = tr(text);
        // Then create URL-safe slug
        return slugify(transliterated, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
        });
    }
    static getPrefix(entityType) {
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
