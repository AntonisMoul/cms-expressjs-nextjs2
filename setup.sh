#!/bin/bash

# CMS Setup Script
# This script helps you set up the CMS for development

echo "🚀 CMS Setup Script"
echo "=================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Copy environment file
if [ ! -f .env ]; then
    if [ -f env.example.txt ]; then
        cp env.example.txt .env
        echo "✅ Created .env file from env.example.txt"
        echo "⚠️  Please edit .env file with your actual configuration"
    else
        echo "❌ env.example.txt not found"
        exit 1
    fi
else
    echo "ℹ️  .env file already exists"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
    echo "✅ Docker services started"
    echo "   - MySQL: localhost:3306"
    echo "   - Redis: localhost:6379"
    echo "   - MailHog: localhost:8025"
else
    echo "⚠️  Docker Compose not found. Please start services manually:"
    echo "   docker-compose up -d"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Generate Prisma client
echo "🗄️  Setting up database..."
cd packages/core
npx prisma generate
cd ../..

# Run database migrations (optional, requires .env to be configured)
echo "⚠️  Database migrations:"
echo "   After configuring your .env file, run:"
echo "   pnpm db:push"
echo "   pnpm db:seed"

# Build the project
echo "🔨 Building project..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run database migrations: pnpm db:push"
echo "3. Seed the database: pnpm db:seed"
echo "4. Start development server: pnpm dev"
echo ""
echo "Admin panel: http://localhost:3000/admin"
echo "API: http://localhost:3001"
echo "MailHog: http://localhost:8025"
