import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default roles
  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'super-admin' },
    update: {},
    create: {
      slug: 'super-admin',
      name: 'Super Administrator',
      permissions: {
        '*': true, // All permissions
      },
      description: 'Full system access',
      isDefault: false,
      createdBy: 'system',
      updatedBy: 'system',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      slug: 'admin',
      name: 'Administrator',
      permissions: {
        'users.*': true,
        'pages.*': true,
        'blog.*': true,
        'media.*': true,
        'menu.*': true,
        'widget.*': true,
        'settings.*': true,
      },
      description: 'Administrative access',
      isDefault: false,
      createdBy: 'system',
      updatedBy: 'system',
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { slug: 'editor' },
    update: {},
    create: {
      slug: 'editor',
      name: 'Editor',
      permissions: {
        'pages.*': true,
        'blog.*': true,
        'media.upload': true,
        'media.view': true,
      },
      description: 'Content editing access',
      isDefault: true,
      createdBy: 'system',
      updatedBy: 'system',
    },
  });

  console.log('✅ Roles created');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      superUser: true,
    },
  });

  // Assign super admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Admin user created');

  // Create default languages
  const english = await prisma.language.upsert({
    where: { locale: 'en' },
    update: {},
    create: {
      name: 'English',
      locale: 'en',
      code: 'en',
      flag: '🇺🇸',
      isDefault: true,
      order: 1,
      isRTL: false,
    },
  });

  const greek = await prisma.language.upsert({
    where: { locale: 'el' },
    update: {},
    create: {
      name: 'Ελληνικά',
      locale: 'el',
      code: 'el',
      flag: '🇬🇷',
      isDefault: false,
      order: 2,
      isRTL: false,
    },
  });

  console.log('✅ Languages created');

  // Create default settings
  const settings = [
    { key: 'site_name', value: 'My CMS Site' },
    { key: 'site_description', value: 'A modern CMS built with Next.js and Express.js' },
    { key: 'site_url', value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
    { key: 'default_locale', value: 'en' },
    { key: 'timezone', value: 'Europe/Athens' },
    { key: 'date_format', value: 'd/m/Y' },
    { key: 'time_format', value: 'H:i' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'media_driver', value: 'local' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Default settings created');

  // Create sample categories
  const newsCategory = await prisma.category.upsert({
    where: { name: 'News' },
    update: {},
    create: {
      name: 'News',
      description: 'Latest news and announcements',
      status: 'published',
      authorId: adminUser.id,
      authorType: 'User',
      order: 1,
      isFeatured: true,
      isDefault: true,
    },
  });

  const tutorialsCategory = await prisma.category.upsert({
    where: { name: 'Tutorials' },
    update: {},
    create: {
      name: 'Tutorials',
      description: 'How-to guides and tutorials',
      status: 'published',
      authorId: adminUser.id,
      authorType: 'User',
      order: 2,
      isFeatured: true,
      isDefault: false,
    },
  });

  console.log('✅ Sample categories created');

  // Create sample tags
  const sampleTags = ['cms', 'nextjs', 'react', 'typescript', 'tutorial'];

  for (const tagName of sampleTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        description: `Content related to ${tagName}`,
        status: 'published',
        authorId: adminUser.id,
        authorType: 'User',
      },
    });
  }

  console.log('✅ Sample tags created');

  // Create sample page
  const welcomePage = await prisma.page.upsert({
    where: { name: 'Welcome' },
    update: {},
    create: {
      name: 'Welcome',
      content: `<h1>Welcome to Our CMS</h1>
<p>This is a sample page created during the database seeding process.</p>
<h2>Features</h2>
<ul>
<li>Modern Next.js 16 frontend</li>
<li>Express.js API backend</li>
<li>MySQL database with Prisma ORM</li>
<li>Plugin-based architecture</li>
<li>Multi-language support</li>
<li>Role-based access control</li>
</ul>
<p>You can edit this page through the admin panel.</p>`,
      status: 'published',
      userId: adminUser.id,
    },
  });

  console.log('✅ Sample page created');

  // Create sample post
  const samplePost = await prisma.post.upsert({
    where: { name: 'Getting Started with Our CMS' },
    update: {},
    create: {
      name: 'Getting Started with Our CMS',
      description: 'A comprehensive guide to using our modern CMS platform',
      content: `<h1>Getting Started with Our CMS</h1>
<p>Welcome to our modern CMS built with Next.js and Express.js!</p>

<h2>What is a CMS?</h2>
<p>A Content Management System (CMS) allows you to create, manage, and publish digital content without needing advanced technical skills.</p>

<h2>Key Features</h2>
<ul>
<li><strong>Pages:</strong> Create static pages for your website</li>
<li><strong>Blog:</strong> Write and publish blog posts with categories and tags</li>
<li><strong>Media:</strong> Upload and manage images, videos, and documents</li>
<li><strong>Menus:</strong> Create navigation menus with drag-and-drop</li>
<li><strong>Widgets:</strong> Add dynamic content to sidebars</li>
<li><strong>Users:</strong> Manage users and permissions</li>
</ul>

<h2>Next Steps</h2>
<p>Now that you've set up the CMS, you can:</p>
<ol>
<li>Log in to the admin panel</li>
<li>Create your first page</li>
<li>Write a blog post</li>
<li>Customize your menu</li>
<li>Upload media files</li>
</ol>

<p>Happy content creating! 🎉</p>`,
      status: 'published',
      authorId: adminUser.id,
      authorType: 'User',
      isFeatured: true,
    },
  });

  // Add post to categories and tags
  await prisma.postCategory.upsert({
    where: {
      postId_categoryId: {
        postId: samplePost.id,
        categoryId: tutorialsCategory.id,
      },
    },
    update: {},
    create: {
      postId: samplePost.id,
      categoryId: tutorialsCategory.id,
    },
  });

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: samplePost.id,
        tagId: (await prisma.tag.findFirst({ where: { name: 'cms' } }))!.id,
      },
    },
    update: {},
    create: {
      postId: samplePost.id,
      tagId: (await prisma.tag.findFirst({ where: { name: 'cms' } }))!.id,
    },
  });

  console.log('✅ Sample post created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the API server: pnpm dev:api');
  console.log('2. Start the web app: pnpm dev:web');
  console.log('3. Visit admin panel: http://localhost:3000/admin');
  console.log(`4. Login with: ${process.env.ADMIN_EMAIL || 'admin@example.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

