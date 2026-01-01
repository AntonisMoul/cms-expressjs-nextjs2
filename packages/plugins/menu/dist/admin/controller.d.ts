import { Request, Response } from 'express';
export declare class MenuAdminController {
    static getMenus(req: Request, res: Response): Promise<void>;
    static createMenu(req: Request, res: Response): Promise<any>;
    static getMenu(req: Request, res: Response): Promise<any>;
    static updateMenu(req: Request, res: Response): Promise<any>;
    static deleteMenu(req: Request, res: Response): Promise<any>;
    static createMenuNode(req: Request, res: Response): Promise<void>;
    static updateMenuNode(req: Request, res: Response): Promise<void>;
    static deleteMenuNode(req: Request, res: Response): Promise<any>;
    static reorderMenuNodes(req: Request, res: Response): Promise<void>;
    static assignMenuToLocation(req: Request, res: Response): Promise<void>;
    static removeMenuFromLocation(req: Request, res: Response): Promise<void>;
    static getLocations(req: Request, res: Response): Promise<void>;
    static getMenuStructure(req: Request, res: Response): Promise<void>;
    static getMenuByLocation(req: Request, res: Response): Promise<any>;
}
//# sourceMappingURL=controller.d.ts.map