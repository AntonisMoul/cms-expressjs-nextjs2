import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { JWTPayload } from '@cms/shared';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export declare class AuthMiddleware {
    private prisma;
    constructor(prisma: PrismaClient);
    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    requirePermission: (permission: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    requireAnyPermission: (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    requireAllPermissions: (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private extractTokenFromCookies;
    private extractTokenFromHeader;
}
//# sourceMappingURL=auth.d.ts.map