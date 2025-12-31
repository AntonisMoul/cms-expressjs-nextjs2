export class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get(key, defaultValue) {
        const setting = await this.prisma.setting.findUnique({
            where: { key },
        });
        return setting?.value ?? defaultValue ?? null;
    }
    async set(key, value) {
        return this.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
    async delete(key) {
        await this.prisma.setting.delete({
            where: { key },
        }).catch(() => {
            // Ignore if setting doesn't exist
        });
    }
    async getAll() {
        const settings = await this.prisma.setting.findMany();
        return settings.reduce((acc, setting) => {
            if (setting.value !== null) {
                acc[setting.key] = setting.value;
            }
            return acc;
        }, {});
    }
    async getByPrefix(prefix) {
        const settings = await this.prisma.setting.findMany({
            where: {
                key: {
                    startsWith: prefix,
                },
            },
        });
        return settings.reduce((acc, setting) => {
            if (setting.value !== null) {
                acc[setting.key] = setting.value;
            }
            return acc;
        }, {});
    }
    async setMultiple(settings) {
        const operations = Object.entries(settings).map(([key, value]) => this.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        }));
        await this.prisma.$transaction(operations);
    }
}
