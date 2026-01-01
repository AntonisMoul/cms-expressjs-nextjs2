import { PrismaClient } from '@prisma/client';
import { Menu, MenuNode, MenuLocation, MenuWithNodes, CreateMenuRequest, UpdateMenuRequest, CreateMenuNodeRequest, UpdateMenuNodeRequest } from '@cms/core';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaClient);
    createMenu(data: CreateMenuRequest): Promise<Menu>;
    updateMenu(id: string, data: UpdateMenuRequest): Promise<Menu>;
    deleteMenu(id: string): Promise<void>;
    getMenuById(id: string): Promise<Menu | null>;
    getMenuWithNodes(id: string): Promise<MenuWithNodes | null>;
    getAllMenus(): Promise<Menu[]>;
    createMenuNode(data: CreateMenuNodeRequest): Promise<MenuNode>;
    updateMenuNode(id: string, data: UpdateMenuNodeRequest): Promise<MenuNode>;
    deleteMenuNode(id: string): Promise<void>;
    reorderMenuNodes(menuId: string, nodeOrders: Array<{
        id: string;
        parentId: string;
        position: number;
    }>): Promise<void>;
    assignMenuToLocation(menuId: string, location: string): Promise<MenuLocation>;
    removeMenuFromLocation(location: string): Promise<void>;
    getMenuByLocation(location: string): Promise<MenuWithNodes | null>;
    getAllLocations(): Promise<MenuLocation[]>;
    private updateParentHasChild;
    private slugify;
    buildMenuStructure(menuId: string): Promise<any[]>;
    private buildNodeTree;
}
//# sourceMappingURL=service.d.ts.map