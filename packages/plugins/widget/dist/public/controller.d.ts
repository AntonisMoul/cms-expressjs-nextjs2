import { Request, Response } from 'express';
export declare class WidgetPublicController {
    static getSidebarWidgets(req: Request, res: Response): Promise<void>;
    static renderSidebar(req: Request, res: Response): Promise<void>;
    static getWidgetHtml(req: Request, res: Response): Promise<any>;
    private static generateSidebarHtml;
}
//# sourceMappingURL=controller.d.ts.map