import { Request, Response } from 'express';
export declare class BlogPostsAdminController {
    static index(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<any>;
    static show(req: Request, res: Response): Promise<any>;
    static update(req: Request, res: Response): Promise<any>;
    static delete(req: Request, res: Response): Promise<any>;
    static createTranslation(req: Request, res: Response): Promise<void>;
    static updateTranslation(req: Request, res: Response): Promise<void>;
    static deleteTranslation(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=posts-controller.d.ts.map