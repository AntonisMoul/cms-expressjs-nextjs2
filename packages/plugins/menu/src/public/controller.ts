import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { MenuService } from '../service';

const prisma = new PrismaClient();
const menuService = new MenuService(prisma);

export class MenuPublicController {
  static async getMenuByLocation(req: Request, res: Response) {
    try {
      const { location } = req.params;
      const menu = await menuService.getMenuByLocation(location);

      if (!menu) {
        return res.json({
          success: true,
          data: { menu: null },
        });
      }

      res.json({
        success: true,
        data: { menu },
      });
    } catch (error) {
      console.error('Get menu by location error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getMenuStructure(req: Request, res: Response) {
    try {
      const { menuId } = req.params;
      const structure = await menuService.buildMenuStructure(menuId);

      res.json({
        success: true,
        data: { structure },
      });
    } catch (error) {
      console.error('Get menu structure error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  static async getAllMenus(req: Request, res: Response) {
    try {
      const menus = await menuService.getAllMenus();

      // Filter only published menus for public access
      const publishedMenus = menus.filter(menu => menu.status === 'published');

      res.json({
        success: true,
        data: { menus: publishedMenus },
      });
    } catch (error) {
      console.error('Get all menus error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Get menu HTML structure (useful for direct rendering)
  static async renderMenu(req: Request, res: Response) {
    try {
      const { location } = req.params;
      const menu = await menuService.getMenuByLocation(location);

      if (!menu) {
        return res.json({
          success: true,
          data: { html: '' },
        });
      }

      const structure = await menuService.buildMenuStructure(menu.id);
      const html = this.buildMenuHtml(structure);

      res.json({
        success: true,
        data: { html, menu },
      });
    } catch (error) {
      console.error('Render menu error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  private static buildMenuHtml(nodes: any[], level = 0): string {
    if (!nodes || nodes.length === 0) return '';

    const indent = '  '.repeat(level);
    let html = '';

    if (level === 0) {
      html += '<ul class="menu">\n';
    } else {
      html += `${indent}<ul class="submenu">\n`;
    }

    for (const node of nodes) {
      const classes = ['menu-item'];
      if (node.cssClass) classes.push(node.cssClass);
      if (node.hasChild) classes.push('menu-item-has-children');

      const classAttr = classes.length > 0 ? ` class="${classes.join(' ')}"` : '';
      const titleAttr = node.title ? ` title="${node.title}"` : '';
      const targetAttr = node.target && node.target !== '_self' ? ` target="${node.target}"` : '';

      html += `${indent}  <li${classAttr}>\n`;

      if (node.url) {
        html += `${indent}    <a href="${node.url}"${titleAttr}${targetAttr}>\n`;
        if (node.iconFont) {
          html += `${indent}      <i class="${node.iconFont}"></i>\n`;
        }
        html += `${indent}      ${node.title || 'Menu Item'}\n`;
        html += `${indent}    </a>\n`;
      } else {
        html += `${indent}    <span${titleAttr}>\n`;
        if (node.iconFont) {
          html += `${indent}      <i class="${node.iconFont}"></i>\n`;
        }
        html += `${indent}      ${node.title || 'Menu Item'}\n`;
        html += `${indent}    </span>\n`;
      }

      if (node.children && node.children.length > 0) {
        html += this.buildMenuHtml(node.children, level + 1);
      }

      html += `${indent}  </li>\n`;
    }

    html += `${indent}</ul>\n`;

    return html;
  }

  // Get breadcrumb trail for current page
  static async getBreadcrumbs(req: Request, res: Response) {
    try {
      const { menuId, currentUrl } = req.query;
      const menu = await menuService.getMenuWithNodes(menuId as string);

      if (!menu) {
        return res.json({
          success: true,
          data: { breadcrumbs: [] },
        });
      }

      // Find the current menu item based on URL
      const currentNode = menu.nodes.find(node => node.url === currentUrl);

      if (!currentNode) {
        return res.json({
          success: true,
          data: { breadcrumbs: [] },
        });
      }

      // Build breadcrumb trail
      const breadcrumbs = this.buildBreadcrumbTrail(menu.nodes, currentNode.id);

      res.json({
        success: true,
        data: { breadcrumbs },
      });
    } catch (error) {
      console.error('Get breadcrumbs error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  private static buildBreadcrumbTrail(nodes: any[], nodeId: string): any[] {
    const breadcrumbs = [];
    let currentNode = nodes.find(node => node.id === nodeId);

    while (currentNode) {
      breadcrumbs.unshift({
        id: currentNode.id,
        title: currentNode.title,
        url: currentNode.url,
      });

      if (currentNode.parentId === '0') break;

      currentNode = nodes.find(node => node.id === currentNode.parentId);
    }

    return breadcrumbs;
  }
}