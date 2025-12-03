#!/bin/bash

# Extract environment variables from .env and create Railway-ready file
cat > railway-env-vars-filled.txt << 'EOF'
# ==========================================
# RAILWAY ENVIRONMENT VARIABLES
# Copy this entire content to Railway:
# Dashboard → Service → Variables → RAW Editor
# ==========================================

# CORE CONFIGURATION
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
NEXTAUTH_SECRET=M/YPcyt6p6lK0Uc/brGnr2L0TUQjoyG+/VXXRY+p0zY=
CRON_SECRET=01e387550425ee64a3cf22e7564ecd0c14e72242523ec515271af898d6df8966
ENCRYPTION_KEY=3682b85e4983f0366cf656a1c8705f8566005e20faefb431b6dcf88bba497ab2

# BRAND CONFIGURATION
EOF

# Append values from .env
grep "^BRAND_NAME=" .env >> railway-env-vars-filled.txt || echo "BRAND_NAME=Accelerating Success" >> railway-env-vars-filled.txt
grep "^BRAND_HANDLE=" .env >> railway-env-vars-filled.txt || echo "BRAND_HANDLE=@AccSuccess" >> railway-env-vars-filled.txt
grep "^SUBSCRIPTION_URL=" .env >> railway-env-vars-filled.txt || echo "SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/" >> railway-env-vars-filled.txt

cat >> railway-env-vars-filled.txt << 'EOF'

# POSTING CONTROL (start disabled for testing)
POSTING_ENABLED=false

# AI PROVIDERS
EOF

grep "^ANTHROPIC_API_KEY=" .env >> railway-env-vars-filled.txt || echo "ANTHROPIC_API_KEY=" >> railway-env-vars-filled.txt
grep "^GROQ_API_KEY=" .env >> railway-env-vars-filled.txt || echo "GROQ_API_KEY=" >> railway-env-vars-filled.txt
grep "^DEEPSEEK_API_KEY=" .env >> railway-env-vars-filled.txt || echo "DEEPSEEK_API_KEY=" >> railway-env-vars-filled.txt
grep "^DEFAULT_AI_PROVIDER=" .env >> railway-env-vars-filled.txt || echo "DEFAULT_AI_PROVIDER=claude" >> railway-env-vars-filled.txt

cat >> railway-env-vars-filled.txt << 'EOF'

# TWITTER/X
EOF

grep "^TWITTER_API_KEY=" .env >> railway-env-vars-filled.txt || echo "TWITTER_API_KEY=" >> railway-env-vars-filled.txt
grep "^TWITTER_API_SECRET=" .env >> railway-env-vars-filled.txt || echo "TWITTER_API_SECRET=" >> railway-env-vars-filled.txt
grep "^TWITTER_ACCESS_TOKEN=" .env >> railway-env-vars-filled.txt || echo "TWITTER_ACCESS_TOKEN=" >> railway-env-vars-filled.txt
grep "^TWITTER_ACCESS_SECRET=" .env >> railway-env-vars-filled.txt || echo "TWITTER_ACCESS_SECRET=" >> railway-env-vars-filled.txt
grep "^TWITTER_BEARER_TOKEN=" .env >> railway-env-vars-filled.txt || echo "TWITTER_BEARER_TOKEN=" >> railway-env-vars-filled.txt

cat >> railway-env-vars-filled.txt << 'EOF'

# FACEBOOK
EOF

grep "^FACEBOOK_APP_ID=" .env >> railway-env-vars-filled.txt || echo "FACEBOOK_APP_ID=" >> railway-env-vars-filled.txt
grep "^FACEBOOK_APP_SECRET=" .env >> railway-env-vars-filled.txt || echo "FACEBOOK_APP_SECRET=" >> railway-env-vars-filled.txt
grep "^FACEBOOK_PAGE_ACCESS_TOKEN=" .env >> railway-env-vars-filled.txt || echo "FACEBOOK_PAGE_ACCESS_TOKEN=" >> railway-env-vars-filled.txt
grep "^FACEBOOK_PAGE_ID=" .env >> railway-env-vars-filled.txt || echo "FACEBOOK_PAGE_ID=" >> railway-env-vars-filled.txt

cat >> railway-env-vars-filled.txt << 'EOF'

# LINKEDIN
EOF

grep "^LINKEDIN_CLIENT_ID=" .env >> railway-env-vars-filled.txt || echo "LINKEDIN_CLIENT_ID=" >> railway-env-vars-filled.txt
grep "^LINKEDIN_CLIENT_SECRET=" .env >> railway-env-vars-filled.txt || echo "LINKEDIN_CLIENT_SECRET=" >> railway-env-vars-filled.txt
grep "^LINKEDIN_ACCESS_TOKEN=" .env >> railway-env-vars-filled.txt || echo "LINKEDIN_ACCESS_TOKEN=" >> railway-env-vars-filled.txt
grep "^LINKEDIN_PERSON_URN=" .env >> railway-env-vars-filled.txt || echo "LINKEDIN_PERSON_URN=" >> railway-env-vars-filled.txt

cat >> railway-env-vars-filled.txt << 'EOF'

# GOOGLE BLOGGER
EOF

grep "^GOOGLE_CLIENT_ID=" .env >> railway-env-vars-filled.txt || echo "GOOGLE_CLIENT_ID=" >> railway-env-vars-filled.txt
grep "^GOOGLE_CLIENT_SECRET=" .env >> railway-env-vars-filled.txt || echo "GOOGLE_CLIENT_SECRET=" >> railway-env-vars-filled.txt
grep "^GOOGLE_REFRESH_TOKEN=" .env >> railway-env-vars-filled.txt || echo "GOOGLE_REFRESH_TOKEN=" >> railway-env-vars-filled.txt
grep "^GOOGLE_BLOG_ID=" .env >> railway-env-vars-filled.txt || echo "GOOGLE_BLOG_ID=" >> railway-env-vars-filled.txt

cat >> railway-env-vars-filled.txt << 'EOF'

# TUMBLR
EOF

grep "^TUMBLR_CONSUMER_KEY=" .env >> railway-env-vars-filled.txt || echo "TUMBLR_CONSUMER_KEY=" >> railway-env-vars-filled.txt
grep "^TUMBLR_CONSUMER_SECRET=" .env >> railway-env-vars-filled.txt || echo "TUMBLR_CONSUMER_SECRET=" >> railway-env-vars-filled.txt
grep "^TUMBLR_ACCESS_TOKEN=" .env >> railway-env-vars-filled.txt || echo "TUMBLR_ACCESS_TOKEN=" >> railway-env-vars-filled.txt
grep "^TUMBLR_ACCESS_SECRET=" .env >> railway-env-vars-filled.txt || echo "TUMBLR_ACCESS_SECRET=" >> railway-env-vars-filled.txt
grep "^TUMBLR_BLOG_IDENTIFIER=" .env >> railway-env-vars-filled.txt || echo "TUMBLR_BLOG_IDENTIFIER=" >> railway-env-vars-filled.txt

echo ""
echo "✅ Railway environment variables created: railway-env-vars-filled.txt"
echo "⚠️  This file contains secrets - do not commit to git!"
