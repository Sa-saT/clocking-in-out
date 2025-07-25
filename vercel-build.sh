#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Approve build scripts for Prisma and other dependencies
echo "📦 Approving build scripts..."
pnpm approve-builds || true

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm prisma generate

# Run the main build
echo "🏗️ Running main build..."
pnpm run build

echo "✅ Build process completed!" 