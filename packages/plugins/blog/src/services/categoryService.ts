import { PrismaClient } from '@prisma/client';
import { Category, CategoryCreateData, CategoryUpdateData, CategoryListOptions, CategoryListResponse, CategoryFilters } from '../models/types';

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CategoryCreateData): Promise<Category> {
    const category = await this.prisma.category.create({
      data: {
        ...data,
        parentId: data.parentId || 0,
      },
      include: {
        author: true,
        parent: true,
        children: true,
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    return {
      ...category,
      posts: category.posts.map(pc => pc.post),
    };
  }

  async update(id: number, data: CategoryUpdateData): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...data,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
      },
      include: {
        author: true,
        parent: true,
        children: true,
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    return {
      ...category,
      posts: category.posts.map(pc => pc.post),
    };
  }

  async delete(id: number): Promise<void> {
    // Move children to parent
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { parentId: true },
    });

    if (category) {
      await this.prisma.category.updateMany({
        where: { parentId: id },
        data: { parentId: category.parentId },
      });
    }

    // Delete the category (cascade will handle relationships)
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        author: true,
        parent: true,
        children: true,
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    if (!category) return null;

    return {
      ...category,
      posts: category.posts.map(pc => pc.post),
    };
  }

  async list(options: CategoryListOptions = {}): Promise<CategoryListResponse> {
    const {
      page = 1,
      perPage = 15,
      sortBy = 'order',
      sortOrder = 'asc',
      filters = {},
    } = options;

    const where: any = {};

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: {
          author: true,
          parent: true,
          children: true,
          posts: {
            include: {
              post: true,
            },
          },
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    // Transform categories
    const transformedCategories = categories.map(category => ({
      ...category,
      posts: category.posts.map(pc => pc.post),
    }));

    return {
      categories: transformedCategories,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async getTree(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true, // Support up to 3 levels
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Build tree structure
    const categoryMap = new Map<number, Category>();
    const roots: Category[] = [];

    // First pass: create all category objects
    categories.forEach(cat => {
      const category = {
        ...cat,
        children: [],
        posts: [], // We'll populate this if needed
      };
      categoryMap.set(cat.id, category);
    });

    // Second pass: build hierarchy
    categoryMap.forEach(category => {
      if (category.parentId === 0) {
        roots.push(category);
      } else {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(category);
        }
      }
    });

    return roots;
  }

  async updateTree(updates: { id: number; parentId: number; order: number }[]): Promise<void> {
    const operations = updates.map(update =>
      this.prisma.category.update({
        where: { id: update.id },
        data: {
          parentId: update.parentId,
          order: update.order,
        },
      })
    );

    await this.prisma.$transaction(operations);
  }
}
