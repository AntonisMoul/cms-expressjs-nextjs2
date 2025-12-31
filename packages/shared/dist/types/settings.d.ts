export interface Setting {
    id: number;
    key: string;
    value?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface SettingCreateData {
    key: string;
    value?: string;
}
export interface SettingUpdateData {
    value?: string;
}
//# sourceMappingURL=settings.d.ts.map