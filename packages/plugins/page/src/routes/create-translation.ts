import { PrismaClient } from '@cms/shared';
import { SlugService, QueueService, AuditService } from '@cms/core';
import { generateUuid } from '@cms/shared/utils';
import { z } from 'zod';

const createTranslationSchema = z.object({
  sourcePageId: z.number(),
  targetLocale: z.string(),
  name: z.string().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export async function createPageTranslation(
  db: PrismaClient,
  slugService: SlugService,
  queueService: QueueService,
  auditService: AuditService,
  userId: number,
  data: z.infer<typeof createTranslationSchema>
) {
  // Get source page
  const sourcePage = await db.page.findUnique({
    where: { id: data.sourcePageId },
    include: {
      translations: true,
    },
  });

  if (!sourcePage) {
    throw new Error('Source page not found');
  }

  // Get or create translation group
  const translationGroupId = sourcePage.translationGroupId || generateUuid();

  // Generate slug if not provided
  let slug = data.slug;
  if (!slug) {
    const name = data.name || sourcePage.name;
    slug = await slugService.generate(name, 'Page', {
      prefix: '',
      locale: data.targetLocale,
    });
  } else {
    // Check slug availability
    const availability = await slugService.checkAvailability(
      slug,
      '',
      data.targetLocale
    );
    if (!availability.available) {
      throw new Error(`Slug is already taken: ${availability.suggested}`);
    }
  }

  // Create translated page
  const translatedPage = await db.page.create({
    data: {
      name: data.name || sourcePage.name,
      content: data.content || sourcePage.content,
      description: data.description || sourcePage.description,
      status: sourcePage.status,
      template: sourcePage.template,
      image: sourcePage.image,
      userId,
      translationGroupId,
    },
  });

  // Create slug
  await slugService.create('Page', translatedPage.id, slug, '', data.targetLocale);

  // Create translation record
  await db.pageTranslation.create({
    data: {
      langCode: data.targetLocale,
      pagesId: translatedPage.id,
      name: data.name || sourcePage.name,
      description: data.description || sourcePage.description,
      content: data.content || sourcePage.content,
    },
  });

  // Copy meta boxes from source page
  const sourceMetaBoxes = await db.metaBox.findMany({
    where: {
      referenceType: 'Page',
      referenceId: sourcePage.id,
    },
  });

  if (sourceMetaBoxes.length > 0) {
    await db.metaBox.createMany({
      data: sourceMetaBoxes.map((meta) => ({
        referenceType: 'Page',
        referenceId: translatedPage.id,
        metaKey: meta.metaKey,
        metaValue: meta.metaValue,
      })),
    });
  }

  // Update source page translation group if needed
  if (!sourcePage.translationGroupId) {
    await db.page.update({
      where: { id: sourcePage.id },
      data: { translationGroupId },
    });
  }

  // Enqueue sitemap generation if published
  if (translatedPage.status === 'published') {
    await queueService.enqueue('sitemap.generate', {});
  }

  // Audit log
  await auditService.log({
    userId,
    module: 'pages',
    action: 'create_translation',
    referenceId: BigInt(translatedPage.id),
    referenceName: translatedPage.name,
  });

  return translatedPage;
}

