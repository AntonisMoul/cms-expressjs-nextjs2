import { Request, Response } from 'express';
export declare class WidgetAdminController {
    static getWidgets(req: Request, res: Response): Promise<void>;
    static createWidget(req: Request, res: Response): Promise<void>;
    static getWidget(req: Request, res: Response): Promise<any>;
    static updateWidget(req: Request, res: Response): Promise<void>;
    static deleteWidget(req: Request, res: Response): Promise<any>;
    static getWidgetTypes(req: Request, res: Response): Promise<void>;
    static getWidgetGroups(req: Request, res: Response): Promise<void>;
    static getSidebars(req: Request, res: Response): Promise<void>;
    static getSidebarWidgets(req: Request, res: Response): Promise<void>;
    static reorderWidgets(req: Request, res: Response): Promise<void>;
    static moveWidget(req: Request, res: Response): Promise<void>;
    static cloneWidget(req: Request, res: Response): Promise<void>;
    static bulkDelete(req: Request, res: Response): Promise<any>;
    static bulkMove(req: Request, res: Response): Promise<any>;
}
//# sourceMappingURL=controller.d.ts.map