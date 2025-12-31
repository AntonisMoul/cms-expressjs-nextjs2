import { PrismaClient } from '@prisma/client';
import {
  Theme,
  ThemeOption,
  ThemeSetting,
  ThemeStatus,
  ThemeWithConfig,
  ActiveThemeInfo,
  CreateThemeRequest,
  UpdateThemeRequest,
  CreateThemeOptionRequest,
  UpdateThemeOptionRequest,
  UpdateThemeSettingRequest,
  ThemeDefinition
} from '../models/types';

const prisma = new PrismaClient();

export class ThemeService {
  // Theme CRUD operations
  async getThemes(): Promise<Theme[]> {
    return await prisma.theme.findMany({
      include: {
        options: {
          orderBy: { priority: 'asc' }
        },
        _count: {
          select: { options: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getThemeById(id: number): Promise<Theme | null> {
    return await prisma.theme.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: [
            { section: 'asc' },
            { priority: 'asc' }
          ]
        },
        _count: {
          select: { options: true }
        }
      }
    });
  }

  async getThemeByFolder(folder: string): Promise<Theme | null> {
    return await prisma.theme.findUnique({
      where: { folder },
      include: {
        options: {
          orderBy: [
            { section: 'asc' },
            { priority: 'asc' }
          ]
        }
      }
    });
  }

  async getActiveTheme(): Promise<ThemeWithConfig | null> {
    const activeTheme = await prisma.theme.findFirst({
      where: { status: ThemeStatus.ACTIVE },
      include: {
        options: {
          orderBy: [
            { section: 'asc' },
            { priority: 'asc' }
          ]
        },
        settings: true
      }
    });

    if (!activeTheme) return null;

    // Build flattened settings for easy access
    const activeSettings: Record<string, any> = {};
    activeTheme.settings.forEach(setting => {
      try {
        activeSettings[setting.option_key] = setting.value ? JSON.parse(setting.value) : null;
      } catch {
        activeSettings[setting.option_key] = setting.value;
      }
    });

    return {
      ...activeTheme,
      activeSettings
    };
  }

  async createTheme(data: CreateThemeRequest): Promise<Theme> {
    return await prisma.theme.create({
      data: {
        name: data.name,
        description: data.description,
        version: data.version || '1.0.0',
        author: data.author,
        author_url: data.author_url,
        folder: data.folder,
        image: data.image,
        tags: data.tags
      }
    });
  }

  async updateTheme(id: number, data: UpdateThemeRequest): Promise<Theme> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.version) updateData.version = data.version;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.author_url !== undefined) updateData.author_url = data.author_url;
    if (data.folder) updateData.folder = data.folder;
    if (data.status) updateData.status = data.status;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.tags !== undefined) updateData.tags = data.tags;

    return await prisma.theme.update({
      where: { id },
      data: updateData,
      include: {
        options: {
          orderBy: [
            { section: 'asc' },
            { priority: 'asc' }
          ]
        }
      }
    });
  }

  async activateTheme(id: number): Promise<Theme> {
    // First, deactivate all themes
    await prisma.theme.updateMany({
      where: { status: ThemeStatus.ACTIVE },
      data: { status: ThemeStatus.INACTIVE }
    });

    // Then activate the selected theme
    return await prisma.theme.update({
      where: { id },
      data: { status: ThemeStatus.ACTIVE },
      include: {
        options: {
          orderBy: [
            { section: 'asc' },
            { priority: 'asc' }
          ]
        }
      }
    });
  }

  async deactivateTheme(id: number): Promise<Theme> {
    return await prisma.theme.update({
      where: { id },
      data: { status: ThemeStatus.INACTIVE }
    });
  }

  async deleteTheme(id: number): Promise<void> {
    await prisma.theme.delete({
      where: { id }
    });
  }

  // Theme Option CRUD operations
  async getThemeOptions(themeId: number): Promise<ThemeOption[]> {
    return await prisma.themeOption.findMany({
      where: { theme_id: themeId },
      orderBy: [
        { section: 'asc' },
        { priority: 'asc' }
      ]
    });
  }

  async createThemeOption(data: CreateThemeOptionRequest): Promise<ThemeOption> {
    return await prisma.themeOption.create({
      data: {
        theme_id: data.theme_id,
        section: data.section,
        key: data.key,
        type: data.type || 'text',
        label: data.label,
        description: data.description,
        default_value: data.default_value,
        options: data.options,
        priority: data.priority || 0
      }
    });
  }

  async updateThemeOption(id: number, data: UpdateThemeOptionRequest): Promise<ThemeOption> {
    const updateData: any = {};
    if (data.section) updateData.section = data.section;
    if (data.key) updateData.key = data.key;
    if (data.type) updateData.type = data.type;
    if (data.label) updateData.label = data.label;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.default_value !== undefined) updateData.default_value = data.default_value;
    if (data.options !== undefined) updateData.options = data.options;
    if (data.priority !== undefined) updateData.priority = data.priority;

    return await prisma.themeOption.update({
      where: { id },
      data: updateData
    });
  }

  async deleteThemeOption(id: number): Promise<void> {
    await prisma.themeOption.delete({
      where: { id }
    });
  }

  // Theme Settings operations
  async getThemeSettings(themeId: number): Promise<ThemeSetting[]> {
    return await prisma.themeSetting.findMany({
      where: { theme_id: themeId },
      orderBy: { option_key: 'asc' }
    });
  }

  async updateThemeSetting(themeId: number, optionKey: string, data: UpdateThemeSettingRequest): Promise<ThemeSetting> {
    const value = typeof data.value === 'string' ? data.value : JSON.stringify(data.value);

    return await prisma.themeSetting.upsert({
      where: {
        theme_id_option_key: {
          theme_id: themeId,
          option_key: optionKey
        }
      },
      update: {
        value
      },
      create: {
        theme_id: themeId,
        option_key: optionKey,
        value
      }
    });
  }

  async updateMultipleThemeSettings(themeId: number, settings: Record<string, any>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.themeSetting.upsert({
        where: {
          theme_id_option_key: {
            theme_id: themeId,
            option_key: key
          }
        },
        update: {
          value: typeof value === 'string' ? value : JSON.stringify(value)
        },
        create: {
          theme_id: themeId,
          option_key: key,
          value: typeof value === 'string' ? value : JSON.stringify(value)
        }
      })
    );

    await prisma.$transaction(updates);
  }

  async resetThemeSettings(themeId: number): Promise<void> {
    await prisma.themeSetting.deleteMany({
      where: { theme_id: themeId }
    });
  }

  // Theme installation/import
  async installTheme(themeDefinition: ThemeDefinition, folder: string): Promise<Theme> {
    // Create the theme record
    const theme = await this.createTheme({
      name: themeDefinition.name,
      description: themeDefinition.description,
      version: themeDefinition.version,
      author: themeDefinition.author,
      author_url: themeDefinition.author_url,
      folder,
      image: themeDefinition.image,
      tags: themeDefinition.tags?.join(',')
    });

    // Create theme options from definition
    if (themeDefinition.options) {
      const optionCreates = [];

      for (const [section, options] of Object.entries(themeDefinition.options)) {
        for (const [key, config] of Object.entries(options)) {
          optionCreates.push(
            prisma.themeOption.create({
              data: {
                theme_id: theme.id,
                section,
                key,
                type: config.type,
                label: config.label,
                description: config.description,
                default_value: config.default_value ? JSON.stringify(config.default_value) : undefined,
                options: config.options ? JSON.stringify(config.options) : undefined,
                priority: config.priority || 0
              }
            })
          );
        }
      }

      await prisma.$transaction(optionCreates);
    }

    return theme;
  }

  // Get public theme info for frontend
  async getActiveThemeInfo(): Promise<ActiveThemeInfo | null> {
    const activeTheme = await this.getActiveTheme();
    if (!activeTheme) return null;

    return {
      theme: activeTheme,
      settings: activeTheme.activeSettings
    };
  }

  // Validate theme folder exists and is valid
  async validateThemeFolder(folder: string): Promise<boolean> {
    // This would check if the theme folder exists and contains valid theme files
    // For now, just return true
    return true;
  }

  // Get theme statistics
  async getThemeStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const [total, active, inactive] = await Promise.all([
      prisma.theme.count(),
      prisma.theme.count({ where: { status: ThemeStatus.ACTIVE } }),
      prisma.theme.count({ where: { status: ThemeStatus.INACTIVE } })
    ]);

    return { total, active, inactive };
  }
}
