#!/usr/bin/env node
// Workaround script to generate Prisma client
const { execSync } = require('child_process');
const path = require('path');

const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');

try {
  // Try using the Prisma binary directly
  const prismaPath = require.resolve('prisma/build/index.js');
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'mysql://root@localhost:3306/cms_dev';
  
  // Import and run Prisma generate
  const { PrismaClient } = require('@prisma/client');
  console.log('Prisma client already available');
} catch (e) {
  // If that fails, try running the generate command via node
  console.log('Generating Prisma client...');
  try {
    execSync(`node ${require.resolve('prisma/build/index.js')} generate --schema=${schemaPath}`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || 'mysql://root@localhost:3306/cms_dev' }
    });
  } catch (err) {
    console.error('Failed to generate client:', err.message);
    process.exit(1);
  }
}

