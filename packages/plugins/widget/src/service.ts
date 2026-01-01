import { PrismaClient } from '@prisma/client';
import { Widget, CreateWidgetRequest, UpdateWidgetRequest, WidgetGroup, WidgetType } from '@cms/core';

export class WidgetService {
  private widgetTypes: Map<string, WidgetType> = new Map();
  private widgetGroups: Map<string, WidgetGroup> = new Map();

  constructor(private prisma: PrismaClient) {}

  // Widget CRUD operations
  async createWidget(data: CreateWidgetRequest): Promise<Widget> {
    const widget = await this.prisma.widget.create({
      data: {
        widgetId: data.widgetId,
        sidebarId: data.sidebarId,
        theme: data.theme || 'default',
        position: data.position || 0,
        data: data.data || {},
      },
    });

    return {
      id: widget.id,
      widgetId: widget.widgetId,
      sidebarId: widget.sidebarId,
      theme: widget.theme,
      position: widget.position,
      data: widget.data || undefined,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
    };
  }

  async updateWidget(id: string, data: UpdateWidgetRequest): Promise<Widget> {
    const updateData: any = {};

    if (data.widgetId !== undefined) updateData.widgetId = data.widgetId;
    if (data.sidebarId !== undefined) updateData.sidebarId = data.sidebarId;
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.data !== undefined) updateData.data = data.data;

    const widget = await this.prisma.widget.update({
      where: { id },
      data: updateData,
    });

