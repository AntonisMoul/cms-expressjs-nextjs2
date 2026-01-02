import 'dotenv/config';
import { prisma } from '@cms/shared';
import { QueueService } from '@cms/core';
import { sleep } from '@cms/shared/utils';

const workerId = `worker-${process.pid}-${Date.now()}`;
const queue = new QueueService(prisma);

// Job handlers registry (will be populated by plugins)
const jobHandlers = new Map<string, (payload: any) => Promise<void>>();

// Register job handlers from plugins
import { PagePlugin } from '@cms/plugin-page';
import { BlogPlugin } from '@cms/plugin-blog';
import { MediaPlugin } from '@cms/plugin-media';
import { SitemapPlugin } from '@cms/plugin-sitemap';
import { prisma } from '@cms/shared';
import { QueueService, SettingsService, AuditService, SlugService, I18nService } from '@cms/core';

const queueService = new QueueService(prisma);
const settingsService = new SettingsService(prisma);
const auditService = new AuditService(prisma);
const slugService = new SlugService(prisma);
const i18nService = new I18nService(prisma);

const pluginContext = {
  db: prisma,
  queue: queueService,
  events: null as any,
  settings: settingsService,
  auth: null as any,
  rbac: null as any,
  slug: slugService,
  i18n: i18nService,
  plugins: null as any,
  apiApp: null as any,
  webApp: null as any,
  audit: auditService,
};

// Load handlers from plugins
const plugins = [
  new PagePlugin(),
  new BlogPlugin(),
  new MediaPlugin(),
  new SitemapPlugin(),
];

for (const plugin of plugins) {
  const handlers = plugin.getJobHandlers?.(pluginContext) || [];
  for (const handler of handlers) {
    jobHandlers.set(handler.name, handler.handler);
  }
}

async function processJobs() {
  console.log(`Worker ${workerId} started`);

  while (true) {
    try {
      const job = await queue.claimNextJob(workerId);

      if (!job) {
        // No jobs available, wait before polling again
        await sleep(3000); // 3 seconds
        continue;
      }

      console.log(`Processing job: ${job.name} (ID: ${job.id})`);

      // Execute job handler
      const handler = jobHandlers.get(job.name);
      if (!handler) {
        console.error(`No handler found for job: ${job.name}`);
        await queue.failJob(
          job.id,
          new Error(`No handler for ${job.name}`),
          false
        );
        continue;
      }

      try {
        const payload = JSON.parse(job.payloadJson);
        await handler(payload);
        await queue.completeJob(job.id);
        console.log(`Job ${job.id} completed successfully`);
      } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        await queue.failJob(job.id, error as Error, true);
      }
    } catch (error) {
      console.error('Worker error:', error);
      await sleep(5000); // Wait before retrying
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log(`Worker ${workerId} shutting down...`);
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log(`Worker ${workerId} shutting down...`);
  await prisma.$disconnect();
  process.exit(0);
});

processJobs();

