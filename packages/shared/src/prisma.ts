// Load environment variables before Prisma client initialization
// Use path resolution to find .env file at project root
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root (3 levels up from packages/shared/src)
const envPath = resolve(__dirname, '../../../.env');
config({ path: envPath });

// Try to import PrismaClient, with fallback for auto-generation
let PrismaClient: any;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (error: any) {
  if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('.prisma/client')) {
    // Prisma client not generated yet - try to generate it
    console.warn('⚠️  Prisma client not found. Attempting to generate...');
    try {
      const { execSync } = require('child_process');
      const path = require('path');
      const schemaPath = path.resolve(__dirname, '../../../prisma/schema.prisma');
      execSync(`npx prisma generate --schema="${schemaPath}"`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '../..'),
      });
      // Retry import after generation
      PrismaClient = require('@prisma/client').PrismaClient;
      console.log('✅ Prisma client generated successfully!');
    } catch (genError: any) {
      console.error('❌ Failed to auto-generate Prisma client:', genError.message);
      console.error('💡 Please run: pnpm db:generate');
      throw new Error('Prisma client not generated. Please run: pnpm db:generate');
    }
  } else {
    throw error;
  }
}

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: typeof PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

