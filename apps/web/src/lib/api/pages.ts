import { apiClient } from './client';

export interface Page {
  id: number;
  name: string;
  content?: string;
  description?: string;
  status: 'published' | 'draft';
  template?: string;
  image?: string;
  translationGroupId?: string;
  createdAt: string;
  updatedAt: string;
  slug?: {
    id: number;
    key: string;
    prefix: string;
    locale?: string;
  };
  meta?: {
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    seo_image?: string;
    banner?: string;
    gallery?: string;
  };
  linkedTranslations?: Page[];
}

export interface PagesResponse {
  success: boolean;
  data: {
    pages: Page[];
    meta: {
      currentPage: number;
      perPage: number;
      total: number;
      lastPage: number;
    };
  };
}

export interface PageResponse {
  success: boolean;
  data: {
    page: Page;
  };
}

export interface SlugAvailability {
  available: boolean;
  suggested?: string;
}

export const pagesApi = {
  list: async (params?: {
    page?: number;
    perPage?: number;
    search?: string;
    status?: string;
  }): Promise<PagesResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.perPage) query.append('perPage', params.perPage.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    
    return apiClient.get<PagesResponse>(`/api/v1/pages?${query.toString()}`);
  },

  get: async (id: number): Promise<PageResponse> => {
    return apiClient.get<PageResponse>(`/api/v1/pages/${id}`);
  },

  create: async (data: {
    name: string;
    content?: string;
    description?: string;
    status?: 'published' | 'draft';
    template?: string;
    image?: string;
    slug?: string;
    locale?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    seoImage?: string;
    banner?: string;
    gallery?: string[];
  }): Promise<PageResponse> => {
    return apiClient.post<PageResponse>('/api/v1/pages', data);
  },

  update: async (
    id: number,
    data: {
      name?: string;
      content?: string;
      description?: string;
      status?: 'published' | 'draft';
      template?: string;
      image?: string;
      slug?: string;
      locale?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
      seoImage?: string;
      banner?: string;
      gallery?: string[];
    }
  ): Promise<PageResponse> => {
    return apiClient.put<PageResponse>(`/api/v1/pages/${id}`, data);
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/api/v1/pages/${id}`);
  },

  checkSlug: async (params: {
    slug: string;
    prefix?: string;
    locale?: string;
    excludeId?: number;
  }): Promise<{ success: boolean; data: SlugAvailability }> => {
    return apiClient.post('/api/v1/pages/slug/check', params);
  },

  createTranslation: async (
    pageId: number,
    data: {
      targetLocale: string;
      name?: string;
      content?: string;
      description?: string;
      slug?: string;
    }
  ): Promise<PageResponse> => {
    return apiClient.post<PageResponse>(`/api/v1/pages/${pageId}/translations`, data);
  },
};

