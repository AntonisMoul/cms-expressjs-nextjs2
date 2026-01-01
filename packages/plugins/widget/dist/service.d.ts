import { PrismaClient } from '@prisma/client';
import { Widget, CreateWidgetRequest, UpdateWidgetRequest, WidgetGroup, WidgetType } from '@cms/core';
export declare class WidgetService {
    private prisma;
    private widgetTypes;
    private widgetGroups;
    constructor(prisma: PrismaClient);
    createWidget(data: CreateWidgetRequest): Promise<Widget>;
    updateWidget(id: string, data: UpdateWidgetRequest): Promise<Widget>;
    deleteWidget(id: string): Promise<void>;
    getWidgetById(id: string): Promise<Widget | null>;
    getWidgetsBySidebar(sidebarId: string, theme?: string): Promise<Widget[]>;
    getAllWidgets(theme?: string): Promise<Widget[]>;
    reorderWidgets(sidebarId: string, widgetIds: string[], theme?: string): Promise<void>;
    moveWidget(widgetId: string, newSidebarId: string, newPosition?: number): Promise<Widget>;
    registerWidgetType(widgetType: WidgetType): void;
    getWidgetType(widgetId: string): WidgetType | undefined;
    getAllWidgetTypes(): WidgetType[];
    registerWidgetGroup(group: WidgetGroup): void;
    getWidgetGroup(groupId: string): WidgetGroup | undefined;
    getAllWidgetGroups(): WidgetGroup[];
    getWidgetsByGroup(groupId: string): WidgetType[];
    renderWidget(widget: Widget): Promise<string>;
    private renderWidgetContent;
    getAvailableSidebars(): Array<{
        id: string;
        name: string;
        description?: string;
    }>;
    getSidebarWidgets(sidebarId: string, theme?: string): Promise<Array<{
        widget: Widget;
        html: string;
    }>>;
    cloneWidget(widgetId: string, targetSidebarId: string, targetTheme?: string): Promise<Widget>;
    deleteWidgets(widgetIds: string[]): Promise<void>;
    moveWidgetsToSidebar(widgetIds: string[], targetSidebarId: string, targetTheme?: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map