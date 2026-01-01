"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
class SettingsService {
    prisma;
    cache = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get(key, defaultValue) {
        // Check cache first
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        const setting = await this.prisma.setting.findUnique({
            where: { key },
        });
        const value = setting?.value || defaultValue;
        // Cache the value
        if (value !== undefined) {
            this.cache.set(key, value);
        }
        return value;
    }
    async set(key, value) {
        await this.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
        // Update cache
        this.cache.set(key, value);
    }
    async delete(key) {
        await this.prisma.setting.delete({
            where: { key },
        });
        // Remove from cache
        this.cache.delete(key);
    }
    async getAll() {
        const settings = await this.prisma.setting.findMany({
            orderBy: { key: 'asc' },
        });
        return settings.map(setting => ({
            id: setting.id,
            key: setting.key,
            value: setting.value,
        }));
    }
    async getGroup(prefix) {
        const settings = await this.prisma.setting.findMany({
            where: {
                key: {
                    startsWith: prefix,
                },
            },
            orderBy: { key: 'asc' },
        });
        return settings.map(setting => ({
            key: setting.key,
            value: setting.value,
        }));
    }
    async setGroup(settings) {
        const operations = Object.entries(settings).map(([key, value]) => this.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        }));
        await this.prisma.$transaction(operations);
        // Update cache
        Object.entries(settings).forEach(([key, value]) => {
            this.cache.set(key, value);
        });
    }
    async clearCache() {
        this.cache.clear();
    }
    // Helper methods for common settings
    async getSiteName() {
        return this.get('site_name', 'My CMS');
    }
    async getSiteDescription() {
        return this.get('site_description', '');
    }
    async getSiteUrl() {
        return this.get('site_url', 'http://localhost:3000');
    }
    async isMaintenanceMode() {
        const value = await this.get('maintenance_mode', 'false');
        return value === 'true';
    }
    async getTimezone() {
        return this.get('timezone', 'UTC');
    }
    async getDateFormat() {
        return this.get('date_format', 'Y-m-d');
    }
    async getTimeFormat() {
        return this.get('time_format', 'H:i:s');
    }
    async getDefaultLocale() {
        return this.get('default_locale', 'en');
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=service.js.map