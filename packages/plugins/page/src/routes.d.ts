import { Router, Response, Request } from 'express';
import { PluginContext } from '@cms/shared';
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        superUser: boolean;
    };
}
export type AuthMiddleware = (req: AuthRequest, res: Response, next: () => void) => void;
export type PermissionMiddleware = (permission: string) => AuthMiddleware;
export declare function registerPageRoutes(router: Router, ctx: PluginContext, requireAuth: AuthMiddleware, requirePermission: PermissionMiddleware): void;
//# sourceMappingURL=routes.d.ts.map