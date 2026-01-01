import { Request, Response } from 'express';
export declare class MediaAdminController {
    static getFolders(req: Request, res: Response): Promise<void>;
    static createFolder(req: Request, res: Response): Promise<any>;
    static updateFolder(req: Request, res: Response): Promise<any>;
    static deleteFolder(req: Request, res: Response): Promise<any>;
    static getFiles(req: Request, res: Response): Promise<void>;
    static uploadFiles(req: Request, res: Response): Promise<any>;
    static updateFile(req: Request, res: Response): Promise<void>;
    static deleteFile(req: Request, res: Response): Promise<any>;
    static moveFile(req: Request, res: Response): Promise<void>;
    static getStorageUsage(req: Request, res: Response): Promise<void>;
    static bulkDelete(req: Request, res: Response): Promise<any>;
    static bulkMove(req: Request, res: Response): Promise<any>;
}
//# sourceMappingURL=controller.d.ts.map