import { Request, Response } from 'express';
export declare class MenuPublicController {
    static getMenuByLocation(req: Request, res: Response): Promise<any>;
    static getMenuStructure(req: Request, res: Response): Promise<void>;
    static getAllMenus(req: Request, res: Response): Promise<void>;
    static renderMenu(req: Request, res: Response): Promise<any>;
    private static buildMenuHtml;
    static getBreadcrumbs(req: Request, res: Response): Promise<any>;
    private static buildBreadcrumbTrail;
}
//# sourceMappingURL=controller.d.ts.map