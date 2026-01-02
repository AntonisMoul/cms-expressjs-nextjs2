import 'dotenv/config';
import cron from 'node-cron';
import { prisma } from '@cms/shared';
import { QueueService } from '@cms/core';

const queue = new QueueService(prisma);

// Schedule: Daily at 02:00 - Sitemap generation
cron.schedule('0 2 * * *', async () => {
  console.log('Scheduling sitemap generation...');
  await queue.enqueue('sitemap.generate', {});
});

// Schedule: Daily at 02:00 (30 seconds after sitemap) - IndexNow submission
cron.schedule('0 2 * * *', async () => {
  await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds
  console.log('Scheduling IndexNow submission...');
  await queue.enqueue('sitemap.indexnow', { sitemapUrl: null });
});

// Schedule: Every 5 minutes - Cache cleanup
cron.schedule('*/5 * * * *', async () => {
  console.log('Scheduling cache cleanup...');
  await queue.enqueue('cache.clearExpired', {});
});

// Schedule: Daily at 03:00 - Backup generation
cron.schedule('0 3 * * *', async () => {
  console.log('Scheduling backup generation...');
  await queue.enqueue('backup.generate', {
    includeFiles: true,
    includeDatabase: true,
  });
});

// Schedule: Hourly - Analytics processing
cron.schedule('0 * * * *', async () => {
  console.log('Scheduling analytics processing...');
  await queue.enqueue('analytics.process', {});
});

// Schedule: Daily at 04:00 - Log cleanup
cron.schedule('0 4 * * *', async () => {
  console.log('Scheduling log cleanup...');
  await queue.enqueue('logs.cleanup', {});
});

console.log('Scheduler started');

// Keep process alive
process.on('SIGTERM', async () => {
  console.log('Scheduler shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Scheduler shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

