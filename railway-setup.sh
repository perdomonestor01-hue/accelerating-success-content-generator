#!/bin/bash

# Railway Deployment Setup Script
# This script helps automate the Railway deployment process

set -e  # Exit on any error

echo "🚂 Accelerating Success - Railway Deployment Helper"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found${NC}"
    echo "Install it with: npm i -g @railway/cli"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI found${NC}"
echo ""

# Check Railway login status
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Railway${NC}"
    echo "Please run: railway login"
    exit 1
fi

RAILWAY_USER=$(railway whoami)
echo -e "${GREEN}✅ Logged in as: $RAILWAY_USER${NC}"
echo ""

# Display next steps
echo "📋 Next Steps:"
echo ""
echo "1. 🌐 Open Railway Dashboard (already opened for you)"
echo "   - Click 'Deploy from GitHub repo'"
echo "   - Select: perdomonestor01-hue/accelerating-success-content-generator"
echo ""
echo "2. 🗄️  Add PostgreSQL Database"
echo "   - Click '+ New' → 'Database' → 'Add PostgreSQL'"
echo ""
echo "3. 🔐 Set Environment Variables"
echo "   - I'll help you set these up once your project is created"
echo ""
echo "4. ⏳ Wait for Deployment"
echo "   - Railway will build and deploy automatically (2-4 minutes)"
echo ""
echo "5. 🌍 Generate Public Domain"
echo "   - Settings → Networking → Generate Domain"
echo ""
echo "6. 👤 Create Admin User"
echo "   - I'll provide a script for this"
echo ""

# Ask if they've created the project yet
echo ""
echo -e "${YELLOW}Have you created your Railway project and linked it? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Great! Let's link this directory to your Railway project..."
    echo ""
    echo "Run this command and select your project:"
    echo -e "${GREEN}railway link${NC}"
    echo ""
    echo "After linking, run:"
    echo -e "${GREEN}./railway-env-setup.sh${NC}"
    echo "to set up all environment variables automatically"
else
    echo ""
    echo "No problem! Follow the steps above to create your project first."
    echo "The Railway dashboard should be open in your browser."
    echo ""
    echo "After creating the project, run this script again!"
fi

echo ""
echo "=================================================="
