import { Router, Response } from 'express';
import { PrismaClient } from '@cms/shared';
import { QueueService } from '@cms/core';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

export function queueRoutes(db: PrismaClient): Router {
  const router = Router();
  const queueService = new QueueService(db);

  router.use(requireAuth);
  router.use(requirePermission('queue.jobs.index'));

  // Get jobs
  router.get('/jobs', async (req: AuthRequest, res: Response) => {
    try {
      const { status, queue, limit, offset } = req.query;

      const jobs = await queueService.getJobs({
        status: status as any,
        queue: queue as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      res.json({
        success: true,
        data: { jobs },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Get failed jobs
  router.get('/failed', async (req: AuthRequest, res: Response) => {
    try {
      const { limit, offset } = req.query;

      const jobs = await queueService.getFailedJobs({
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      res.json({
        success: true,
        data: { jobs },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Retry failed job
  router.post('/failed/:uuid/retry', requirePermission('queue.jobs.retry'), async (req: AuthRequest, res: Response) => {
    try {
      const { uuid } = req.params;

      const failedJob = await db.failedJob.findUnique({
        where: { uuid },
      });

      if (!failedJob) {
        return res.status(404).json({
          success: false,
          error: 'Failed job not found',
        });
      }

      // Parse payload and re-enqueue
      // Try to extract job name from exception (stored as "Job: jobName" in exception)
      // Or use the jobName from request body if provided
      let jobName = req.body?.jobName;
      
      if (!jobName) {
        // Try to extract from exception
        const exceptionMatch = failedJob.exception.match(/Job:\s*([^\s]+)/i) || 
                              failedJob.exception.match(/job:\s*([^\s]+)/i);
        if (exceptionMatch) {
          jobName = exceptionMatch[1];
        } else {
          // Try to parse payload to see if it contains job name
          try {
            const payload = JSON.parse(failedJob.payload);
            if (payload.name) {
              jobName = payload.name;
            }
          } catch (e) {
            // Ignore
          }
        }
      }

      if (!jobName) {
        return res.status(400).json({
          success: false,
          error: 'Could not determine job name. Please provide jobName in request body.',
        });
      }

      const payload = JSON.parse(failedJob.payload);
      
      await queueService.enqueue(jobName, payload, {
        queue: failedJob.queue,
      });

      // Delete failed job
      await db.failedJob.delete({
        where: { uuid },
      });

      res.json({
        success: true,
        message: 'Job re-enqueued successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Delete failed job
  router.delete('/failed/:uuid', requirePermission('queue.jobs.delete'), async (req: AuthRequest, res: Response) => {
    try {
      const { uuid } = req.params;

      await db.failedJob.delete({
        where: { uuid },
      });

      res.json({
        success: true,
        message: 'Failed job deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  return router;
}

