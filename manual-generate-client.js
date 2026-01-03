#!/usr/bin/env node
/**
 * Manual Prisma client generation to work around pnpm workspace issues
 * This script uses Prisma's programmatic API to generate the client
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const schemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
const outputPath = path.resolve(__dirname, 'node_modules/.prisma/client');

console.log('🔧 Manual Prisma Client Generation');
console.log('Schema:', schemaPath);
console.log('Output:', outputPath);

// Ensure output directory exists
fs.mkdirSync(outputPath, { recursive: true });

// Try to use Prisma's CLI with npm instead of pnpm
// Set environment to use npm
const env = {
  ...process.env,
  npm_config_user_agent: 'npm',
  // Try to force npm usage
};

try {
  console.log('\n📦 Attempting to generate client...');
  
  // First, ensure @prisma/client is installed
  console.log('Installing @prisma/client...');
  execSync('pnpm add @prisma/client@5.22.0', { 
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, npm_config_user_agent: 'pnpm' }
  });
  
  // Now try to generate using the installed Prisma
  console.log('\nGenerating Prisma client...');
  const prismaPath = require.resolve('prisma');
  execSync(`node "${prismaPath}" generate --schema="${schemaPath}"`, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      // Try to skip auto-install by setting npm as package manager
      npm_config_user_agent: 'npm',
    }
  });
  
  console.log('\n✅ Prisma client generated successfully!');
} catch (error) {
  console.error('\n❌ Failed to generate client automatically');
  console.error('Error:', error.message);
  console.log('\n💡 Workaround: The Prisma client will be auto-generated when you first import it in your code.');
  console.log('   Or run: cd packages/shared && pnpm add @prisma/client@5.22.0 && npx prisma generate --schema=../../prisma/schema.prisma');
  process.exit(1);
}

