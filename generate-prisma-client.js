#!/usr/bin/env node
// Manual Prisma client generation script to bypass pnpm workspace issues
const { spawn } = require('child_process');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
const prismaPath = require.resolve('prisma');

console.log('Generating Prisma client...');
console.log('Schema:', schemaPath);
console.log('Prisma:', prismaPath);

// Use node to run the Prisma CLI directly
// The require.resolve returns the build/index.js path already
const prismaIndex = prismaPath;

const child = spawn('node', [prismaIndex, 'generate', '--schema', schemaPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Try to skip auto-install
    PRISMA_SKIP_POSTINSTALL_GENERATE: 'true',
  },
  cwd: __dirname,
});

child.on('error', (error) => {
  console.error('Error spawning Prisma:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Prisma generate exited with code ${code}`);
    // Try alternative: manually create the client structure
    console.log('\nAttempting manual client generation...');
    const fs = require('fs');
    const clientDir = path.join(__dirname, 'node_modules', '.prisma', 'client');
    try {
      fs.mkdirSync(clientDir, { recursive: true });
      console.log('Created client directory:', clientDir);
      console.log('Note: You may need to run "pnpm install" to complete client generation');
    } catch (e) {
      console.error('Failed to create client directory:', e.message);
    }
    process.exit(code);
  } else {
    console.log('✅ Prisma client generated successfully!');
  }
});

