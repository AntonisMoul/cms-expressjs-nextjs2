import { PrismaClient } from '@prisma/client';
import {
  Post,
  Category,
  Tag,
  PostWithRelations,
  CreatePostRequest,
  UpdatePostRequest,
  PostListRequest,
  PaginatedResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTagRequest,
  UpdateTagRequest,
} from '@cms/core';

export class BlogService {
  constructor(private prisma: PrismaClient) {}

  // Posts
  async createPost(data: CreatePostRequest, authorId: string): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        status: data.status || 'published',
        authorId,
        authorType: 'User',
        isFeatured: data.isFeatured || false,
        image: data.image,
        formatType: data.formatType,
      },
    });

    // Assign categories and tags
    if (data.categoryIds && data.categoryIds.length > 0) {
      await this.prisma.postCategory.createMany({
        data: data.categoryIds.map(categoryId => ({
          postId: post.id,
          categoryId,
        })),
      });
    }

    if (data.tagIds && data.tagIds.length > 0) {
      await this.prisma.postTag.createMany({
        data: data.tagIds.map(tagId => ({
          postId: post.id,
          tagId,
        })),
      });
    }

    return {
      id: post.id,
      name: post.name,
      description: post.description,
      content: post.content,
      status: post.status,
      authorId: post.authorId,
      authorType: post.authorType,
      isFeatured: post.isFeatured,
      image: post.image,
      views: post.views,
      formatType: post.formatType,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async updatePost(id: string, data: UpdatePostRequest): Promise<Post> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.formatType !== undefined) updateData.formatType = data.formatType;

    const post = await this.prisma.post.update({
      where: { id },
      data: updateData,
    });

    // Update categories
    if (data.categoryIds !== undefined) {
      await this.prisma.postCategory.deleteMany({
        where: { postId: id },
      });

      if (data.categoryIds.length > 0) {
        await this.prisma.postCategory.createMany({
          data: data.categoryIds.map(categoryId => ({
            postId: id,
            categoryId,
          })),
        });
      }
    }

    // Update tags
    if (data.tagIds !== undefined) {
      await this.prisma.postTag.deleteMany({
        where: { postId: id },
      });

      if (data.tagIds.length > 0) {
        await this.prisma.postTag.createMany({
          data: data.tagIds.map(tagId => ({
            postId: id,
            tagId,
          })),
        });
      }
    }

    return {
      id: post.id,
      name: post.name,
      description: post.description,
      content: post.content,
      status: post.status,
      authorId: post.authorId,
      authorType: post.authorType,
      isFeatured: post.isFeatured,
      image: post.image,
      views: post.views,
      formatType: post.formatType,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }

  async getPostById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) return null;

    return {
      id: post.id,
      name: post.name,
      description: post.description,
      content: post.content,
      status: post.status,
      authorId: post.authorId,
      authorType: post.authorType,
      isFeatured: post.isFeatured,
      image: post.image,
      views: post.views,
      formatType: post.formatType,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async getPostWithRelations(id: string): Promise<PostWithRelations | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        translations: true,
      },
    });

    if (!post) return null;

    return {
      id: post.id,
      name: post.name,
      description: post.description,
      content: post.content,
      status: post.status,
      authorId: post.authorId,
      authorType: post.authorType,
      isFeatured: post.isFeatured,
      image: post.image,
      views: post.views,
      formatType: post.formatType,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      categories: post.categories.map(pc => pc.category),
      tags: post.tags.map(pt => pt.tag),
      translations: post.translations,
    };
  }

  async getPosts(options: PostListRequest = {}): Promise<PaginatedResponse<Post>> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      author,
      category,
      tag,
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
      where.authorId = author;
    }

    if (category) {
      where.categories = {
        some: {
          categoryId: category,
        },
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tagId: tag,
        },
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    const data = posts.map(post => ({
      id: post.id,
      name: post.name,
      description: post.description,
      content: post.content,
      status: post.status,
      authorId: post.authorId,
      authorType: post.authorType,
      isFeatured: post.isFeatured,
      image: post.image,
      views: post.views,
      formatType: post.formatType,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
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

  async incrementPostViews(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  // Categories
  async createCategory(data: CreateCategoryRequest, authorId: string): Promise<Category> {
    const category = await this.prisma.category.create({
      data: {
        name: data.name,
        parentId: data.parentId || '0',
        description: data.description,
        status: data.status || 'published',
        authorId,
        authorType: 'User',
        icon: data.icon,
        order: data.order || 0,
        isFeatured: data.isFeatured || false,
        isDefault: data.isDefault || false,
      },
    });

    return {
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      description: category.description,
      status: category.status,
      authorId: category.authorId,
      authorType: category.authorType,
      icon: category.icon,
      order: category.order,
      isFeatured: category.isFeatured,
      isDefault: category.isDefault,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    const category = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return {
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      description: category.description,
      status: category.status,
      authorId: category.authorId,
      authorType: category.authorType,
      icon: category.icon,
      order: category.order,
      isFeatured: category.isFeatured,
      isDefault: category.isDefault,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async deleteCategory(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      description: category.description,
      status: category.status,
      authorId: category.authorId,
      authorType: category.authorType,
      icon: category.icon,
      order: category.order,
      isFeatured: category.isFeatured,
      isDefault: category.isDefault,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }

  // Tags
  async createTag(data: CreateTagRequest, authorId: string): Promise<Tag> {
    const tag = await this.prisma.tag.create({
      data: {
        name: data.name,
        authorId,
        authorType: 'User',
        description: data.description,
        status: data.status || 'published',
      },
    });

    return {
      id: tag.id,
      name: tag.name,
      authorId: tag.authorId,
      authorType: tag.authorType,
      description: tag.description,
      status: tag.status,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  async updateTag(id: string, data: UpdateTagRequest): Promise<Tag> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    const tag = await this.prisma.tag.update({
      where: { id },
      data: updateData,
    });

    return {
      id: tag.id,
      name: tag.name,
      authorId: tag.authorId,
      authorType: tag.authorType,
      description: tag.description,
      status: tag.status,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  async deleteTag(id: string): Promise<void> {
    await this.prisma.tag.delete({
      where: { id },
    });
  }

  async getTags(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      authorId: tag.authorId,
      authorType: tag.authorType,
      description: tag.description,
      status: tag.status,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));
  }

  // Translation methods
  async createPostTranslation(postId: string, langCode: string, data: {
    name?: string;
    description?: string;
    content?: string;
  }): Promise<void> {
    await this.prisma.postTranslation.upsert({
      where: {
        langCode_postsId: {
          langCode,
          postsId: postId,
        },
      },
      update: data,
      create: {
        langCode,
        postsId: postId,
        ...data,
      },
    });
  }

  async updatePostTranslation(postId: string, langCode: string, data: {
    name?: string;
    description?: string;
    content?: string;
  }): Promise<void> {
    await this.prisma.postTranslation.updateMany({
      where: {
        postsId: postId,
        langCode,
      },
      data,
    });
  }

  async deletePostTranslation(postId: string, langCode: string): Promise<void> {
    await this.prisma.postTranslation.deleteMany({
      where: {
        postsId: postId,
        langCode,
      },
    });
  }

  async createCategoryTranslation(categoryId: string, langCode: string, data: {
    name?: string;
    description?: string;
  }): Promise<void> {
    await this.prisma.categoryTranslation.upsert({
      where: {
        langCode_categoriesId: {
          langCode,
          categoriesId: categoryId,
        },
      },
      update: data,
      create: {
        langCode,
        categoriesId: categoryId,
        ...data,
      },
    });
  }

  async updateCategoryTranslation(categoryId: string, langCode: string, data: {
    name?: string;
    description?: string;
  }): Promise<void> {
    await this.prisma.categoryTranslation.updateMany({
      where: {
        categoriesId: categoryId,
        langCode,
      },
      data,
    });
  }

  async deleteCategoryTranslation(categoryId: string, langCode: string): Promise<void> {
    await this.prisma.categoryTranslation.deleteMany({
      where: {
        categoriesId: categoryId,
        langCode,
      },
    });
  }

  async createTagTranslation(tagId: string, langCode: string, data: {
    name?: string;
    description?: string;
  }): Promise<void> {
    await this.prisma.tagTranslation.upsert({
      where: {
        langCode_tagsId: {
          langCode,
          tagsId: tagId,
        },
      },
      update: data,
      create: {
        langCode,
        tagsId: tagId,
        ...data,
      },
    });
  }

  async updateTagTranslation(tagId: string, langCode: string, data: {
    name?: string;
    description?: string;
  }): Promise<void> {
    await this.prisma.tagTranslation.updateMany({
      where: {
        tagsId: tagId,
        langCode,
      },
      data,
    });
  }

  async deleteTagTranslation(tagId: string, langCode: string): Promise<void> {
    await this.prisma.tagTranslation.deleteMany({
      where: {
        tagsId: tagId,
        langCode,
      },
    });
  }
}

