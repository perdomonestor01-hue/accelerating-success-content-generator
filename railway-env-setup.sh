#!/bin/bash

# Railway Environment Variables Setup Script
# Automatically sets all required environment variables for Railway

set -e

echo "🔐 Setting up Railway Environment Variables"
echo "==========================================="
echo ""

# Check if linked to Railway project
if ! railway status &> /dev/null; then
    echo "❌ Not linked to a Railway project"
    echo "Run: railway link"
    exit 1
fi

echo "✅ Connected to Railway project"
echo ""

# Read values from local .env file
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "Make sure you're in the project directory"
    exit 1
fi

echo "📖 Reading configuration from .env file..."
echo ""

# Source the .env file
source .env

# Set environment variables in Railway
echo "⚙️  Setting environment variables in Railway..."
echo ""

railway variables set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"
echo "✅ ANTHROPIC_API_KEY set"

railway variables set GROQ_API_KEY="$GROQ_API_KEY"
echo "✅ GROQ_API_KEY set"

railway variables set DEEPSEEK_API_KEY="$DEEPSEEK_API_KEY"
echo "✅ DEEPSEEK_API_KEY set"

railway variables set DEFAULT_AI_PROVIDER="$DEFAULT_AI_PROVIDER"
echo "✅ DEFAULT_AI_PROVIDER set"

railway variables set SUBSCRIPTION_URL="$SUBSCRIPTION_URL"
echo "✅ SUBSCRIPTION_URL set"

railway variables set BRAND_NAME="$BRAND_NAME"
echo "✅ BRAND_NAME set"

railway variables set BRAND_HANDLE="$BRAND_HANDLE"
echo "✅ BRAND_HANDLE set"

railway variables set TESTIMONIAL_VIDEO_1="$TESTIMONIAL_VIDEO_1"
echo "✅ TESTIMONIAL_VIDEO_1 set"

railway variables set TESTIMONIAL_VIDEO_2="$TESTIMONIAL_VIDEO_2"
echo "✅ TESTIMONIAL_VIDEO_2 set"

railway variables set TESTIMONIAL_VIDEO_3="$TESTIMONIAL_VIDEO_3"
echo "✅ TESTIMONIAL_VIDEO_3 set"

# Generate secure NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
echo "✅ NEXTAUTH_SECRET generated and set"

echo ""
echo "==========================================="
echo "✅ All environment variables set!"
echo ""
echo "⚠️  IMPORTANT: You still need to set NEXTAUTH_URL"
echo ""
echo "After your deployment is live:"
echo "1. Get your Railway public URL (e.g., https://yourapp.up.railway.app)"
echo "2. Run this command:"
echo "   railway variables set NEXTAUTH_URL=\"https://your-actual-url.up.railway.app\""
echo ""
echo "Or use the Railway dashboard to add it manually."
echo ""
echo "==========================================="
