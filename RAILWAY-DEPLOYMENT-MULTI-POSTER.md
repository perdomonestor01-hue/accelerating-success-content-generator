# 🚀 Deploy Multi-Poster to Railway - Complete Guide

**Account**: perdomonestor01@gmail.com

## Quick Overview

This guide will help you deploy your **5-platform social media multi-poster** to Railway. The system will:
- ✅ Post to Twitter, Facebook, LinkedIn, Blogger, and Tumblr
- ✅ Auto-generate content daily at 9 AM Central Time
- ✅ Track all posts in a database
- ✅ Auto-retry failed posts

## Before You Begin

### ✅ Prerequisites Checklist

- [ ] OAuth tokens for all 5 platforms (see `MULTI-POSTER-OVERVIEW.md`)
- [ ] GitHub account (perdomonestor01-hue)
- [ ] Railway account (will create/login with perdomonestor01@gmail.com)
- [ ] 15-20 minutes of time

### 📝 Required Information

You'll need these API keys (already in your `.env`):
- Anthropic API key
- Groq API key (optional)
- DeepSeek API key (optional)
- All social media OAuth tokens

## Step-by-Step Deployment

### Step 1: Push to GitHub (5 minutes)

First, let's push your code to GitHub so Railway can access it.

**1.1 Check Git Status**
```bash
cd /Users/fabienp/accelerating-success-content-generator
git status
```

**1.2 Commit Any Pending Changes**
```bash
# Add all files
git add .

# Commit
git commit -m "Add multi-platform social media posting system"
```

**1.3 Create GitHub Repository**

Go to: https://github.com/new

- **Repository name**: `accelerating-success-content-generator`
- **Description**: "AI-powered social media multi-poster for Accelerating Success"
- **Visibility**: Private (recommended) or Public
- **Do NOT** initialize with README (you already have one)
- Click "Create repository"

**1.4 Push to GitHub**

```bash
# If you have an existing origin, remove it
git remote remove origin

# Add new GitHub repo as origin
git remote add origin https://github.com/perdomonestor01-hue/accelerating-success-content-generator.git

# Push to GitHub
git push -u origin main
```

### Step 2: Create Railway Project (10 minutes)

**2.1 Login to Railway**

1. Go to: https://railway.app/login
2. Click "Login with GitHub"
3. Use your GitHub account (perdomonestor01-hue)
4. Authorize Railway

**2.2 Create New Project**

1. Click "New Project" or go to: https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `accelerating-success-content-generator`
4. Railway will automatically detect Next.js configuration ✅

**2.3 Add PostgreSQL Database**

1. In your Railway project dashboard, click "+ New"
2. Select "Database"
3. Choose "Add PostgreSQL"
4. Railway automatically creates `DATABASE_URL` variable ✅

### Step 3: Configure Environment Variables (5 minutes)

**3.1 Access Variables**

1. In Railway dashboard, click on your service (the one with your app, not the database)
2. Click "Variables" tab
3. Click "RAW Editor" button

**3.2 Copy-Paste All Variables**

Copy this template and fill in your actual values from `.env`:

```bash
# ==========================================
# CORE CONFIGURATION
# ==========================================
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
NEXTAUTH_SECRET=generate-this-below
BRAND_NAME=Accelerating Success
BRAND_HANDLE=@AccSuccess
SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/

# ==========================================
# AI PROVIDERS (get from your .env)
# ==========================================
ANTHROPIC_API_KEY=your-anthropic-key-here
GROQ_API_KEY=your-groq-key-here
DEEPSEEK_API_KEY=your-deepseek-key-here
DEFAULT_AI_PROVIDER=claude

# ==========================================
# SOCIAL MEDIA POSTING CONTROL
# ==========================================
POSTING_ENABLED=false
CRON_SECRET=generate-random-secret-below
ENCRYPTION_KEY=generate-random-key-below

# ==========================================
# TWITTER/X CREDENTIALS
# ==========================================
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_SECRET=your-twitter-access-secret
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

# ==========================================
# FACEBOOK CREDENTIALS
# ==========================================
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_PAGE_ACCESS_TOKEN=your-facebook-page-token
FACEBOOK_PAGE_ID=your-facebook-page-id

# ==========================================
# LINKEDIN CREDENTIALS
# ==========================================
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_ACCESS_TOKEN=your-linkedin-access-token
LINKEDIN_PERSON_URN=your-linkedin-person-urn

# ==========================================
# GOOGLE BLOGGER CREDENTIALS
# ==========================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
GOOGLE_BLOG_ID=your-google-blog-id

# ==========================================
# TUMBLR CREDENTIALS
# ==========================================
TUMBLR_CONSUMER_KEY=your-tumblr-consumer-key
TUMBLR_CONSUMER_SECRET=your-tumblr-consumer-secret
TUMBLR_ACCESS_TOKEN=your-tumblr-access-token
TUMBLR_ACCESS_SECRET=your-tumblr-access-secret
TUMBLR_BLOG_IDENTIFIER=yourblog.tumblr.com
```

