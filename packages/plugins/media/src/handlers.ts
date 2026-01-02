import { PluginContext, JobHandler } from '@cms/shared';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

export function getMediaJobHandlers(ctx: PluginContext): JobHandler[] {
  return [
    {
      name: 'media.processImage',
      handler: async (payload: {
        mediaFileId: number;
        filePath: string;
        mimeType: string;
      }) => {
        const db = ctx.db as any;
        const mediaFile = await db.mediaFile.findUnique({
          where: { id: payload.mediaFileId },
        });

        if (!mediaFile) {
          throw new Error(`Media file ${payload.mediaFileId} not found`);
        }

        // Read image file
        // payload.filePath is just the filename, need to construct full path
        const fullPath = path.join(process.cwd(), 'storage', 'app', 'public', 'media', payload.filePath);
        const imageBuffer = await fs.readFile(fullPath);

        // Generate thumbnails
        const thumbnails: Record<string, string> = {};

        const mediaDir = path.join(process.cwd(), 'storage', 'app', 'public', 'media');
        const fileExt = path.extname(payload.filePath);
        const fileBase = path.basename(payload.filePath, fileExt);

        // Small thumbnail (150x150)
        const smallThumb = await sharp(imageBuffer)
          .resize(150, 150, { fit: 'cover' })
          .toBuffer();
        const smallPath = path.join(mediaDir, `${fileBase}-thumb-small${fileExt}`);
        await fs.writeFile(smallPath, smallThumb);
        thumbnails.small = `/media/${path.basename(smallPath)}`;

        // Medium thumbnail (300x300)
        const mediumThumb = await sharp(imageBuffer)
          .resize(300, 300, { fit: 'cover' })
          .toBuffer();
        const mediumPath = path.join(mediaDir, `${fileBase}-thumb-medium${fileExt}`);
        await fs.writeFile(mediumPath, mediumThumb);
        thumbnails.medium = `/media/${path.basename(mediumPath)}`;

        // Large thumbnail (800x800)
        const largeThumb = await sharp(imageBuffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .toBuffer();
        const largePath = path.join(mediaDir, `${fileBase}-thumb-large${fileExt}`);
        await fs.writeFile(largePath, largeThumb);
        thumbnails.large = `/media/${path.basename(largePath)}`;

        // Get image dimensions
        const metadata = await sharp(imageBuffer).metadata();

        // Update media file options
        const options = {
          thumbnails,
          width: metadata.width,
          height: metadata.height,
          processed: true,
        };

        await db.mediaFile.update({
          where: { id: payload.mediaFileId },
          data: {
            options: JSON.stringify(options),
          },
        });
      },
      maxAttempts: 3,
      backoff: 30,
    },
  ];
}

