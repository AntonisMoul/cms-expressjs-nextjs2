import { PrismaClient } from '@prisma/client';
import { Menu, MenuNode, MenuLocation, MenuWithNodes, CreateMenuRequest, UpdateMenuRequest, CreateMenuNodeRequest, UpdateMenuNodeRequest } from '@cms/core';

export class MenuService {
  constructor(private prisma: PrismaClient) {}

  // Menu operations
  async createMenu(data: CreateMenuRequest): Promise<Menu> {
    const slug = data.slug || this.slugify(data.name);

    const menu = await this.prisma.menu.create({
      data: {
        name: data.name,
        slug,
        status: data.status || 'published',
      },
    });

    return {
      id: menu.id,
      name: menu.name,
      slug: menu.slug,
      status: menu.status,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  async updateMenu(id: string, data: UpdateMenuRequest): Promise<Menu> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug || this.slugify(data.name!);
    if (data.status !== undefined) updateData.status = data.status;

    const menu = await this.prisma.menu.update({
      where: { id },
      data: updateData,
    });

    return {
      id: menu.id,
      name: menu.name,
      slug: menu.slug,
      status: menu.status,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  async deleteMenu(id: string): Promise<void> {
    // Delete all associated nodes and locations
    await this.prisma.menuNode.deleteMany({
      where: { menuId: id },
    });

    await this.prisma.menuLocation.deleteMany({
      where: { menuId: id },
    });

    await this.prisma.menu.delete({
      where: { id },
    });
  }

  async getMenuById(id: string): Promise<Menu | null> {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) return null;

    return {
      id: menu.id,
      name: menu.name,
      slug: menu.slug,
      status: menu.status,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  async getMenuWithNodes(id: string): Promise<MenuWithNodes | null> {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        nodes: {
          orderBy: [
            { parentId: 'asc' },
            { position: 'asc' },
          ],
        },
        locations: true,
      },
    });

    if (!menu) return null;

    return {
      id: menu.id,
      name: menu.name,
      slug: menu.slug,
      status: menu.status,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
      nodes: menu.nodes.map(node => ({
        id: node.id,
        menuId: node.menuId,
        parentId: node.parentId,
        referenceId: node.referenceId,
        referenceType: node.referenceType,
        url: node.url,
        iconFont: node.iconFont,
        position: node.position,
        title: node.title,
        cssClass: node.cssClass,
        target: node.target,
        hasChild: node.hasChild,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      })),
      locations: menu.locations.map(location => ({
        id: location.id,
        menuId: location.menuId,
        location: location.location,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
      })),
    };
  }

  async getAllMenus(): Promise<Menu[]> {
    const menus = await this.prisma.menu.findMany({
      orderBy: { name: 'asc' },
    });

    return menus.map(menu => ({
      id: menu.id,
      name: menu.name,
      slug: menu.slug,
      status: menu.status,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    }));
  }

  // Menu node operations
  async createMenuNode(data: CreateMenuNodeRequest): Promise<MenuNode> {
    const node = await this.prisma.menuNode.create({
      data: {
        menuId: data.menuId,
        parentId: data.parentId || '0',
        referenceId: data.referenceId,
        referenceType: data.referenceType,
        url: data.url,
        iconFont: data.iconFont,
        position: data.position || 0,
        title: data.title,
        cssClass: data.cssClass,
        target: data.target || '_self',
      },
    });

    // Update parent hasChild status
    if (data.parentId && data.parentId !== '0') {
      await this.updateParentHasChild(data.parentId);
    }

    return {
      id: node.id,
      menuId: node.menuId,
      parentId: node.parentId,
      referenceId: node.referenceId,
      referenceType: node.referenceType,
      url: node.url,
      iconFont: node.iconFont,
      position: node.position,
      title: node.title,
      cssClass: node.cssClass,
      target: node.target,
      hasChild: node.hasChild,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
    };
  }

  async updateMenuNode(id: string, data: UpdateMenuNodeRequest): Promise<MenuNode> {
    const updateData: any = {};

    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.referenceId !== undefined) updateData.referenceId = data.referenceId;
    if (data.referenceType !== undefined) updateData.referenceType = data.referenceType;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.iconFont !== undefined) updateData.iconFont = data.iconFont;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.cssClass !== undefined) updateData.cssClass = data.cssClass;
    if (data.target !== undefined) updateData.target = data.target;

    const node = await this.prisma.menuNode.update({
      where: { id },
      data: updateData,
    });

    // Update hasChild status for affected parents
    if (data.parentId !== undefined) {
      await this.updateParentHasChild(data.parentId);
      // Also update the old parent if it changed
      const oldNode = await this.prisma.menuNode.findUnique({
        where: { id },
      });
      if (oldNode && oldNode.parentId !== data.parentId) {
        await this.updateParentHasChild(oldNode.parentId);
      }
    }

    return {
      id: node.id,
      menuId: node.menuId,
      parentId: node.parentId,
      referenceId: node.referenceId,
      referenceType: node.referenceType,
      url: node.url,
      iconFont: node.iconFont,
      position: node.position,
      title: node.title,
      cssClass: node.cssClass,
      target: node.target,
      hasChild: node.hasChild,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
    };
  }

  async deleteMenuNode(id: string): Promise<void> {
    const node = await this.prisma.menuNode.findUnique({
      where: { id },
    });

    if (!node) return;

    // Get all child nodes to delete them too
    const childNodes = await this.prisma.menuNode.findMany({
      where: { parentId: id },
    });

    // Delete child nodes recursively
    for (const child of childNodes) {
      await this.deleteMenuNode(child.id);
    }

    // Delete the node
    await this.prisma.menuNode.delete({
      where: { id },
    });

    // Update parent hasChild status
    if (node.parentId !== '0') {
      await this.updateParentHasChild(node.parentId);
    }
  }

  async reorderMenuNodes(menuId: string, nodeOrders: Array<{ id: string; parentId: string; position: number }>): Promise<void> {
    // Update all nodes in a transaction
    await this.prisma.$transaction(
      nodeOrders.map(order =>
        this.prisma.menuNode.update({
          where: { id: order.id },
          data: {
            parentId: order.parentId,
            position: order.position,
          },
        })
      )
    );

    // Update hasChild status for all affected parents
    const affectedParentIds = [...new Set(nodeOrders.map(order => order.parentId))];
    for (const parentId of affectedParentIds) {
      if (parentId !== '0') {
        await this.updateParentHasChild(parentId);
      }
    }
  }

  // Menu location operations
  async assignMenuToLocation(menuId: string, location: string): Promise<MenuLocation> {
    // Remove existing menu from this location
    await this.prisma.menuLocation.deleteMany({
      where: { location },
    });

    const menuLocation = await this.prisma.menuLocation.create({
      data: {
        menuId,
        location,
      },
    });

    return {
      id: menuLocation.id,
      menuId: menuLocation.menuId,
      location: menuLocation.location,
      createdAt: menuLocation.createdAt,
      updatedAt: menuLocation.updatedAt,
    };
  }

  async removeMenuFromLocation(location: string): Promise<void> {
    await this.prisma.menuLocation.deleteMany({
      where: { location },
    });
  }

  async getMenuByLocation(location: string): Promise<MenuWithNodes | null> {
    const menuLocation = await this.prisma.menuLocation.findUnique({
      where: { location },
      include: {
        menu: {
          include: {
            nodes: {
              orderBy: [
                { parentId: 'asc' },
                { position: 'asc' },
              ],
            },
          },
        },
      },
    });

    if (!menuLocation) return null;

    const menu = menuLocation.menu;
    return {
      id: menu.id,
      name: menu.name,
      slug: menu.slug,
      status: menu.status,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
      nodes: menu.nodes.map(node => ({
        id: node.id,
        menuId: node.menuId,
        parentId: node.parentId,
        referenceId: node.referenceId,
        referenceType: node.referenceType,
        url: node.url,
        iconFont: node.iconFont,
        position: node.position,
        title: node.title,
        cssClass: node.cssClass,
        target: node.target,
        hasChild: node.hasChild,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      })),
      locations: [menuLocation].map(loc => ({
        id: loc.id,
        menuId: loc.menuId,
        location: loc.location,
        createdAt: loc.createdAt,
        updatedAt: loc.updatedAt,
      })),
    };
  }

  async getAllLocations(): Promise<MenuLocation[]> {
    const locations = await this.prisma.menuLocation.findMany({
      orderBy: { location: 'asc' },
    });

    return locations.map(location => ({
      id: location.id,
      menuId: location.menuId,
      location: location.location,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
    }));
  }

  // Helper methods
  private async updateParentHasChild(parentId: string): Promise<void> {
    const childCount = await this.prisma.menuNode.count({
      where: { parentId },
    });

    await this.prisma.menuNode.updateMany({
      where: { id: parentId },
      data: { hasChild: childCount > 0 },
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  // Build nested menu structure for frontend rendering
  async buildMenuStructure(menuId: string): Promise<any[]> {
    const menu = await this.getMenuWithNodes(menuId);
    if (!menu) return [];

    return this.buildNodeTree(menu.nodes, '0');
  }

  private buildNodeTree(nodes: MenuNode[], parentId: string): any[] {
    return nodes
      .filter(node => node.parentId === parentId)
      .sort((a, b) => a.position - b.position)
      .map(node => ({
        ...node,
        children: this.buildNodeTree(nodes, node.id),
      }));
  }
}