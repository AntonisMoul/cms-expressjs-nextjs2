import { apiClient } from './client';

export interface SitemapStatus {
  enabled: boolean;
  itemsPerPage: number;
  lastGenerated?: string;
}

export interface Job {
  id: string;
  name: string;
  queue: string;
  payloadJson: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  priority: number;
  attempts: number;
  maxAttempts: number;
  runAt: string;
  lockedAt?: string;
  lockedBy?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FailedJob {
  id: number;
  uuid: string;
  connection: string;
  queue: string;
  payload: string;
  exception: string;
  failedAt: string;
}

export interface SystemResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    failedJobs: FailedJob[];
  };
}

export const systemApi = {
  clearCache: async (): Promise<SystemResponse<null>> => {
    return apiClient.post<SystemResponse<null>>('/api/v1/system/cache/clear');
  },

  getSitemapStatus: async (): Promise<SystemResponse<SitemapStatus>> => {
    return apiClient.get<SystemResponse<SitemapStatus>>('/api/v1/system/sitemap');
  },

  generateSitemap: async (): Promise<SystemResponse<null>> => {
    return apiClient.post<SystemResponse<null>>('/api/v1/system/sitemap/generate');
  },

  getJobs: async (params?: {
    status?: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    limit?: number;
  }): Promise<JobsResponse> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.limit) query.append('limit', params.limit.toString());
    
    return apiClient.get<JobsResponse>(`/api/v1/system/jobs?${query.toString()}`);
  },

  retryFailedJob: async (uuid: string, jobName: string): Promise<SystemResponse<null>> => {
    return apiClient.post<SystemResponse<null>>(`/api/v1/queue/failed/${uuid}/retry`, { jobName });
  },

  deleteFailedJob: async (uuid: string): Promise<SystemResponse<null>> => {
    return apiClient.delete<SystemResponse<null>>(`/api/v1/queue/failed/${uuid}`);
  },
};