**3.3 Generate Required Secrets**

Run these commands locally to generate secure random values:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -hex 32

# Generate ENCRYPTION_KEY
openssl rand -hex 32
```

Copy the outputs and paste them into the corresponding variables in Railway.

**3.4 Copy Values from Local .env**

```bash
# Display your local .env (sensitive data - be careful!)
cat .env
```

Copy each value from your local `.env` to the Railway variables.

**IMPORTANT**:
- Keep `POSTING_ENABLED=false` for now
- We'll enable it after testing
- Do NOT copy `DATABASE_URL` (Railway creates this automatically)

**3.5 Save Variables**

Click "Update Variables" at the bottom of the page.

### Step 4: Deploy (Automatic - 3 minutes)

Railway will automatically:
1. Detect changes in variables
2. Build your Next.js app
3. Run `prisma generate`
4. Push database schema
5. Start the application

**Monitor Deployment:**
1. Click "Deployments" tab
2. Watch the build logs
3. Wait for "Success" status (usually 2-3 minutes)

### Step 5: Initialize Database & Create Admin User (2 minutes)

**5.1 Find Your Railway URL**

1. In Railway dashboard, click on your service
2. Copy the public URL (e.g., `https://accelerating-success-production.up.railway.app`)

**5.2 Create Admin User**

Use the script already in your project:

```bash
# Set your production DATABASE_URL
# Get this from Railway → PostgreSQL service → Variables → DATABASE_URL
export DATABASE_URL="postgresql://postgres:..."

# Run the admin creation script
node create-admin-user.js
```

Or manually create via Railway's PostgreSQL console:
1. Go to Railway → PostgreSQL service
2. Click "Query" tab
3. Run this SQL:

```sql
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'perdomonestor01@gmail.com',
  '$2a$10$YourHashedPasswordHere',  -- Use bcrypt to hash your password
  'Nestor Perdomo',
  'ADMIN',
  NOW(),
  NOW()
);
```

### Step 6: Test Your Deployment (5 minutes)

**6.1 Access Your App**

Visit your Railway URL: `https://your-app.up.railway.app`

**6.2 Login**

- Email: `perdomonestor01@gmail.com`
- Password: (your password)

**6.3 Generate Test Content**

1. Click "Generate Content"
2. Wait for AI to create posts
3. Review the generated content

**6.4 Test Platform Connections**

```bash
# Test from your terminal
curl https://your-app.up.railway.app/api/post/test
```

Should return:
```json
{
  "TWITTER": true,
  "FACEBOOK": true,
  "LINKEDIN": true,
  "BLOGGER": true,
  "TUMBLR": true
}
```

If any platform shows `false`, check that platform's credentials in Railway variables.

### Step 7: Set Up Automated Posting (5 minutes)

**7.1 Configure Cron Job**

1. In Railway dashboard, click on your service
2. Go to "Settings" tab
3. Scroll to "Cron Jobs" section
4. Click "+ Add Cron Job"

**Cron Job Configuration:**

- **Name**: `Daily Content Generation and Posting`
- **Schedule**: `0 15 * * *`
  *(This is 9 AM Central Time = 3 PM UTC)*
- **Command**:
  ```bash
  curl -X GET ${{RAILWAY_STATIC_URL}}/api/cron -H "Authorization: Bearer ${{CRON_SECRET}}"
  ```

5. Click "Save"

**7.2 Test Cron Manually**

