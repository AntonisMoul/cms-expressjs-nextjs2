import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  Post, Category, Tag, PostCreateData, PostUpdateData, CategoryCreateData,
  CategoryUpdateData, TagCreateData, TagUpdateData, PostListOptions,
  CategoryListOptions, TagListOptions, PostListResponse, CategoryListResponse,
  TagListResponse, PostFilters, CategoryFilters, TagFilters, POST_STATUSES
} from '../models/types';
import { SlugService } from '@cms/core';

export class PostService {
  constructor(private prisma: PrismaClient) {}

  async create(data: PostCreateData, locale: string = 'en'): Promise<Post> {
    const { categoryIds, tagIds, meta, ...postData } = data;

    // Generate translation group ID if not provided
    const translationGroupId = postData.translationGroupId || randomUUID();

    // Create the post
    const post = await this.prisma.post.create({
      data: {
        ...postData,
        translationGroupId,
      },
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        translations: true,
        meta: true,
      },
    });

    // Create translation for the current locale
    if (locale !== 'en') {
      await this.prisma.postTranslation.create({
        data: {
          langCode: locale,
          postsId: post.id,
          name: postData.name,
          description: postData.description,
          content: postData.content,
        },
      });
    }

    // Assign categories
    if (categoryIds && categoryIds.length > 0) {
      await this.assignCategoriesToPost(post.id, categoryIds);
    }

    // Assign tags
    if (tagIds && tagIds.length > 0) {
      await this.assignTagsToPost(post.id, tagIds);
    }

    // Create meta data if provided
    if (meta) {
      await this.createMeta(post.id, meta);
    }

    // Generate slug with 'blog' prefix
    await this.generateSlug(post.id, post.name, locale);

    return post;
  }

  async update(id: number, data: PostUpdateData, locale: string = 'en'): Promise<Post> {
    const { categoryIds, tagIds, meta, ...postData } = data;

    // Update the post
    const post = await this.prisma.post.update({
      where: { id },
      data: postData,
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        translations: true,
        meta: true,
      },
    });

    // Update or create translation
    await this.prisma.postTranslation.upsert({
      where: {
        langCode_postsId: {
          langCode: locale,
          postsId: id,
        },
      },
      update: {
        name: postData.name,
        description: postData.description,
        content: postData.content,
      },
      create: {
        langCode: locale,
        postsId: id,
        name: postData.name,
        description: postData.description,
        content: postData.content,
      },
    });

    // Update categories if provided
    if (categoryIds !== undefined) {
      await this.updatePostCategories(id, categoryIds);
    }

    // Update tags if provided
    if (tagIds !== undefined) {
      await this.updatePostTags(id, tagIds);
    }

    // Update meta data if provided
    if (meta) {
      await this.updateMeta(id, meta);
    }

    // Update slug if name changed
    if (postData.name) {
      await this.updateSlug(id, postData.name, locale);
    }

    return post;
  }

  async delete(id: number): Promise<void> {
    // Delete meta data
    await this.prisma.postMeta.deleteMany({
      where: { postId: id },
    });

    // Delete translations
    await this.prisma.postTranslation.deleteMany({
      where: { postsId: id },
    });

    // Delete category and tag associations
    await this.prisma.postCategory.deleteMany({
      where: { postId: id },
    });

    await this.prisma.postTag.deleteMany({
      where: { postId: id },
    });

    // Delete the post
    await this.prisma.post.delete({
      where: { id },
    });
  }

  async findById(id: number, locale?: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        translations: locale ? {
          where: { langCode: locale },
        } : true,
        meta: true,
      },
    });

    if (!post) return null;

    // If we have a translation for the requested locale, merge it
    if (locale && post.translations.length > 0) {
      const translation = post.translations[0];
      return {
        ...post,
        name: translation.name || post.name,
        description: translation.description || post.description,
        content: translation.content || post.content,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag),
      };
    }

    return {
      ...post,
      categories: post.categories.map(pc => pc.category),
      tags: post.tags.map(pt => pt.tag),
    };
  }

  async findBySlug(slug: string, locale: string = 'en'): Promise<Post | null> {
    // Find slug record with 'blog' prefix
    const slugRecord = await this.prisma.slug.findFirst({
      where: {
        key: slug,
        referenceType: 'Post',
        prefix: 'blog',
        isActive: true,
      },
    });

    if (!slugRecord) return null;

    return this.findById(slugRecord.referenceId, locale);
  }

  async list(options: PostListOptions = {}): Promise<PostListResponse> {
    const {
      page = 1,
      perPage = 15,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const where: any = {};

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.categoryId) {
      where.categories = {
        some: {
          categoryId: filters.categoryId,
        },
      };
    }

    if (filters.tagId) {
      where.tags = {
        some: {
          tagId: filters.tagId,
        },
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { content: { contains: filters.search } },
      ];
    }

    if (filters.translationGroupId) {
      where.translationGroupId = filters.translationGroupId;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          author: true,
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          translations: true,
          meta: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    // Transform posts to match the interface
    const transformedPosts = posts.map(post => ({
      ...post,
      categories: post.categories.map(pc => pc.category),
      tags: post.tags.map(pt => pt.tag),
    }));

    return {
      posts: transformedPosts,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async publish(id: number): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data: { status: POST_STATUSES.PUBLISHED },
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        translations: true,
        meta: true,
      },
    });
  }

  async unpublish(id: number): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data: { status: POST_STATUSES.DRAFT },
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        translations: true,
        meta: true,
      },
    });
  }

  private async assignCategoriesToPost(postId: number, categoryIds: number[]): Promise<void> {
    const data = categoryIds.map(categoryId => ({
      postId,
      categoryId,
    }));

    await this.prisma.postCategory.createMany({
      data,
    });
  }

  private async assignTagsToPost(postId: number, tagIds: number[]): Promise<void> {
    const data = tagIds.map(tagId => ({
      postId,
      tagId,
    }));

    await this.prisma.postTag.createMany({
      data,
    });
  }

  private async updatePostCategories(postId: number, categoryIds: number[]): Promise<void> {
    // Remove existing categories
    await this.prisma.postCategory.deleteMany({
      where: { postId },
    });

    // Add new categories
    if (categoryIds.length > 0) {
      await this.assignCategoriesToPost(postId, categoryIds);
    }
  }

  private async updatePostTags(postId: number, tagIds: number[]): Promise<void> {
    // Remove existing tags
    await this.prisma.postTag.deleteMany({
      where: { postId },
    });

    // Add new tags
    if (tagIds.length > 0) {
      await this.assignTagsToPost(postId, tagIds);
    }
  }

  private async createMeta(postId: number, meta: Record<string, any>): Promise<void> {
    const metaEntries = Object.entries(meta).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      postId,
    }));

    await this.prisma.postMeta.createMany({
      data: metaEntries,
    });
  }

  private async updateMeta(postId: number, meta: Record<string, any>): Promise<void> {
    // Delete existing meta
    await this.prisma.postMeta.deleteMany({
      where: { postId },
    });

    // Create new meta
    await this.createMeta(postId, meta);
  }

  private async generateSlug(postId: number, name: string, locale: string): Promise<void> {
    const slug = SlugService.transliterate(name);

    await SlugService.create({
      entityType: 'Post',
      entityId: postId,
      locale,
      key: slug,
      prefix: 'blog',
    });
  }

  private async updateSlug(postId: number, name: string, locale: string): Promise<void> {
    const slug = SlugService.transliterate(name);

    await SlugService.update(
      'Post',
      postId,
      locale,
      slug,
      'blog'
    );
  }
}
