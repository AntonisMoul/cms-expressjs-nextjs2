import { PrismaClient } from '@prisma/client';
import { Category, CategoryCreateData, CategoryUpdateData, CategoryListOptions, CategoryListResponse } from '../models/types';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: CategoryCreateData): Promise<Category>;
    update(id: number, data: CategoryUpdateData): Promise<Category>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<Category | null>;
    list(options?: CategoryListOptions): Promise<CategoryListResponse>;
    getTree(): Promise<Category[]>;
    updateTree(updates: {
        id: number;
        parentId: number;
        order: number;
    }[]): Promise<void>;
}
//# sourceMappingURL=categoryService.d.ts.map