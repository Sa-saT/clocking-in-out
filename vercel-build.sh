#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Approve build scripts for Prisma and other dependencies (non-interactive)
echo "📦 Approving build scripts..."
pnpm approve-builds --yes || true

# Alternative: Directly approve specific packages
echo "📦 Approving specific packages..."
echo "y" | pnpm approve-builds @prisma/client @prisma/engines prisma || true

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm prisma generate

# Run the main build
echo "🏗️ Running main build..."
pnpm run build

echo "✅ Build process completed!" 