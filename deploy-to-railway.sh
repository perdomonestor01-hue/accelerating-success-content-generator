#!/bin/bash

# 🚀 Railway Deployment Script for Multi-Poster
# Account: perdomonestor01@gmail.com
# Repository: perdomonestor01-hue/accelerating-success-content-generator

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🚀 Railway Deployment - Multi-Poster System            ║"
echo "║   Accelerating Success Content Generator                 ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo "ℹ️  $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in project directory. Please run from accelerating-success-content-generator folder"
    exit 1
fi

print_success "Found project directory"

# Step 1: Check Git status
echo ""
echo "📋 Step 1: Checking Git Status"
echo "═══════════════════════════════════════════════════════════"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository. Please initialize git first."
    exit 1
fi

print_success "Git repository found"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes"
    echo ""
    echo "Would you like to commit them now? (y/n)"
    read -r commit_changes

    if [ "$commit_changes" = "y" ]; then
        echo "Enter commit message:"
        read -r commit_message
        git add .
        git commit -m "$commit_message"
        print_success "Changes committed"
    else
        print_warning "Proceeding with uncommitted changes"
    fi
else
    print_success "No uncommitted changes"
fi

# Step 2: Check GitHub remote
echo ""
echo "🔗 Step 2: Checking GitHub Remote"
echo "═══════════════════════════════════════════════════════════"

if git remote get-url origin > /dev/null 2>&1; then
    current_remote=$(git remote get-url origin)
    print_info "Current remote: $current_remote"

    if [[ "$current_remote" != *"perdomonestor01-hue/accelerating-success-content-generator"* ]]; then
        print_warning "Remote doesn't match expected repository"
        echo "Expected: https://github.com/perdomonestor01-hue/accelerating-success-content-generator.git"
        echo ""
        echo "Would you like to update the remote? (y/n)"
        read -r update_remote

        if [ "$update_remote" = "y" ]; then
            git remote remove origin
            git remote add origin https://github.com/perdomonestor01-hue/accelerating-success-content-generator.git
            print_success "Remote updated"
        fi
    else
        print_success "GitHub remote configured correctly"
    fi
else
    print_warning "No remote configured"
    echo "Adding GitHub remote..."
    git remote add origin https://github.com/perdomonestor01-hue/accelerating-success-content-generator.git
    print_success "Remote added"
fi

# Step 3: Push to GitHub
echo ""
echo "📤 Step 3: Pushing to GitHub"
echo "═══════════════════════════════════════════════════════════"

echo "Push to GitHub now? This will make your code available for Railway. (y/n)"
read -r push_now

if [ "$push_now" = "y" ]; then
    if git push -u origin main; then
        print_success "Code pushed to GitHub"
    else
        print_error "Failed to push to GitHub"
        echo "This might be because:"
        echo "  1. You haven't created the GitHub repository yet"
        echo "  2. You need to authenticate with GitHub"
        echo "  3. The repository already exists with different content"
        echo ""
        echo "To create the repository, visit:"
        echo "  https://github.com/new"
        echo ""
        echo "Repository name: accelerating-success-content-generator"
        echo "Owner: perdomonestor01-hue"
        exit 1
    fi
else
    print_warning "Skipped GitHub push - you'll need to do this manually"
fi

# Step 4: Generate secrets
echo ""
echo "🔐 Step 4: Generating Security Secrets"
echo "═══════════════════════════════════════════════════════════"

NEXTAUTH_SECRET=$(openssl rand -base64 32)
CRON_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

print_success "Secrets generated"

# Step 5: Create Railway environment variables file
echo ""
echo "📝 Step 5: Creating Railway Environment Variables"
echo "═══════════════════════════════════════════════════════════"

cat > railway-env-vars.txt << EOF
# ==========================================
# COPY THIS TO RAILWAY VARIABLES
# ==========================================
# Railway Dashboard → Your Service → Variables → RAW Editor
# ==========================================

