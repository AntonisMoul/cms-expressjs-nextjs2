export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatarId?: string;
    superUser: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface Role {
    id: string;
    slug: string;
    name: string;
    permissions?: Record<string, any>;
    description?: string;
    isDefault: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserRole {
    id: string;
    userId: string;
    roleId: string;
    user: User;
    role: Role;
}
export interface UserMeta {
    id: string;
    key: string;
    value?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Setting {
    id: string;
    key: string;
    value?: string;
}
export interface AuditHistory {
    id: string;
    userId: string;
    module: string;
    action: string;
    request?: any;
    userAgent?: string;
    ipAddress?: string;
    referenceUser: string;
    referenceId: string;
    referenceName: string;
    type: string;
    createdAt: Date;
}
export interface Slug {
    id: string;
    key: string;
    entityId: string;
    entityType: string;
    prefix?: string;
    fullPath: string;
    locale: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Language {
    id: string;
    name: string;
    locale: string;
    code: string;
    flag?: string;
    isDefault: boolean;
    order: number;
    isRTL: boolean;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface JWTPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}
export interface PluginContract {
    name: string;
    version: string;
    registerApiRoutes?: (router: any, ctx: PluginContext) => void;
    getAdminNavigation?: () => AdminNavItem[];
    getAdminScreens?: () => AdminScreen[];
    getSettingsPanels?: () => SettingsPanel[];
    migrations?: string[];
    permissions?: Permission[];
}
export interface PluginContext {
    app: any;
    prisma: any;
}
export interface AdminNavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    parentId?: string;
    priority?: number;
    permissions?: string[];
}
export interface AdminScreen {
    path: string;
    component: any;
    layout?: any;
    permissions?: string[];
}
export interface SettingsPanel {
    id: string;
    title: string;
    component: any;
    permissions?: string[];
}
export interface Permission {
    key: string;
    name: string;
    module: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
}
export interface CreateUserRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    roleIds?: string[];
}
export interface UpdateUserRequest {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    roleIds?: string[];
}
export interface Page {
    id: string;
    name: string;
    content?: string;
    userId?: string;
    image?: string;
    template?: string;
    isFeatured: boolean;
    description?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PageTranslation {
    langCode: string;
    pagesId: string;
    name?: string;
    description?: string;
    content?: string;
}
export interface PageWithTranslations extends Page {
    translations: PageTranslation[];
}
export interface CreatePageRequest {
    name: string;
    content?: string;
    image?: string;
    template?: string;
    isFeatured?: boolean;
    description?: string;
    status?: string;
}
export interface UpdatePageRequest {
    name?: string;
    content?: string;
    image?: string;
    template?: string;
    isFeatured?: boolean;
    description?: string;
    status?: string;
}
export interface PageListRequest {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    author?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface Post {
    id: string;
    name: string;
    description?: string;
    content?: string;
    status: string;
    authorId?: string;
    authorType: string;
    isFeatured: boolean;
    image?: string;
    views: number;
    formatType?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Category {
    id: string;
    name: string;
    parentId: string;
    description?: string;
    status: string;
    authorId?: string;
    authorType: string;
    icon?: string;
    order: number;
    isFeatured: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Tag {
    id: string;
    name: string;
    authorId?: string;
    authorType: string;
    description?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PostTranslation {
    langCode: string;
    postsId: string;
    name?: string;
    description?: string;
    content?: string;
}
export interface CategoryTranslation {
    langCode: string;
    categoriesId: string;
    name?: string;
    description?: string;
}
export interface TagTranslation {
    langCode: string;
    tagsId: string;
    name?: string;
    description?: string;
}
export interface PostWithRelations extends Post {
    categories: Category[];
    tags: Tag[];
    translations: PostTranslation[];
}
export interface CreatePostRequest {
    name: string;
    description?: string;
    content?: string;
    status?: string;
    isFeatured?: boolean;
    image?: string;
    formatType?: string;
    categoryIds?: string[];
    tagIds?: string[];
}
export interface UpdatePostRequest {
    name?: string;
    description?: string;
    content?: string;
    status?: string;
    isFeatured?: boolean;
    image?: string;
    formatType?: string;
    categoryIds?: string[];
    tagIds?: string[];
}
export interface PostListRequest {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    author?: string;
    category?: string;
    tag?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface CreateCategoryRequest {
    name: string;
    parentId?: string;
    description?: string;
    status?: string;
    icon?: string;
    order?: number;
    isFeatured?: boolean;
    isDefault?: boolean;
}
export interface UpdateCategoryRequest {
    name?: string;
    parentId?: string;
    description?: string;
    status?: string;
    icon?: string;
    order?: number;
    isFeatured?: boolean;
    isDefault?: boolean;
}
export interface CreateTagRequest {
    name: string;
    description?: string;
    status?: string;
}
export interface UpdateTagRequest {
    name?: string;
    description?: string;
    status?: string;
}
export interface MediaFolder {
    id: string;
    userId: string;
    name?: string;
    slug?: string;
    parentId: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface MediaFile {
    id: string;
    userId: string;
    name: string;
    folderId: string;
    mimeType: string;
    size: number;
    url: string;
    options?: any;
    alt?: string;
    visibility: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface MediaSetting {
    id: string;
    key: string;
    value?: string;
    mediaId?: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateMediaFolderRequest {
    name?: string;
    parentId?: string;
    color?: string;
}
export interface UpdateMediaFolderRequest {
    name?: string;
    parentId?: string;
    color?: string;
}
export interface UploadMediaRequest {
    files: File[];
    folderId?: string;
    visibility?: string;
}
export interface MediaListRequest {
    folderId?: string;
    search?: string;
    type?: string;
    page?: number;
    limit?: number;
}
export interface Menu {
    id: string;
    name: string;
    slug?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MenuNode {
    id: string;
    menuId: string;
    parentId: string;
    referenceId?: string;
    referenceType?: string;
    url?: string;
    iconFont?: string;
    position: number;
    title?: string;
    cssClass?: string;
    target: string;
    hasChild: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface MenuLocation {
    id: string;
    menuId: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MenuWithNodes extends Menu {
    nodes: MenuNode[];
    locations: MenuLocation[];
}
export interface CreateMenuRequest {
    name: string;
    slug?: string;
    status?: string;
}
export interface UpdateMenuRequest {
    name?: string;
    slug?: string;
    status?: string;
}
export interface CreateMenuNodeRequest {
    menuId: string;
    parentId?: string;
    referenceId?: string;
    referenceType?: string;
    url?: string;
    iconFont?: string;
    position?: number;
    title?: string;
    cssClass?: string;
    target?: string;
}
export interface UpdateMenuNodeRequest {
    parentId?: string;
    referenceId?: string;
    referenceType?: string;
    url?: string;
    iconFont?: string;
    position?: number;
    title?: string;
    cssClass?: string;
    target?: string;
}
export interface MenuLocationRequest {
    menuId: string;
    location: string;
}
export interface Widget {
    id: string;
    widgetId: string;
    sidebarId: string;
    theme: string;
    position: number;
    data?: any;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateWidgetRequest {
    widgetId: string;
    sidebarId: string;
    theme?: string;
    position?: number;
    data?: any;
}
export interface UpdateWidgetRequest {
    widgetId?: string;
    sidebarId?: string;
    theme?: string;
    position?: number;
    data?: any;
}
export interface WidgetGroup {
    id: string;
    name: string;
    description?: string;
    widgets: WidgetType[];
}
export interface WidgetType {
    id: string;
    name: string;
    description?: string;
    preview?: string;
    settings: WidgetSetting[];
}
export interface WidgetSetting {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'image' | 'file';
    default?: any;
    options?: Array<{
        label: string;
        value: string;
    }>;
    required?: boolean;
}
export interface Menu {
    id: string;
    name: string;
    slug?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MenuNode {
    id: string;
    menuId: string;
    parentId: string;
    referenceId?: string;
    referenceType?: string;
    url?: string;
    iconFont?: string;
    position: number;
    title?: string;
    cssClass?: string;
    target: string;
    hasChild: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface MenuLocation {
    id: string;
    menuId: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MenuWithNodes extends Menu {
    nodes: MenuNode[];
    locations: MenuLocation[];
}
export interface CreateMenuRequest {
    name: string;
    slug?: string;
    status?: string;
}
export interface UpdateMenuRequest {
    name?: string;
    slug?: string;
    status?: string;
}
export interface CreateMenuNodeRequest {
    parentId?: string;
    referenceId?: string;
    referenceType?: string;
    url?: string;
    iconFont?: string;
    position?: number;
    title?: string;
    cssClass?: string;
    target?: string;
}
export interface UpdateMenuNodeRequest {
    parentId?: string;
    referenceId?: string;
    referenceType?: string;
    url?: string;
    iconFont?: string;
    position?: number;
    title?: string;
    cssClass?: string;
    target?: string;
}
export interface AssignMenuToLocationRequest {
    menuId: string;
    location: string;
}
export interface Widget {
    id: string;
    widgetId: string;
    sidebarId: string;
    theme: string;
    position: number;
    data?: any;
    createdAt: Date;
    updatedAt: Date;
}
export interface WidgetType {
    id: string;
    name: string;
    description?: string;
    component: any;
    form?: any;
    defaultData?: any;
}
export interface WidgetSidebar {
    id: string;
    name: string;
    description?: string;
    theme?: string;
}
export interface CreateWidgetRequest {
    widgetId: string;
    sidebarId: string;
    theme?: string;
    position?: number;
    data?: any;
}
export interface UpdateWidgetRequest {
    sidebarId?: string;
    position?: number;
    data?: any;
}
export interface SettingGroup {
    key: string;
    value: any;
}
export interface SlugCheckRequest {
    entityType: string;
    locale?: string;
    slug: string;
    excludeId?: string;
}
export interface SlugCheckResponse {
    available: boolean;
    suggestion?: string;
}
export interface CreateSlugRequest {
    entityType: string;
    entityId: string;
    key: string;
    prefix?: string;
    locale?: string;
}
export interface AuditLogData {
    module: string;
    action: string;
    referenceUser: string;
    referenceId: string;
    referenceName: string;
    type: string;
    request?: any;
}
//# sourceMappingURL=index.d.ts.map