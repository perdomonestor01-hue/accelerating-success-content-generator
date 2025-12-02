# 🚂 Railway Deployment with Daily Cron Job

## Quick Deploy to Railway

### Step 1: Deploy the App

```bash
cd ~/accelerating-success-content-generator

# Login to Railway
railway login

# Initialize project (if not already)
railway init

# Deploy
railway up
```

### Step 2: Set Environment Variables

In Railway Dashboard → Your Project → Variables, add:

```env
# Database (Railway provides PostgreSQL)
DATABASE_URL=your-railway-postgres-url

# AI Provider
ANTHROPIC_API_KEY=sk-ant-api03-...
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=sk-...
DEFAULT_AI_PROVIDER=claude

# NextAuth (use your Railway URL)
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=generate-a-strong-secret-here

# Brand Info
SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/
BRAND_NAME=Accelerating Success
BRAND_HANDLE=@AccSuccess

# Social Media (add your tokens when ready)
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_SECRET=your-twitter-access-secret

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_PAGE_ACCESS_TOKEN=your-facebook-page-token
FACEBOOK_PAGE_ID=your-facebook-page-id

LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_ACCESS_TOKEN=your-linkedin-access-token
LINKEDIN_PERSON_URN=urn:li:person:your-id

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
GOOGLE_BLOG_ID=your-blogger-blog-id

TUMBLR_CONSUMER_KEY=your-tumblr-consumer-key
TUMBLR_CONSUMER_SECRET=your-tumblr-consumer-secret
TUMBLR_ACCESS_TOKEN=your-tumblr-access-token
TUMBLR_ACCESS_SECRET=your-tumblr-access-secret
TUMBLR_BLOG_IDENTIFIER=yourblog.tumblr.com

# Posting Config
POSTING_ENABLED=true
MOCK_POSTING=false
CRON_SECRET=your-secure-random-string-here
```

---

## Step 3: Set Up Daily Cron Job

### Option A: Free External Cron (Recommended)

Use [cron-job.org](https://cron-job.org) (free):

1. Sign up at https://cron-job.org
2. Create new cron job:
   - **URL**: `https://your-app.railway.app/api/cron`
   - **Schedule**: `0 8 * * *` (8 AM daily, adjust timezone)
   - **Request Method**: GET
   - **Headers**:
     - `Authorization`: `Bearer your-cron-secret`

### Option B: Railway Cron Service

Create a separate cron service in Railway:

1. In Railway Dashboard, click **"+ New"**
2. Select **"Empty Service"**
3. Name it "cron-trigger"
4. Add this start command:
   ```bash
   while true; do
     curl -H "Authorization: Bearer $CRON_SECRET" $MAIN_APP_URL/api/cron
     sleep 86400
   done
   ```
5. Set variables:
   - `CRON_SECRET`: same as main app
   - `MAIN_APP_URL`: your main app's Railway URL

### Option C: Railway Scheduled Deploys (Workaround)

Not ideal, but you can use Railway's scheduled deploys feature to trigger builds, then add a "postbuild" script.

---

## Step 4: Test the Cron Endpoint

After deployment, test manually:

```bash
# Replace with your Railway URL and secret
curl -H "Authorization: Bearer your-cron-secret" \
  https://your-app.railway.app/api/cron
```

Expected response:
```json
{
  "success": true,
  "message": "Daily content generated successfully",
  "content": { "id": "...", "ideaTitle": "..." },
  "posting": { "enabled": true, "results": [...] }
}
```

---

## Cron Schedule Reference

| Schedule | Meaning |
|----------|---------|
| `0 8 * * *` | Every day at 8:00 AM |
| `0 9 * * 1-5` | Weekdays at 9:00 AM |
| `0 10 * * 1` | Every Monday at 10:00 AM |
| `0 */6 * * *` | Every 6 hours |

---

## Monitoring

Check posting history in your app or via API:

```bash
curl https://your-app.railway.app/api/content
```

---

## Troubleshooting

### Cron not triggering?
- Check cron-job.org dashboard for execution logs
- Verify `CRON_SECRET` matches between cron service and app
- Check Railway logs: `railway logs`

### Posts failing?
- Check if tokens are expired (especially Facebook - 60 day limit)
- Review posting history in database
- Enable `MOCK_POSTING=true` temporarily to test

### Need to disable posting?
Set `POSTING_ENABLED=false` in Railway variables.

---

## Quick Reference

| Component | URL |
|-----------|-----|
| Main App | `https://your-app.railway.app` |
| Cron Endpoint | `https://your-app.railway.app/api/cron` |
| Railway Dashboard | `https://railway.app/dashboard` |
| Cron-job.org | `https://cron-job.org` |
