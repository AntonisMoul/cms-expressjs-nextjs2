"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
class TagService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.tag.create({
            data,
            include: {
                author: true,
                posts: {
                    include: {
                        post: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.tag.update({
            where: { id },
            data,
            include: {
                author: true,
                posts: {
                    include: {
                        post: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        // Delete tag associations first
        await this.prisma.postTag.deleteMany({
            where: { tagId: id },
        });
        // Delete the tag
        await this.prisma.tag.delete({
            where: { id },
        });
    }
    async findById(id) {
        return this.prisma.tag.findUnique({
            where: { id },
            include: {
                author: true,
                posts: {
                    include: {
                        post: true,
                    },
                },
            },
        });
    }
    async findByName(name) {
        return this.prisma.tag.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
            include: {
                author: true,
                posts: {
                    include: {
                        post: true,
                    },
                },
            },
        });
    }
    async list(options = {}) {
        const { page = 1, perPage = 15, sortBy = 'createdAt', sortOrder = 'desc', filters = {}, } = options;
        const where = {};
        // Apply filters
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } },
            ];
        }
        const [tags, total] = await Promise.all([
            this.prisma.tag.findMany({
                where,
                include: {
                    author: true,
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
            this.prisma.tag.count({ where }),
        ]);
        return {
            tags,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }
    async getAll() {
        return this.prisma.tag.findMany({
            where: { status: 'published' },
            orderBy: { name: 'asc' },
        });
    }
    async search(query, limit = 10) {
        return this.prisma.tag.findMany({
            where: {
                status: 'published',
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            take: limit,
            orderBy: { name: 'asc' },
        });
    }
}
exports.TagService = TagService;
