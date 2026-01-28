#!/bin/bash

# Gold Trading Platform - Quick Setup Script
# This script helps you set up the gold trading platform quickly

set -e

echo "🥇 Gold Trading Platform - Quick Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys:"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "   - COINBASE_COMMERCE_API_KEY"
    echo "   - GOLD_API_KEY (optional)"
    echo ""
    read -p "Press Enter once you've added your API keys..."
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🔧 Installing dependencies..."
npm install

echo ""
echo "📦 Generating TypeScript types..."
npm run typegen

echo ""
echo "🚀 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Deploy schema: npx sanity@latest schema deploy"
echo "2. Start dev server: npm run dev"
echo "3. Open Sanity Studio: http://localhost:3000/studio"
echo "4. Create gold products in Studio"
echo "5. Visit gold trading page: http://localhost:3000/gold"
echo ""
echo "📚 Documentation:"
echo "   - Full Guide: GOLD_TRADING_GUIDE.md"
echo "   - Checklist: LAUNCH_CHECKLIST.md"
echo "   - README: GOLD_PLATFORM_README.md"
echo ""
echo "Happy Trading! 🎉"
