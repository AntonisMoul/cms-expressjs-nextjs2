import { PrismaClient } from '@prisma/client';
import {
  Widget,
  WidgetSetting,
  Sidebar,
  WidgetType,
  WidgetConfig,
  CreateWidgetRequest,
  UpdateWidgetRequest,
  CreateSidebarRequest,
  UpdateSidebarRequest,
  WidgetWithConfig
} from '../models/types';

const prisma = new PrismaClient();

export class WidgetService {
  // Widget CRUD operations
  async getWidgets(sidebarId?: number): Promise<Widget[]> {
    const where = sidebarId ? { sidebar_id: sidebarId } : {};
    return await prisma.widget.findMany({
      where,
      include: {
        settings: true
      },
      orderBy: { position: 'asc' }
    });
  }

  async getWidgetById(id: number): Promise<Widget | null> {
    return await prisma.widget.findUnique({
      where: { id },
      include: {
        settings: true
      }
    });
  }

  async createWidget(data: CreateWidgetRequest): Promise<Widget> {
    const position = data.position !== undefined ? data.position : await this.getNextPosition(data.sidebar_id);

    return await prisma.widget.create({
      data: {
        name: data.name,
        widget_type: data.widget_type,
        sidebar_id: data.sidebar_id,
        position,
        status: data.status || 'active'
      }
    });
  }

  async updateWidget(id: number, data: UpdateWidgetRequest): Promise<Widget> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.sidebar_id !== undefined) updateData.sidebar_id = data.sidebar_id;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.status) updateData.status = data.status;

    return await prisma.widget.update({
      where: { id },
      data: updateData,
      include: {
        settings: true
      }
    });
  }

  async deleteWidget(id: number): Promise<void> {
    await prisma.widget.delete({
      where: { id }
    });
  }

  async reorderWidgets(sidebarId: number, widgetIds: number[]): Promise<void> {
    const updates = widgetIds.map((id, index) =>
      prisma.widget.update({
        where: { id },
        data: { position: index }
      })
    );

    await prisma.$transaction(updates);
  }

  // Widget Settings operations
  async getWidgetSettings(widgetId: number): Promise<WidgetSetting[]> {
    return await prisma.widgetSetting.findMany({
      where: { widget_id: widgetId },
      orderBy: { key: 'asc' }
    });
  }

  async updateWidgetSettings(widgetId: number, settings: Record<string, any>): Promise<void> {
    // Delete existing settings
    await prisma.widgetSetting.deleteMany({
      where: { widget_id: widgetId }
    });

    // Create new settings
    const settingCreates = Object.entries(settings).map(([key, value]) =>
      prisma.widgetSetting.create({
        data: {
          widget_id: widgetId,
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value)
        }
      })
    );

    await prisma.$transaction(settingCreates);
  }

  async getWidgetWithConfig(id: number): Promise<WidgetWithConfig | null> {
    const widget = await this.getWidgetById(id);
    if (!widget) return null;

    const settings = await this.getWidgetSettings(id);
    const config = this.buildConfigFromSettings(widget.widget_type as WidgetType, settings);

    return {
      ...widget,
      config
    };
  }

  // Sidebar CRUD operations
  async getSidebars(): Promise<Sidebar[]> {
    return await prisma.sidebar.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async getSidebarById(id: number): Promise<Sidebar | null> {
    return await prisma.sidebar.findUnique({
      where: { id }
    });
  }

  async getSidebarByLocation(location: string): Promise<Sidebar | null> {
    return await prisma.sidebar.findUnique({
      where: { location }
    });
  }

  async createSidebar(data: CreateSidebarRequest): Promise<Sidebar> {
    return await prisma.sidebar.create({
      data: {
        name: data.name,
        location: data.location,
        description: data.description,
        theme: data.theme,
        status: data.status || 'active'
      }
    });
  }

  async updateSidebar(id: number, data: UpdateSidebarRequest): Promise<Sidebar> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.location) updateData.location = data.location;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.status) updateData.status = data.status;

    return await prisma.sidebar.update({
      where: { id },
      data: updateData
    });
  }

  async deleteSidebar(id: number): Promise<void> {
    await prisma.sidebar.delete({
      where: { id }
    });
  }

  // Get widgets for a sidebar location (for frontend rendering)
  async getWidgetsForSidebar(location: string): Promise<WidgetWithConfig[]> {
    const sidebar = await this.getSidebarByLocation(location);
    if (!sidebar) return [];

    const widgets = await this.getWidgets(sidebar.id);
    const widgetsWithConfig: WidgetWithConfig[] = [];

    for (const widget of widgets) {
      if (widget.status !== 'active') continue;

      const settings = await this.getWidgetSettings(widget.id);
      const config = this.buildConfigFromSettings(widget.widget_type as WidgetType, settings);

      widgetsWithConfig.push({
        ...widget,
        config
      });
    }

    return widgetsWithConfig;
  }

  // Helper methods
  private async getNextPosition(sidebarId?: number): Promise<number> {
    if (!sidebarId) return 0;

    const lastWidget = await prisma.widget.findFirst({
      where: { sidebar_id: sidebarId },
      orderBy: { position: 'desc' },
      select: { position: true }
    });

    return lastWidget ? lastWidget.position + 1 : 0;
  }

  private buildConfigFromSettings(widgetType: WidgetType, settings: WidgetSetting[]): WidgetConfig {
    const config: any = {};

    settings.forEach(setting => {
      try {
        // Try to parse as JSON first, fall back to string
        config[setting.key] = setting.value ? JSON.parse(setting.value) : setting.value;
      } catch {
        config[setting.key] = setting.value;
      }
    });

    // Set defaults based on widget type
    switch (widgetType) {
      case WidgetType.TEXT:
        config.content = config.content || '';
        break;
      case WidgetType.MENU:
        config.menu_id = config.menu_id || null;
        break;
      case WidgetType.RECENT_POSTS:
        config.limit = config.limit || 5;
        config.show_excerpt = config.show_excerpt ?? true;
        config.show_date = config.show_date ?? true;
        config.show_author = config.show_author ?? false;
        break;
      case WidgetType.CATEGORIES:
        config.show_post_count = config.show_post_count ?? true;
        config.hierarchical = config.hierarchical ?? true;
        break;
      case WidgetType.TAGS:
        config.limit = config.limit || 10;
        config.show_post_count = config.show_post_count ?? true;
        break;
      case WidgetType.CUSTOM_HTML:
        config.html = config.html || '';
        break;
      case WidgetType.IMAGE:
        config.image_url = config.image_url || '';
        config.alt_text = config.alt_text || '';
        break;
      case WidgetType.VIDEO:
        config.video_url = config.video_url || '';
        config.autoplay = config.autoplay ?? false;
        config.controls = config.controls ?? true;
        break;
      case WidgetType.SEARCH:
        config.placeholder = config.placeholder || 'Search...';
        break;
    }

    return config;
  }

  // Validate widget config
  validateWidgetConfig(widgetType: WidgetType, config: WidgetConfig): boolean {
    // Basic validation - could be enhanced with Zod schemas
    switch (widgetType) {
      case WidgetType.TEXT:
        return typeof (config as any).content === 'string';
      case WidgetType.MENU:
        return typeof (config as any).menu_id === 'number';
      case WidgetType.RECENT_POSTS:
        return typeof (config as any).limit === 'number';
      case WidgetType.CUSTOM_HTML:
        return typeof (config as any).html === 'string';
      default:
        return true;
    }
  }
}
