#!/usr/bin/env node
/**
 * Workaround to generate Prisma client by temporarily using npm
 * This creates a temporary npm project to bypass pnpm workspace detection
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const tempDir = path.join(os.tmpdir(), `prisma-gen-${Date.now()}`);
const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
const outputPath = path.resolve(__dirname, '../node_modules/.prisma/client');

console.log('🔧 Generating Prisma client (workaround for pnpm workspace)...');
console.log('Schema:', schemaPath);
console.log('Output:', outputPath);

try {
  // Create temp directory
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Copy schema to temp directory
  const tempSchemaDir = path.join(tempDir, 'prisma');
  fs.mkdirSync(tempSchemaDir, { recursive: true });
  fs.copyFileSync(schemaPath, path.join(tempSchemaDir, 'schema.prisma'));
  
  // Create package.json in temp dir (npm project)
  const packageJson = {
    name: 'temp-prisma-gen',
    version: '1.0.0',
    private: true,
    dependencies: {
      '@prisma/client': '5.22.0',
      'prisma': '5.22.0'
    }
  };
  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Install dependencies with npm
  console.log('📦 Installing Prisma in temporary npm project...');
  execSync('npm install', {
    cwd: tempDir,
    stdio: 'inherit',
    env: { ...process.env, npm_config_user_agent: 'npm' }
  });
  
  // Generate client
  console.log('🚀 Generating Prisma client...');
  execSync('npx prisma generate', {
    cwd: tempDir,
    stdio: 'inherit',
    env: { ...process.env, npm_config_user_agent: 'npm' }
  });
  
  // Copy generated client to actual location
  const generatedClient = path.join(tempDir, 'node_modules/.prisma/client');
  if (fs.existsSync(generatedClient)) {
    console.log('📋 Copying generated client to project...');
    fs.mkdirSync(outputPath, { recursive: true });
    // Copy all files
    const files = fs.readdirSync(generatedClient);
    for (const file of files) {
      const src = path.join(generatedClient, file);
      const dest = path.join(outputPath, file);
      if (fs.statSync(src).isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    console.log('✅ Prisma client generated and copied successfully!');
  } else {
    throw new Error('Generated client not found');
  }
  
  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
  
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  // Cleanup on error
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  process.exit(1);
}

