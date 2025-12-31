import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      slug: 'administrator',
      description: 'Full system access'
    }
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'Editor' },
    update: {},
    create: {
      name: 'Editor',
      slug: 'editor',
      description: 'Content management access'
    }
  });

  console.log('✅ Created roles');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      is_active: true,
      email_verified_at: new Date()
    }
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id
      }
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id
    }
  });

  console.log('✅ Created admin user');

  // Create default settings
  const defaultSettings = [
    { key: 'site_name', value: 'My CMS Site' },
    { key: 'site_description', value: 'A modern CMS built with Next.js' },
    { key: 'site_url', value: 'http://localhost:3000' },
    { key: 'admin_email', value: 'admin@example.com' },
    { key: 'default_language', value: 'en' },
    { key: 'timezone', value: 'UTC' },
    { key: 'maintenance_mode', value: 'false' }
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value }
    });
  }

  console.log('✅ Created default settings');

  // Create default languages
  const languages = [
    { code: 'en', name: 'English', native_name: 'English', flag: '🇺🇸', is_default: true },
    { code: 'el', name: 'Greek', native_name: 'Ελληνικά', flag: '🇬🇷', is_default: false }
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: lang,
      create: lang
    });
  }

  console.log('✅ Created default languages');

  // Create sample pages
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Welcome to Our Site',
      slug: 'home',
      content: '<h1>Welcome!</h1><p>This is the homepage of our CMS site.</p>',
      status: 'published',
      is_homepage: true,
      meta_title: 'Home - My CMS Site',
      meta_description: 'Welcome to our modern CMS website'
    }
  });

  const aboutPage = await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      title: 'About Us',
      slug: 'about',
      content: '<h1>About Us</h1><p>Learn more about our organization.</p>',
      status: 'published',
      meta_title: 'About Us - My CMS Site',
      meta_description: 'Learn more about our organization and mission'
    }
  });

  console.log('✅ Created sample pages');

  // Create sample categories and posts
  const newsCategory = await prisma.category.upsert({
    where: { slug: 'news' },
    update: {},
    create: {
      name: 'News',
      slug: 'news',
      description: 'Latest news and updates'
    }
  });

  const samplePost = await prisma.post.upsert({
    where: { slug: 'welcome-post' },
    update: {},
    create: {
      title: 'Welcome to Our Blog',
      slug: 'welcome-post',
      excerpt: 'This is our first blog post welcoming you to our site.',
      content: '<h1>Welcome!</h1><p>This is our first blog post. We hope you enjoy our content!</p>',
      status: 'published',
      author_id: adminUser.id,
      meta_title: 'Welcome to Our Blog',
      meta_description: 'Our first blog post welcoming you to our site'
    }
  });

  // Link post to category
  await prisma.postCategory.upsert({
    where: {
      post_id_category_id: {
        post_id: samplePost.id,
        category_id: newsCategory.id
      }
    },
    update: {},
    create: {
      post_id: samplePost.id,
      category_id: newsCategory.id
    }
  });

  console.log('✅ Created sample blog content');

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Default login credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
  console.log('');
  console.log('Admin panel: http://localhost:3000/admin');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
