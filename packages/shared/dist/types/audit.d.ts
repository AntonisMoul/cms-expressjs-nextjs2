export interface AuditLog {
    id: number;
    userId: number;
    module: string;
    action: string;
    referenceUser: number;
    referenceId: number;
    referenceName: string;
    request?: string;
    userAgent?: string;
    ipAddress?: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuditLogCreateData {
    userId: number;
    module: string;
    action: string;
    referenceUser: number;
    referenceId: number;
    referenceName: string;
    request?: string;
    userAgent?: string;
    ipAddress?: string;
    type: string;
}
export declare const AUDIT_ACTIONS: {
    readonly CREATE: "create";
    readonly UPDATE: "update";
    readonly DELETE: "delete";
    readonly PUBLISH: "publish";
    readonly UNPUBLISH: "unpublish";
    readonly LOGIN: "login";
    readonly LOGOUT: "logout";
    readonly VIEW: "view";
};
export declare const AUDIT_MODULES: {
    readonly USERS: "users";
    readonly ROLES: "roles";
    readonly PAGES: "pages";
    readonly POSTS: "posts";
    readonly CATEGORIES: "categories";
    readonly TAGS: "tags";
    readonly MEDIA: "media";
    readonly MENUS: "menus";
    readonly WIDGETS: "widgets";
    readonly SETTINGS: "settings";
    readonly LOCALES: "locales";
    readonly THEMES: "themes";
};
//# sourceMappingURL=audit.d.ts.map