```bash
# Replace with your actual values
curl -X GET https://your-app.up.railway.app/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Should respond with:
```json
{
  "success": true,
  "message": "Content generated successfully"
}
```

### Step 8: Gradual Rollout (Recommended)

**Day 1-2: Content Generation Only**

- Keep `POSTING_ENABLED=false`
- Let cron run for 2 days
- Review generated content in dashboard
- Check content quality

**Day 3: Manual Test Posting**

1. In dashboard, select a piece of content
2. Click "Post to Social Media"
3. Verify posts appear on all platforms
4. Check formatting looks good

**Day 4: Enable Automation**

1. Go to Railway → Variables
2. Change `POSTING_ENABLED=true`
3. Click "Update Variables"
4. Monitor the next cron run

**Ongoing: Monitor & Optimize**

- Check posting history daily
- Review engagement metrics on each platform
- Adjust AI prompts if needed (in `lib/ai/prompts.ts`)

## Post-Deployment Checklist

- [ ] App is accessible at Railway URL
- [ ] Can login with admin account
- [ ] Can generate content
- [ ] All 5 platform connections test successfully
- [ ] Cron job is configured
- [ ] Manual test post works on all platforms
- [ ] Monitoring is set up

## Monitoring & Maintenance

### Check Posting History

1. Login to your app
2. Go to dashboard
3. View "Posting History" table
4. Check for any failed posts

### View Railway Logs

1. Railway dashboard → Your service
2. Click "Observability" or "Logs" tab
3. Filter by time/severity
4. Look for errors

### Database Access

1. Railway dashboard → PostgreSQL service
2. Click "Data" tab
3. Browse tables:
   - `Content` - Generated content
   - `PostingHistory` - Post attempts and results
   - `User` - Admin users

### Retry Failed Posts

If a post fails, retry it via API:

```bash
curl -X POST https://your-app.up.railway.app/api/post/retry \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"contentId": "failed-content-id"}'
```

## Troubleshooting

### Deployment Fails

**Check build logs:**
1. Railway dashboard → Deployments
2. Click on failed deployment
3. Read error messages

**Common issues:**
- Missing environment variables
- Database connection error (check `DATABASE_URL`)
- Build timeout (increase in Railway settings)

### Platform Not Posting

1. **Check credentials**: Railway → Variables → Verify all tokens
2. **Test connection**: `/api/post/test` endpoint
3. **Check posting history**: Look for error messages
4. **Re-run OAuth**: Get fresh tokens if expired

### Cron Not Running

1. **Check cron configuration**: Railway → Settings → Cron Jobs
2. **Verify schedule**: Use https://crontab.guru to validate
3. **Test manually**: Run curl command from terminal
4. **Check logs**: Railway → Observability

### Token Expired

**Symptoms:**
- Platform returns "Invalid credentials"
- `PostingHistory` shows authentication errors

**Solution:**
1. Follow OAuth setup in `MULTI-POSTER-OVERVIEW.md`
2. Get fresh access token for that platform
3. Update in Railway → Variables
4. Retry failed posts

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection | Auto-created by Railway |
| `NEXTAUTH_URL` | Your app URL | Use `${{RAILWAY_STATIC_URL}}` |
| `NEXTAUTH_SECRET` | Auth secret | `openssl rand -base64 32` |
| `CRON_SECRET` | Cron auth | `openssl rand -hex 32` |
| `POSTING_ENABLED` | Enable/disable posting | `true` or `false` |

### AI Provider Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `GROQ_API_KEY` | No | Groq API key (alternative) |
| `DEEPSEEK_API_KEY` | No | DeepSeek API key (alternative) |
| `DEFAULT_AI_PROVIDER` | Yes | `claude`, `groq`, or `deepseek` |

### Social Media Variables

See `MULTI-POSTER-OVERVIEW.md` for detailed OAuth setup instructions.

## Cost Estimate

**Railway Costs:**
- Hobby Plan: $5/month (includes $5 credit)
- PostgreSQL: Included in Hobby plan
- Estimated usage: ~$3-4/month for this app

**External APIs:**
- Anthropic Claude: Pay-as-you-go (~$0.10/day for content generation)
- Social media APIs: All free tier (sufficient for 1 post/day)

**Total estimated cost: $8-10/month**

## Success Metrics

Once fully deployed, you should see:
- ✅ Daily content generated at 9 AM Central
- ✅ Posts appear on all 5 platforms automatically
- ✅ `PostingHistory` shows successful posts
- ✅ No errors in Railway logs
- ✅ Engagement on social media platforms

## Support & Resources

**Railway Resources:**
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**Project Documentation:**
- Multi-Poster Overview: `MULTI-POSTER-OVERVIEW.md`
- Social Media Setup: `SOCIAL-MEDIA-POSTING.md`
- OAuth Guide: `scripts/oauth/README.md`

**Testing Tools:**
- Token setup: `npm run setup-tokens`
- Connection test: `npm run test-connections`
- OAuth helpers: `scripts/oauth/`

## Next Steps After Deployment

1. **Week 1**: Monitor daily runs, ensure all platforms posting successfully
2. **Week 2**: Analyze engagement metrics, adjust content strategy
3. **Week 3**: Optimize AI prompts based on performance
4. **Ongoing**:
   - Refresh expired tokens
   - Update testimonial videos
   - Adjust posting schedule if needed
   - Add more platforms (future enhancement)

## Emergency Procedures

### Stop All Posting Immediately

```bash
# In Railway dashboard
Variables → POSTING_ENABLED → false → Update
```

Or via API:
```bash
# This stops future posts (current ones will complete)
curl -X POST https://your-app.up.railway.app/api/admin/posting/disable \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Rollback Deployment

1. Railway dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Redeploy"

### Delete All Scheduled Posts

Use Railway PostgreSQL console:
```sql
-- View pending content
SELECT * FROM "Content" WHERE status = 'DRAFT';

-- Delete if needed
DELETE FROM "Content" WHERE status = 'DRAFT';
```

---

## You're Ready! 🚀

Follow the steps above to deploy your multi-platform social media poster to Railway. The entire process takes about 30-45 minutes for the first time.

**Remember:**
1. Start with `POSTING_ENABLED=false`
2. Test thoroughly
3. Enable gradually
4. Monitor closely

Good luck with your deployment! 🎉
