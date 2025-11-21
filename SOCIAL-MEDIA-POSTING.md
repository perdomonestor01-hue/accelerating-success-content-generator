# Social Media Automated Posting - Setup Guide

## ✅ What's Been Implemented

### Backend Complete ✓
- ✅ Database schema with `PostingHistory` and `SocialMediaConfig` models
- ✅ 6 testimonial videos added (3 teacher + 3 student)
- ✅ Social media posting service layer for all 5 platforms:
  - Twitter/X
  - Facebook
  - LinkedIn
  - Blogger (Google)
  - Tumblr
- ✅ Posting manager with retry logic and rate limiting
- ✅ Token manager for OAuth refresh
- ✅ API endpoints:
  - `/api/post` - Manual posting
  - `/api/post/test` - Test platform connections
  - `/api/post/retry` - Retry failed posts
- ✅ Updated AI prompts to generate Blogger and Tumblr content
- ✅ Cron job updated with automated posting

### Environment Variables ✓
All API keys added to `.env`:
- Twitter: API Key & Secret ✓
- Facebook: App ID & Secret ✓
- LinkedIn: Client ID & Secret ✓
- Blogger: Google Client ID & Secret ✓
- Tumblr: Consumer Key ✓

## 🔧 What You Need To Do

### Step 1: Complete OAuth Setup

You have the API keys, but you need to complete the OAuth flow to get ACCESS TOKENS for each platform.

#### Twitter/X Setup
1. Go to https://developer.x.com
2. Create a new App (if not already created)
3. Enable OAuth 2.0 with these scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`
4. Set callback URL: `http://localhost:3000/api/oauth/callback/twitter`
5. Generate OAuth tokens using the OAuth flow
6. Update `.env` with:
   ```
   TWITTER_ACCESS_TOKEN="your-access-token"
   TWITTER_ACCESS_SECRET="your-access-secret"
   ```

#### Facebook Setup
1. Go to https://developers.facebook.com
2. Create a Facebook Page (if you don't have one)
3. In your app, add "Facebook Login" and "Pages" products
4. Generate a Page Access Token:
   - Go to Tools → Graph API Explorer
   - Select your app
   - Get Token → Select your page
   - Request `pages_manage_posts`, `pages_read_engagement` permissions
5. Exchange short-lived token for long-lived token (60 days):
   ```bash
   https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_TOKEN
   ```
6. Update `.env` with:
   ```
   FACEBOOK_APP_ID="your-app-id-here"
   FACEBOOK_PAGE_ACCESS_TOKEN="your-long-lived-token"
   FACEBOOK_PAGE_ID="your-page-id"
   ```

#### LinkedIn Setup
1. Go to https://www.linkedin.com/developers
2. Add "Share on LinkedIn" and "Sign In with LinkedIn using OpenID Connect" products
3. Request `w_member_social` scope
4. Set redirect URI: `http://localhost:3000/api/oauth/callback/linkedin`
5. Use OAuth flow to get access token
6. Get your person URN:
   ```bash
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://api.linkedin.com/v2/userinfo
   ```
7. Update `.env` with:
   ```
   LINKEDIN_ACCESS_TOKEN="your-access-token"
   LINKEDIN_PERSON_URN="urn:li:person:YOUR_ID"
   ```

#### Google Blogger Setup
1. Go to https://console.cloud.google.com
2. Enable Blogger API v3
3. Create OAuth 2.0 credentials
4. Set redirect URI: `http://localhost:3000/api/oauth/callback/blogger`
5. Get refresh token using OAuth Playground or OAuth flow
6. Get your Blog ID from Blogger dashboard URL (blogger.com/blogger.g?blogID=XXXXXX)
7. Update `.env` with:
   ```
   GOOGLE_REFRESH_TOKEN="your-refresh-token"
   GOOGLE_BLOG_ID="your-blog-id"
   ```

#### Tumblr Setup
1. Go to https://www.tumblr.com/oauth/apps
2. Register your app
3. Complete OAuth 1.0a flow to get access tokens
4. Get your blog identifier (e.g., `yourblog.tumblr.com`)
5. Update `.env` with:
   ```
   TUMBLR_CONSUMER_SECRET="your-actual-consumer-secret"
   TUMBLR_ACCESS_TOKEN="your-access-token"
   TUMBLR_ACCESS_SECRET="your-access-secret"
   TUMBLR_BLOG_IDENTIFIER="yourblog.tumblr.com"
   ```

### Step 2: Test Platform Connections

Once you have OAuth tokens, test the connections:

```bash
curl http://localhost:3000/api/post/test
```

This will show which platforms are properly configured.

### Step 3: Test Manual Posting

1. Generate content from the dashboard
2. Copy the content ID
3. Test posting manually:

```bash
curl -X POST http://localhost:3000/api/post \
  -H "Content-Type: application/json" \
  -d '{"contentId": "your-content-id"}'
```

### Step 4: Configure Railway Cron

1. Deploy to Railway
2. Go to your service → Settings → Cron Jobs
3. Add a new cron job:
   - **Schedule**: `0 15 * * *` (9 AM Central = 3 PM UTC)
   - **Command**:
     ```bash
     curl -X GET ${{RAILWAY_STATIC_URL}}/api/cron \
       -H "Authorization: Bearer ${{CRON_SECRET}}"
     ```
4. Set environment variables in Railway:
   - Copy all variables from `.env`
   - Set `POSTING_ENABLED=false` initially
   - Once tested, set `POSTING_ENABLED=true`

### Step 5: Monitor & Test

1. **First day**: Keep `POSTING_ENABLED=false` - content generates but doesn't post
2. **Check content**: Review generated content in your dashboard
3. **Manual test**: Try posting manually to verify all platforms work
4. **Enable automation**: Set `POSTING_ENABLED=true`
5. **Monitor**: Watch the first automated run at 9 AM Central

## 📊 Posting History

All posting attempts are tracked in the `PostingHistory` table:
- Success/failure status
- Platform-specific post IDs and URLs
- Error messages for debugging
- Retry counts

## 🛡️ Safety Features

- ✅ `POSTING_ENABLED` kill switch
- ✅ Rate limit detection and backoff
- ✅ Automatic retry for failed posts
- ✅ OAuth token auto-refresh
- ✅ Individual platform enable/disable

## 🔍 Troubleshooting

### Platform Not Posting?
1. Check `.env` has all required tokens for that platform
2. Run `/api/post/test` to verify connection
3. Check `PostingHistory` table for error messages

### Rate Limited?
- Twitter: 50 posts/24hrs (free tier)
- Posts are automatically retried after cooldown

### Token Expired?
- Run the token refresh manually or wait for auto-refresh
- Facebook: Tokens last 60 days
- LinkedIn: Tokens last ~60 days
- Google: Refresh tokens don't expire

## 📝 Next Steps

1. Complete OAuth setup for all platforms (see Step 1 above)
2. Test each platform individually
3. Deploy to Railway
4. Configure cron job
5. Monitor first automated posting day

## 🎯 Current Status

- ✅ Backend implementation: 100% complete
- ⏳ OAuth setup: Needs your action (API keys ready, need access tokens)
- ⏳ Testing: Ready once OAuth complete
- ⏳ Production deployment: Ready for Railway

**Estimated time to complete**: 1-2 hours for OAuth setup and testing
