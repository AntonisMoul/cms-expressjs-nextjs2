import { PrismaClient } from '@prisma/client';
import { Menu, MenuItem, MenuLocation, MenuWithItems, HierarchicalMenuItem, CreateMenuRequest, UpdateMenuRequest, CreateMenuItemRequest, UpdateMenuItemRequest, CreateMenuLocationRequest, UpdateMenuLocationRequest } from '../models/types';

const prisma = new PrismaClient();

export class MenuService {
  // Menu CRUD operations
  async getMenus(): Promise<Menu[]> {
    return await prisma.menu.findMany({
      include: {
        items: {
          orderBy: { position: 'asc' }
        },
        locations: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getMenuById(id: number): Promise<MenuWithItems | null> {
    return await prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { position: 'asc' }
        },
        locations: true
      }
    });
  }

  async createMenu(data: CreateMenuRequest): Promise<Menu> {
    const slug = data.slug || this.generateSlug(data.name);
    return await prisma.menu.create({
      data: {
        name: data.name,
        slug,
        status: data.status || 'published'
      }
    });
  }

  async updateMenu(id: number, data: UpdateMenuRequest): Promise<Menu> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.slug) updateData.slug = data.slug;
    if (data.status) updateData.status = data.status;

    return await prisma.menu.update({
      where: { id },
      data: updateData
    });
  }

  async deleteMenu(id: number): Promise<void> {
    await prisma.menu.delete({
      where: { id }
    });
  }

  // Menu Item CRUD operations
  async getMenuItems(menuId: number): Promise<MenuItem[]> {
    return await prisma.menuItem.findMany({
      where: { menu_id: menuId },
      orderBy: { position: 'asc' }
    });
  }

  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    // Get max position for this menu/parent combination
    const maxPosition = await this.getMaxPosition(data.menu_id, data.parent_id || 0);
    const position = data.position !== undefined ? data.position : maxPosition + 1;

    return await prisma.menuItem.create({
      data: {
        menu_id: data.menu_id,
        parent_id: data.parent_id || 0,
        title: data.title,
        url: data.url,
        target: data.target || '_self',
        icon_class: data.icon_class,
        css_class: data.css_class,
        position
      }
    });
  }

  async updateMenuItem(id: number, data: UpdateMenuItemRequest): Promise<MenuItem> {
    const updateData: any = {};
    if (data.parent_id !== undefined) updateData.parent_id = data.parent_id;
    if (data.title) updateData.title = data.title;
    if (data.url) updateData.url = data.url;
    if (data.target) updateData.target = data.target;
    if (data.icon_class !== undefined) updateData.icon_class = data.icon_class;
    if (data.css_class !== undefined) updateData.css_class = data.css_class;
    if (data.position !== undefined) updateData.position = data.position;

    return await prisma.menuItem.update({
      where: { id },
      data: updateData
    });
  }

  async deleteMenuItem(id: number): Promise<void> {
    await prisma.menuItem.delete({
      where: { id }
    });
  }

  async reorderMenuItems(menuId: number, items: { id: number; parent_id: number; position: number }[]): Promise<void> {
    const updates = items.map(item =>
      prisma.menuItem.update({
        where: { id: item.id },
        data: {
          parent_id: item.parent_id,
          position: item.position
        }
      })
    );

    await prisma.$transaction(updates);
  }

  // Menu Location CRUD operations
  async getMenuLocations(): Promise<MenuLocation[]> {
    return await prisma.menuLocation.findMany({
      include: {
        menu: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async createMenuLocation(data: CreateMenuLocationRequest): Promise<MenuLocation> {
    return await prisma.menuLocation.create({
      data: {
        name: data.name,
        location: data.location,
        menu_id: data.menu_id
      }
    });
  }

  async updateMenuLocation(id: number, data: UpdateMenuLocationRequest): Promise<MenuLocation> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.location) updateData.location = data.location;
    if (data.menu_id !== undefined) updateData.menu_id = data.menu_id;

    return await prisma.menuLocation.update({
      where: { id },
      data: updateData
    });
  }

  async deleteMenuLocation(id: number): Promise<void> {
    await prisma.menuLocation.delete({
      where: { id }
    });
  }

  // Helper methods
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async getMaxPosition(menuId: number, parentId: number): Promise<number> {
    const result = await prisma.menuItem.findFirst({
      where: {
        menu_id: menuId,
        parent_id: parentId
      },
      orderBy: { position: 'desc' },
      select: { position: true }
    });

    return result?.position || 0;
  }

  // Build hierarchical menu structure
  buildHierarchicalMenu(items: MenuItem[]): HierarchicalMenuItem[] {
    const itemMap = new Map<number, HierarchicalMenuItem>();
    const roots: HierarchicalMenuItem[] = [];

    // Convert items to hierarchical format
    items.forEach(item => {
      const hierarchicalItem: HierarchicalMenuItem = {
        ...item,
        children: [],
        depth: 0
      };
      itemMap.set(item.id, hierarchicalItem);
    });

    // Build hierarchy
    items.forEach(item => {
      const hierarchicalItem = itemMap.get(item.id)!;

      if (item.parent_id && item.parent_id !== 0) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(hierarchicalItem);
          hierarchicalItem.depth = parent.depth + 1;
        } else {
          // Orphan item, treat as root
          roots.push(hierarchicalItem);
        }
      } else {
        roots.push(hierarchicalItem);
      }
    });

    // Sort children by position
    const sortByPosition = (a: HierarchicalMenuItem, b: HierarchicalMenuItem) => a.position - b.position;

    roots.sort(sortByPosition);
    roots.forEach(root => {
      this.sortChildrenRecursive(root, sortByPosition);
    });

    return roots;
  }

  private sortChildrenRecursive(item: HierarchicalMenuItem, sortFn: (a: HierarchicalMenuItem, b: HierarchicalMenuItem) => number): void {
    item.children.sort(sortFn);
    item.children.forEach(child => this.sortChildrenRecursive(child, sortFn));
  }

  // Get menu for frontend rendering
  async getMenuForLocation(location: string): Promise<MenuWithItems | null> {
    const menuLocation = await prisma.menuLocation.findUnique({
      where: { location },
      include: {
        menu: {
          include: {
            items: {
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    return menuLocation?.menu || null;
  }
}
