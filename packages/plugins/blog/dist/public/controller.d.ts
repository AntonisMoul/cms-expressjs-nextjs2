import { Request, Response } from 'express';
export declare class BlogPublicController {
    static getPosts(req: Request, res: Response): Promise<void>;
    static getPost(req: Request, res: Response): Promise<any>;
    static getCategories(req: Request, res: Response): Promise<void>;
    static getTags(req: Request, res: Response): Promise<void>;
    static getFeaturedPosts(req: Request, res: Response): Promise<void>;
    static getPostsByCategory(req: Request, res: Response): Promise<void>;
    static getPostsByTag(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map