    return {
      id: widget.id,
      widgetId: widget.widgetId,
      sidebarId: widget.sidebarId,
      theme: widget.theme,
      position: widget.position,
      data: widget.data || undefined,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
    };
  }

  async deleteWidget(id: string): Promise<void> {
    await this.prisma.widget.delete({
      where: { id },
    });
  }

  async getWidgetById(id: string): Promise<Widget | null> {
    const widget = await this.prisma.widget.findUnique({
      where: { id },
    });

    if (!widget) return null;

    return {
      id: widget.id,
      widgetId: widget.widgetId,
      sidebarId: widget.sidebarId,
      theme: widget.theme,
      position: widget.position,
      data: widget.data || undefined,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
    };
  }

  async getWidgetsBySidebar(sidebarId: string, theme = 'default'): Promise<Widget[]> {
    const widgets = await this.prisma.widget.findMany({
      where: {
        sidebarId,
        theme,
      },
      orderBy: { position: 'asc' },
    });

    return widgets.map(widget => ({
      id: widget.id,
      widgetId: widget.widgetId,
      sidebarId: widget.sidebarId,
      theme: widget.theme,
      position: widget.position,
      data: widget.data || undefined,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
    }));
  }

  async getAllWidgets(theme = 'default'): Promise<Widget[]> {
    const widgets = await this.prisma.widget.findMany({
      where: { theme },
      orderBy: [
        { sidebarId: 'asc' },
        { position: 'asc' },
      ],
    });

    return widgets.map(widget => ({
      id: widget.id,
      widgetId: widget.widgetId,
      sidebarId: widget.sidebarId,
      theme: widget.theme,
      position: widget.position,
      data: widget.data || undefined,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
    }));
  }

  async reorderWidgets(sidebarId: string, widgetIds: string[], theme = 'default'): Promise<void> {
    // Update positions in a transaction
    await this.prisma.$transaction(
      widgetIds.map((widgetId, index) =>
        this.prisma.widget.update({
          where: { id: widgetId },
          data: { position: index },
        })
      )
    );
  }

  async moveWidget(widgetId: string, newSidebarId: string, newPosition?: number): Promise<Widget> {
    const updateData: any = { sidebarId: newSidebarId };

    if (newPosition !== undefined) {
      updateData.position = newPosition;
    }

    const widget = await this.prisma.widget.update({
      where: { id: widgetId },
      data: updateData,
    });

    return {
      id: widget.id,
      widgetId: widget.widgetId,
      sidebarId: widget.sidebarId,
      theme: widget.theme,
      position: widget.position,
      data: widget.data || undefined,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
    };
  }

  // Widget type management
  registerWidgetType(widgetType: WidgetType): void {
    this.widgetTypes.set(widgetType.id, widgetType);
  }

  getWidgetType(widgetId: string): WidgetType | undefined {
    return this.widgetTypes.get(widgetId);
  }

  getAllWidgetTypes(): WidgetType[] {
    return Array.from(this.widgetTypes.values());
  }

  // Widget group management
  registerWidgetGroup(group: WidgetGroup): void {
    this.widgetGroups.set(group.id, group);
  }

  getWidgetGroup(groupId: string): WidgetGroup | undefined {
    return this.widgetGroups.get(groupId);
  }

  getAllWidgetGroups(): WidgetGroup[] {
    return Array.from(this.widgetGroups.values());
  }

  getWidgetsByGroup(groupId: string): WidgetType[] {
    const group = this.widgetGroups.get(groupId);
    return group ? group.widgets : [];
  }

  // Render widget content
  async renderWidget(widget: Widget): Promise<string> {
    const widgetType = this.getWidgetType(widget.widgetId);

    if (!widgetType) {
      return `<div class="widget-error">Widget type "${widget.widgetId}" not found</div>`;
    }

    try {
      // This would typically call a render method on the widget type
      // For now, return a basic HTML structure
      return `<div class="widget widget-${widget.widgetId}" data-widget-id="${widget.id}">
        <h3 class="widget-title">${widgetType.name}</h3>
        <div class="widget-content">
          ${this.renderWidgetContent(widgetType, widget.data)}
        </div>
      </div>`;
    } catch (error) {
      console.error(`Error rendering widget ${widget.id}:`, error);
      return `<div class="widget-error">Error rendering widget</div>`;
    }
  }

  private renderWidgetContent(widgetType: WidgetType, data?: any): string {
    // Basic content rendering - this would be expanded for each widget type
    if (!data) return '<p>Widget content</p>';

    let content = '';

    // Render based on common data fields
    if (data.title) {
      content += `<h4>${data.title}</h4>`;
    }

    if (data.content) {
      content += `<div>${data.content}</div>`;
    }

    if (data.text) {
      content += `<p>${data.text}</p>`;
    }

    if (data.image) {
      content += `<img src="${data.image}" alt="${data.title || ''}" />`;
    }

    if (data.link) {
      content += `<a href="${data.link.url}">${data.link.text || 'Learn More'}</a>`;
    }

    return content || '<p>Widget content</p>';
  }

  // Get available sidebars
  getAvailableSidebars(): Array<{ id: string; name: string; description?: string }> {
    return [
      {
        id: 'primary_sidebar',
        name: 'Primary Sidebar',
        description: 'Main sidebar for content pages',
      },
      {
        id: 'footer_1',
        name: 'Footer Column 1',
        description: 'First footer widget area',
      },
      {
        id: 'footer_2',
        name: 'Footer Column 2',
        description: 'Second footer widget area',
      },
      {
        id: 'footer_3',
        name: 'Footer Column 3',
        description: 'Third footer widget area',
      },
      {
        id: 'footer_4',
        name: 'Footer Column 4',
        description: 'Fourth footer widget area',
      },
    ];
  }

  // Get sidebar widgets with rendered content
  async getSidebarWidgets(sidebarId: string, theme = 'default'): Promise<Array<{ widget: Widget; html: string }>> {
    const widgets = await this.getWidgetsBySidebar(sidebarId, theme);

    const renderedWidgets = await Promise.all(
      widgets.map(async (widget) => ({
        widget,
        html: await this.renderWidget(widget),
      }))
    );

    return renderedWidgets;
  }

  // Clone widget to another sidebar
  async cloneWidget(widgetId: string, targetSidebarId: string, targetTheme = 'default'): Promise<Widget> {
    const sourceWidget = await this.getWidgetById(widgetId);

    if (!sourceWidget) {
      throw new Error('Source widget not found');
    }

    return this.createWidget({
      widgetId: sourceWidget.widgetId,
      sidebarId: targetSidebarId,
      theme: targetTheme,
      position: 0, // Will be set by reorderWidgets
      data: sourceWidget.data,
    });
  }

  // Bulk operations
  async deleteWidgets(widgetIds: string[]): Promise<void> {
    await this.prisma.widget.deleteMany({
      where: { id: { in: widgetIds } },
    });
  }

  async moveWidgetsToSidebar(widgetIds: string[], targetSidebarId: string, targetTheme = 'default'): Promise<void> {
    await this.prisma.widget.updateMany({
      where: { id: { in: widgetIds } },
      data: {
        sidebarId: targetSidebarId,
        theme: targetTheme,
        position: 0, // Will be reordered after
      },
    });
  }
}