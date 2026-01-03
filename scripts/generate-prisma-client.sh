#!/bin/bash
# Workaround script to generate Prisma client in pnpm workspace
# This uses npm temporarily to bypass pnpm workspace issues

set -e

echo "🔧 Generating Prisma client (workaround for pnpm workspace issue)..."

cd "$(dirname "$0")/.."

# Check if npm is available
if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed. Please install Node.js with npm."
  exit 1
fi

# Install Prisma globally with npm (if not already installed)
if ! command -v prisma &> /dev/null; then
  echo "📦 Installing Prisma globally with npm..."
  npm install -g prisma@5.22.0
fi

# Generate the client
echo "🚀 Generating Prisma client..."
cd packages/shared
npx prisma generate --schema=../../prisma/schema.prisma

echo "✅ Prisma client generated successfully!"
echo ""
echo "You can now run: pnpm db:seed"

