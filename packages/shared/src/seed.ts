import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root (two levels up from packages/shared/src)
config({ path: resolve(__dirname, '../../../.env') });

import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('password', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@company.com',
      username: 'admin',
      password: hashedPassword,
      superUser: true,
      manageSupers: true,
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create admin role with all permissions
  // Note: In a real implementation, you'd get all available permissions from the RBAC system
  // For now, we'll create a role with a permissions JSON that grants all permissions
  const allPermissions = {
    // Core permissions
    'core.index': true,
    'core.settings': true,
    'core.system': true,
    
    // Pages permissions
    'pages.index': true,
    'pages.create': true,
    'pages.edit': true,
    'pages.delete': true,
    
    // Blog permissions
    'posts.index': true,
    'posts.create': true,
    'posts.edit': true,
    'posts.delete': true,
    'categories.index': true,
    'categories.create': true,
    'categories.edit': true,
    'categories.delete': true,
    'tags.index': true,
    'tags.create': true,
    'tags.edit': true,
    'tags.delete': true,
    
    // Media permissions
    'media.index': true,
    'media.create': true,
    'media.edit': true,
    'media.delete': true,
    
    // Menu permissions
    'menus.index': true,
    'menus.create': true,
    'menus.edit': true,
    'menus.delete': true,
    
    // Widget permissions
    'widgets.index': true,
    'widgets.create': true,
    'widgets.edit': true,
    'widgets.delete': true,
    
    // Theme permissions
    'themes.index': true,
    'themes.options': true,
    
    // Language permissions
    'languages.index': true,
    'languages.create': true,
    'languages.edit': true,
    'languages.delete': true,
    
    // Translation permissions
    'translations.index': true,
    'translations.create': true,
    'translations.edit': true,
    'translations.delete': true,
  };

  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
      description: 'Admin users role',
      permissions: JSON.stringify(allPermissions),
      isDefault: true,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  console.log('✅ Created admin role:', adminRole.name);

  // Assign admin role to admin user
  const existingRoleUser = await prisma.roleUser.findUnique({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
  });

  if (!existingRoleUser) {
    await prisma.roleUser.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });
  }

  console.log('✅ Assigned admin role to admin user');

  // Create default language (English)
  const defaultLanguage = await prisma.language.upsert({
    where: { langCode: 'en' },
    update: {},
    create: {
      langName: 'English',
      langCode: 'en',
      langIsDefault: true,
      langIsRtl: false,
      langFlag: 'us',
      langOrder: 0,
    },
  });

  console.log('✅ Created default language:', defaultLanguage.langName);

  // Create basic settings
  const settings = [
    { key: 'site_title', value: 'CMS' },
    { key: 'site_description', value: 'A modern CMS built with Next.js and Express.js' },
    { key: 'admin_email', value: 'admin@company.com' },
    { key: 'time_zone', value: 'UTC' },
    { key: 'language_hide_default', value: '1' },
    { key: 'language_switcher_display', value: 'dropdown' },
    { key: 'language_display', value: 'all' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }

  console.log('✅ Created basic settings');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: admin@company.com');
  console.log('   Username: admin');
  console.log('   Password: password');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

