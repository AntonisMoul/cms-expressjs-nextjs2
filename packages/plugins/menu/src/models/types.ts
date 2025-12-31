import { Menu as PrismaMenu, MenuItem as PrismaMenuItem, MenuLocation as PrismaMenuLocation } from '@prisma/client';

export type Menu = PrismaMenu & {
  items?: MenuItem[];
  locations?: MenuLocation[];
};

export type MenuItem = PrismaMenuItem & {
  children?: MenuItem[];
};

export type MenuLocation = PrismaMenuLocation & {
  menu?: Menu | null;
};

export type MenuWithItems = Menu & {
  items: MenuItem[];
};

export type MenuItemWithChildren = MenuItem & {
  children: MenuItem[];
};

export type MenuLocationWithMenu = MenuLocation & {
  menu?: Menu;
};

// API request/response types
export interface CreateMenuRequest {
  name: string;
  slug?: string;
  status?: string;
}

export interface UpdateMenuRequest {
  name?: string;
  slug?: string;
  status?: string;
}

export interface CreateMenuItemRequest {
  menu_id: number;
  parent_id?: number;
  title: string;
  url: string;
  target?: string;
  icon_class?: string;
  css_class?: string;
  position?: number;
}

export interface UpdateMenuItemRequest {
  parent_id?: number;
  title?: string;
  url?: string;
  target?: string;
  icon_class?: string;
  css_class?: string;
  position?: number;
}

export interface CreateMenuLocationRequest {
  name: string;
  location: string;
  menu_id?: number;
}

export interface UpdateMenuLocationRequest {
  name?: string;
  location?: string;
  menu_id?: number;
}

// Hierarchical menu item for frontend
export interface HierarchicalMenuItem extends MenuItem {
  children: HierarchicalMenuItem[];
  depth: number;
}
