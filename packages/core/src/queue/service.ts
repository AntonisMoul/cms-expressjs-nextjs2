import { PrismaClient, JobStatus } from '@cms/shared';
import { sleep } from '@cms/shared/utils';

export interface EnqueueOptions {
  queue?: string;
  priority?: number;
  runAt?: Date;
  maxAttempts?: number;
}

export class QueueService {
  constructor(private db: PrismaClient) {}

  async enqueue(
    name: string,
    payload: any,
    options?: EnqueueOptions
  ): Promise<bigint> {
    const job = await this.db.job.create({
      data: {
        name,
        payloadJson: JSON.stringify(payload),
        queue: options?.queue || 'default',
        priority: options?.priority || 0,
        runAt: options?.runAt || new Date(),
        maxAttempts: options?.maxAttempts || 3,
        status: 'QUEUED',
      },
    });

    return job.id;
  }

  async claimNextJob(workerId: string): Promise<{
    id: bigint;
    name: string;
    payloadJson: string;
    attempts: number;
    maxAttempts: number;
  } | null> {
    // Atomic transaction to claim job
    const result = await this.db.$transaction(async (tx) => {
      // Find next available job
      const job = await tx.job.findFirst({
        where: {
          status: 'QUEUED',
          runAt: { lte: new Date() },
          OR: [
            { lockedAt: null },
            {
              lockedAt: {
                lt: new Date(Date.now() - 90 * 1000), // Lock expired (90 seconds)
              },
            },
          ],
        },
        orderBy: [
          { runAt: 'asc' },
          { priority: 'desc' },
          { id: 'asc' },
        ],
      });

      if (!job) {
        return null;
      }

      // Claim job atomically
      await tx.job.update({
        where: { id: job.id },
        data: {
          status: 'PROCESSING',
          lockedAt: new Date(),
          lockedBy: workerId,
          attempts: { increment: 1 },
        },
      });

      return {
        id: job.id,
        name: job.name,
        payloadJson: job.payloadJson,
        attempts: job.attempts + 1,
        maxAttempts: job.maxAttempts,
      };
    });

    return result;
  }

  async completeJob(jobId: bigint): Promise<void> {
    await this.db.job.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
      },
    });

    // Delete completed job after a delay (optional cleanup)
    // For now, we'll keep it for auditing
  }

  async failJob(
    jobId: bigint,
    error: Error,
    retry: boolean = true
  ): Promise<void> {
    const job = await this.db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return;
    }

    if (retry && job.attempts < job.maxAttempts) {
      // Retry with exponential backoff
      const backoff = Math.min(60 * Math.pow(2, job.attempts), 3600); // Max 1 hour
      const newRunAt = new Date(Date.now() + backoff * 1000);

      await this.db.job.update({
        where: { id: jobId },
        data: {
          status: 'QUEUED',
          lockedAt: null,
          lockedBy: null,
          runAt: newRunAt,
          lastError: error.message,
        },
      });
    } else {
      // Max attempts reached, move to failed_jobs
      const { generateUuid } = await import('@cms/shared/utils');
      const uuid = generateUuid();
      
      // Store job name in exception for easier retry (workaround)
      // Format: "Job: {jobName}\n{original exception}"
      const exceptionWithJobName = `Job: ${job.name}\n${error.stack || error.message}`;
      
      await this.db.failedJob.create({
        data: {
          uuid,
          connection: 'database',
          queue: job.queue,
          payload: job.payloadJson,
          exception: exceptionWithJobName,
        },
      });

      await this.db.job.delete({
        where: { id: jobId },
      });
    }
  }

  async getJobs(filters?: {
    status?: JobStatus;
    queue?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.queue) {
      where.queue = filters.queue;
    }

    return this.db.job.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }

  async getFailedJobs(filters?: {
    limit?: number;
    offset?: number;
  }) {
    return this.db.failedJob.findMany({
      orderBy: {
        failedAt: 'desc',
      },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }
}

