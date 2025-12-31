export interface Locale {
    id: number;
    code: string;
    name: string;
    flag?: string | null;
    isDefault: boolean;
    isActive: boolean;
    order: number;
    isRtl: boolean;
}
export interface LocaleCreateData {
    code: string;
    name: string;
    flag?: string;
    isDefault?: boolean;
    isActive?: boolean;
    order?: number;
    isRtl?: boolean;
}
export interface LocaleUpdateData {
    name?: string;
    flag?: string;
    isDefault?: boolean;
    isActive?: boolean;
    order?: number;
    isRtl?: boolean;
}
export declare const DEFAULT_LOCALES: readonly [{
    readonly code: "en";
    readonly name: "English";
    readonly flag: string | null;
    readonly isDefault: true;
    readonly isActive: true;
    readonly order: 1;
    readonly isRtl: false;
}, {
    readonly code: "el";
    readonly name: "Ελληνικά";
    readonly flag: string | null;
    readonly isDefault: false;
    readonly isActive: true;
    readonly order: 2;
    readonly isRtl: false;
}];
//# sourceMappingURL=locale.d.ts.map