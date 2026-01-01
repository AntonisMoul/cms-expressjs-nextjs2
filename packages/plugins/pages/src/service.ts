import { PrismaClient } from '@prisma/client';
import { Page, PageWithTranslations, CreatePageRequest, UpdatePageRequest, PageListRequest, PaginatedResponse } from '@cms/core';

export class PagesService {
  constructor(private prisma: PrismaClient) {}

  async createPage(data: CreatePageRequest, userId: string): Promise<Page> {
    const page = await this.prisma.page.create({
      data: {
        name: data.name,
        content: data.content,
        userId,
        image: data.image,
        template: data.template,
        isFeatured: data.isFeatured || false,
        description: data.description,
        status: data.status || 'published',
      },
    });

    return {
      id: page.id,
      name: page.name,
      content: page.content,
      userId: page.userId,
      image: page.image,
      template: page.template,
      isFeatured: page.isFeatured,
      description: page.description,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  async updatePage(id: string, data: UpdatePageRequest): Promise<Page> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.template !== undefined) updateData.template = data.template;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    const page = await this.prisma.page.update({
      where: { id },
      data: updateData,
    });

    return {
      id: page.id,
      name: page.name,
      content: page.content,
      userId: page.userId,
      image: page.image,
      template: page.template,
      isFeatured: page.isFeatured,
      description: page.description,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  async deletePage(id: string): Promise<void> {
    await this.prisma.page.delete({
      where: { id },
    });
  }

  async getPageById(id: string): Promise<Page | null> {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) return null;

    return {
      id: page.id,
      name: page.name,
      content: page.content,
      userId: page.userId,
      image: page.image,
      template: page.template,
      isFeatured: page.isFeatured,
      description: page.description,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  async getPageWithTranslations(id: string): Promise<PageWithTranslations | null> {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!page) return null;

    return {
      id: page.id,
      name: page.name,
      content: page.content,
      userId: page.userId,
      image: page.image,
      template: page.template,
      isFeatured: page.isFeatured,
      description: page.description,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      translations: page.translations,
    };
  }

  async getPages(options: PageListRequest = {}): Promise<PaginatedResponse<Page>> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      author,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (author) {
      where.userId = author;
    }

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.page.count({ where }),
    ]);

    const data = pages.map(page => ({
      id: page.id,
      name: page.name,
      content: page.content,
      userId: page.userId,
      image: page.image,
      template: page.template,
      isFeatured: page.isFeatured,
      description: page.description,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }));

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPublishedPages(): Promise<Page[]> {
    const pages = await this.prisma.page.findMany({
      where: {
        status: 'published',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pages.map(page => ({
      id: page.id,
      name: page.name,
      content: page.content,
      userId: page.userId,
      image: page.image,
      template: page.template,
      isFeatured: page.isFeatured,
      description: page.description,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }));
  }

  // Translation methods
  async createPageTranslation(pageId: string, langCode: string, data: {
    name?: string;
    description?: string;
    content?: string;
  }): Promise<void> {
    await this.prisma.pageTranslation.upsert({
      where: {
        langCode_pagesId: {
          langCode,
          pagesId: pageId,
        },
      },
      update: data,
      create: {
        langCode,
        pagesId: pageId,
        ...data,
      },
    });
  }

  async updatePageTranslation(pageId: string, langCode: string, data: {
    name?: string;
    description?: string;
    content?: string;
  }): Promise<void> {
    await this.prisma.pageTranslation.updateMany({
      where: {
        pagesId: pageId,
        langCode,
      },
      data,
    });
  }

  async deletePageTranslation(pageId: string, langCode: string): Promise<void> {
    await this.prisma.pageTranslation.deleteMany({
      where: {
        pagesId: pageId,
        langCode,
      },
    });
  }

  async getPageTranslation(pageId: string, langCode: string): Promise<{
    langCode: string;
    pagesId: string;
    name?: string;
    description?: string;
    content?: string;
  } | null> {
    const translation = await this.prisma.pageTranslation.findUnique({
      where: {
        langCode_pagesId: {
          langCode,
          pagesId: pageId,
        },
      },
    });

    return translation;
  }
}

