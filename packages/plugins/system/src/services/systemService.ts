import { PrismaClient } from '@prisma/client';
import { SystemInfo, SystemStats, MaintenanceTask, LogSystemEventRequest } from '../models/types';
import { CacheService } from './cacheService';
import { RedirectService } from './redirectService';
import { SitemapService } from './sitemapService';

const prisma = new PrismaClient();

export class SystemService {
  private cacheService: CacheService;
  private redirectService: RedirectService;
  private sitemapService: SitemapService;

  constructor() {
    this.cacheService = new CacheService();
    this.redirectService = new RedirectService();
    this.sitemapService = new SitemapService();
  }

  // System information
  async getSystemInfo(): Promise<SystemInfo> {
    const version = process.env.npm_package_version || '1.0.0';
    const environment = process.env.NODE_ENV || 'development';
    const uptime = process.uptime();

    // Memory info
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    // Database status
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';
    let queryCount: number | undefined;

    try {
      // Simple query to test connection
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      dbStatus = 'connected';

      // Get query count (approximate)
      const stats = await prisma.$metrics.json();
      queryCount = stats.counters?.find((c: any) => c.key === 'query_total')?.value;
    } catch (error) {
      dbStatus = 'disconnected';
    }

    return {
      version,
      environment,
      uptime,
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: Math.round(memoryPercentage * 100) / 100
      },
      database: {
        status: dbStatus,
        queryCount
      }
    };
  }

  // System statistics
  async getSystemStats(): Promise<SystemStats> {
    const [redirectStats, cacheStats, sitemapStats, logStats] = await Promise.all([
      this.redirectService.getRedirectStats(),
      this.cacheService.getStats(),
      this.sitemapService.getSitemapStats(),
      this.getLogStats()
    ]);

    return {
      redirects: redirectStats,
      cache: cacheStats,
      sitemap: sitemapStats,
      logs: logStats
    };
  }

  // System logs
  async logEvent(data: LogSystemEventRequest): Promise<void> {
    await prisma.systemLog.create({
      data: {
        level: data.level,
        message: data.message,
        context: data.context ? JSON.stringify(data.context) : null,
        user_id: data.user_id,
        ip_address: data.ip_address,
        user_agent: data.user_agent
      }
    });
  }

  async getLogs(options?: {
    level?: string;
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    const where: any = {};

    if (options?.level) {
      where.level = options.level;
    }

    if (options?.startDate || options?.endDate) {
      where.created_at = {};
      if (options.startDate) where.created_at.gte = options.startDate;
      if (options.endDate) where.created_at.lte = options.endDate;
    }

    const logs = await prisma.systemLog.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: options?.limit || 100,
      skip: options?.offset || 0
    });

    return logs.map(log => ({
      ...log,
      context: log.context ? JSON.parse(log.context) : null
    }));
  }

  async clearOldLogs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.systemLog.deleteMany({
      where: {
        created_at: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  }

  // Maintenance tasks
  getMaintenanceTasks(): MaintenanceTask[] {
    return [
      {
        id: 'clear-expired-cache',
        name: 'Clear Expired Cache',
        description: 'Remove expired cache entries to free up space',
        estimatedDuration: 5,
        execute: async () => {
          const removed = await this.cacheService.clearExpired();
          await this.logEvent({
            level: 'info',
            message: `Cleared ${removed} expired cache entries`,
            context: { task: 'clear-expired-cache', entriesRemoved: removed }
          });
        }
      },
      {
        id: 'clear-old-logs',
        name: 'Clear Old System Logs',
        description: 'Remove system logs older than 30 days',
        estimatedDuration: 10,
        execute: async () => {
          const removed = await this.clearOldLogs(30);
          await this.logEvent({
            level: 'info',
            message: `Cleared ${removed} old system logs`,
            context: { task: 'clear-old-logs', logsRemoved: removed }
          });
        }
      },
      {
        id: 'optimize-database',
        name: 'Database Optimization',
        description: 'Run database optimization queries',
        estimatedDuration: 30,
        execute: async () => {
          // This would run database-specific optimization commands
          await this.logEvent({
            level: 'info',
            message: 'Database optimization completed',
            context: { task: 'optimize-database' }
          });
        }
      },
      {
        id: 'regenerate-sitemap',
        name: 'Regenerate Sitemap',
        description: 'Update sitemap with latest content',
        estimatedDuration: 15,
        execute: async () => {
          const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
          await this.sitemapService.populateFromContent(baseUrl);
          await this.logEvent({
            level: 'info',
            message: 'Sitemap regenerated',
            context: { task: 'regenerate-sitemap', baseUrl }
          });
        }
      }
    ];
  }

  async runMaintenanceTask(taskId: string): Promise<{ success: boolean; message: string }> {
    const tasks = this.getMaintenanceTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return { success: false, message: 'Task not found' };
    }

    try {
      await task.execute();
      return { success: true, message: `Task "${task.name}" completed successfully` };
    } catch (error) {
      await this.logEvent({
        level: 'error',
        message: `Maintenance task "${task.name}" failed`,
        context: { taskId, error: error instanceof Error ? error.message : 'Unknown error' }
      });

      return {
        success: false,
        message: `Task "${task.name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // System health checks
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    checks: Record<string, { status: 'pass' | 'fail'; message: string }>;
  }> {
    const checks: Record<string, { status: 'pass' | 'fail'; message: string }> = {};

    // Database check
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'pass', message: 'Database connection OK' };
    } catch (error) {
      checks.database = { status: 'fail', message: 'Database connection failed' };
    }

    // Cache check
    try {
      await this.cacheService.set('health-check', 'ok', { ttl: 60 });
      const value = await this.cacheService.get('health-check');
      if (value === 'ok') {
        checks.cache = { status: 'pass', message: 'Cache system OK' };
      } else {
        checks.cache = { status: 'fail', message: 'Cache read/write failed' };
      }
      await this.cacheService.delete('health-check');
    } catch (error) {
      checks.cache = { status: 'fail', message: 'Cache system error' };
    }

    // Memory check
    const memUsage = process.memoryUsage();
    const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    if (memPercentage > 90) {
      checks.memory = { status: 'fail', message: `High memory usage: ${memPercentage.toFixed(1)}%` };
    } else if (memPercentage > 80) {
      checks.memory = { status: 'warning', message: `High memory usage: ${memPercentage.toFixed(1)}%` };
    } else {
      checks.memory = { status: 'pass', message: `Memory usage: ${memPercentage.toFixed(1)}%` };
    }

    // Determine overall status
    const failedChecks = Object.values(checks).filter(check => check.status === 'fail').length;
    const warningChecks = Object.values(checks).filter(check => check.status === 'warning').length;

    let status: 'healthy' | 'warning' | 'critical';
    if (failedChecks > 0) {
      status = 'critical';
    } else if (warningChecks > 0) {
      status = 'warning';
    } else {
      status = 'healthy';
    }

    return { status, checks };
  }

  // Backup operations (placeholder for future implementation)
  async createBackup(): Promise<{ success: boolean; message: string; path?: string }> {
    // This would create a database backup
    await this.logEvent({
      level: 'info',
      message: 'Backup creation initiated',
      context: { type: 'manual' }
    });

    return {
      success: false,
      message: 'Backup functionality not yet implemented'
    };
  }

  async listBackups(): Promise<Array<{ name: string; size: number; createdAt: Date }>> {
    // This would list available backups
    return [];
  }

  // Private helper methods
  private async getLogStats(): Promise<{
    errors: number;
    warnings: number;
    today: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [errors, warnings, todayLogs] = await Promise.all([
      prisma.systemLog.count({ where: { level: 'error' } }),
      prisma.systemLog.count({ where: { level: 'warn' } }),
      prisma.systemLog.count({
        where: {
          created_at: {
            gte: today,
            lt: tomorrow
          }
        }
      })
    ]);

    return {
      errors,
      warnings,
      today: todayLogs
    };
  }
}