# CORE CONFIGURATION (auto-generated)
NEXTAUTH_URL=\${{RAILWAY_STATIC_URL}}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
CRON_SECRET=${CRON_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# BRAND CONFIGURATION
BRAND_NAME=Accelerating Success
BRAND_HANDLE=@AccSuccess
SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/

# POSTING CONTROL (start with false!)
POSTING_ENABLED=false

# ==========================================
# COPY THESE FROM YOUR .env FILE
# ==========================================

# AI PROVIDERS
ANTHROPIC_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
DEFAULT_AI_PROVIDER=claude

# TWITTER/X
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
TWITTER_BEARER_TOKEN=

# FACEBOOK
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_PAGE_ACCESS_TOKEN=
FACEBOOK_PAGE_ID=

# LINKEDIN
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_PERSON_URN=

# GOOGLE BLOGGER
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_BLOG_ID=

# TUMBLR
TUMBLR_CONSUMER_KEY=
TUMBLR_CONSUMER_SECRET=
TUMBLR_ACCESS_TOKEN=
TUMBLR_ACCESS_SECRET=
TUMBLR_BLOG_IDENTIFIER=

# ==========================================
# DO NOT ADD DATABASE_URL
# Railway creates this automatically
# ==========================================
EOF

print_success "Environment variables template created: railway-env-vars.txt"

# Step 6: Fill in values from .env
echo ""
echo "🔄 Step 6: Extracting Values from .env"
echo "═══════════════════════════════════════════════════════════"

if [ -f ".env" ]; then
    print_info "Copying values from your .env file..."

    # Create a filled version with actual values
    cat > railway-env-vars-filled.txt << EOF
# ==========================================
# FILLED RAILWAY ENVIRONMENT VARIABLES
# ⚠️  CONTAINS SECRETS - DO NOT COMMIT TO GIT
# ==========================================
# Copy-paste this into Railway Variables RAW Editor
# ==========================================

# CORE CONFIGURATION
NEXTAUTH_URL=\${{RAILWAY_STATIC_URL}}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
CRON_SECRET=${CRON_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# BRAND CONFIGURATION
$(grep "^BRAND_NAME=" .env || echo "BRAND_NAME=Accelerating Success")
$(grep "^BRAND_HANDLE=" .env || echo "BRAND_HANDLE=@AccSuccess")
$(grep "^SUBSCRIPTION_URL=" .env || echo "SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/")

# POSTING CONTROL
POSTING_ENABLED=false

# AI PROVIDERS
$(grep "^ANTHROPIC_API_KEY=" .env || echo "ANTHROPIC_API_KEY=")
$(grep "^GROQ_API_KEY=" .env || echo "GROQ_API_KEY=")
$(grep "^DEEPSEEK_API_KEY=" .env || echo "DEEPSEEK_API_KEY=")
$(grep "^DEFAULT_AI_PROVIDER=" .env || echo "DEFAULT_AI_PROVIDER=claude")

# TWITTER/X
$(grep "^TWITTER_API_KEY=" .env || echo "TWITTER_API_KEY=")
$(grep "^TWITTER_API_SECRET=" .env || echo "TWITTER_API_SECRET=")
$(grep "^TWITTER_ACCESS_TOKEN=" .env || echo "TWITTER_ACCESS_TOKEN=")
$(grep "^TWITTER_ACCESS_SECRET=" .env || echo "TWITTER_ACCESS_SECRET=")
$(grep "^TWITTER_BEARER_TOKEN=" .env || echo "TWITTER_BEARER_TOKEN=")

# FACEBOOK
$(grep "^FACEBOOK_APP_ID=" .env || echo "FACEBOOK_APP_ID=")
$(grep "^FACEBOOK_APP_SECRET=" .env || echo "FACEBOOK_APP_SECRET=")
$(grep "^FACEBOOK_PAGE_ACCESS_TOKEN=" .env || echo "FACEBOOK_PAGE_ACCESS_TOKEN=")
$(grep "^FACEBOOK_PAGE_ID=" .env || echo "FACEBOOK_PAGE_ID=")

# LINKEDIN
$(grep "^LINKEDIN_CLIENT_ID=" .env || echo "LINKEDIN_CLIENT_ID=")
$(grep "^LINKEDIN_CLIENT_SECRET=" .env || echo "LINKEDIN_CLIENT_SECRET=")
$(grep "^LINKEDIN_ACCESS_TOKEN=" .env || echo "LINKEDIN_ACCESS_TOKEN=")
$(grep "^LINKEDIN_PERSON_URN=" .env || echo "LINKEDIN_PERSON_URN=")

# GOOGLE BLOGGER
$(grep "^GOOGLE_CLIENT_ID=" .env || echo "GOOGLE_CLIENT_ID=")
$(grep "^GOOGLE_CLIENT_SECRET=" .env || echo "GOOGLE_CLIENT_SECRET=")
$(grep "^GOOGLE_REFRESH_TOKEN=" .env || echo "GOOGLE_REFRESH_TOKEN=")
$(grep "^GOOGLE_BLOG_ID=" .env || echo "GOOGLE_BLOG_ID=")

# TUMBLR
$(grep "^TUMBLR_CONSUMER_KEY=" .env || echo "TUMBLR_CONSUMER_KEY=")
$(grep "^TUMBLR_CONSUMER_SECRET=" .env || echo "TUMBLR_CONSUMER_SECRET=")
$(grep "^TUMBLR_ACCESS_TOKEN=" .env || echo "TUMBLR_ACCESS_TOKEN=")
$(grep "^TUMBLR_ACCESS_SECRET=" .env || echo "TUMBLR_ACCESS_SECRET=")
$(grep "^TUMBLR_BLOG_IDENTIFIER=" .env || echo "TUMBLR_BLOG_IDENTIFIER=")
EOF

    print_success "Created filled environment file: railway-env-vars-filled.txt"
    print_warning "This file contains secrets - do not commit to git!"
else
    print_warning ".env file not found - using template only"
fi

# Final instructions
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅ PREPARATION COMPLETE!                               ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

print_success "Your code is ready for Railway deployment!"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Go to Railway: https://railway.app/new"
echo "2. Login with GitHub (perdomonestor01@gmail.com)"
echo "3. Click 'Deploy from GitHub repo'"
echo "4. Select 'accelerating-success-content-generator'"
echo "5. Add PostgreSQL database (+ New → Database → PostgreSQL)"
echo "6. Click on your service → Variables → RAW Editor"
echo "7. Copy-paste contents of: railway-env-vars-filled.txt"
echo "8. Click 'Update Variables'"
echo "9. Wait for deployment to complete"
echo ""
echo "📄 Detailed guide: RAILWAY-DEPLOYMENT-MULTI-POSTER.md"
echo ""
echo "🔐 Generated Secrets (already in railway-env-vars-filled.txt):"
echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}"
echo "   CRON_SECRET: ${CRON_SECRET}"
echo "   ENCRYPTION_KEY: ${ENCRYPTION_KEY}"
echo ""
print_warning "Keep these secrets safe!"
echo ""
print_success "Ready to deploy! 🚀"
