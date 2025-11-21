# 🔐 Quick Guide: Get Social Media Tokens

**⏱️ Time needed:** 10-15 minutes
**📍 Run this on:** Computer where Accelerating Success social media accounts are logged in

---

## Step 1: Check What You Need

```bash
npm run setup-tokens
```

This shows which tokens are missing with ✅ and ❌.

---

## Step 2: Get The Tokens

The script above will show you EXACTLY where to go for each platform. Here's the quick version:

### Twitter
1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Click your app → "Keys and tokens"
3. Click "Generate" under Access Token
4. Copy both tokens

### Facebook
1. Go to: https://developers.facebook.com/tools/explorer/
2. Click "Get Token" → "Get Page Access Token"
3. Select your page
4. Copy the token
5. Get Page ID from your Facebook Page settings

### LinkedIn
1. Go to: https://www.linkedin.com/developers/tools/oauth
2. Complete OAuth flow
3. Copy access token
4. Call API to get your Person URN

### Blogger
1. Go to: https://developers.google.com/oauthplayground
2. Select "Blogger API v3"
3. Authorize and get refresh token
4. Get Blog ID from Blogger dashboard

### Tumblr
1. Go to: https://api.tumblr.com/console
2. Click "Authenticate via OAuth"
3. Copy tokens
4. Note your blog URL

---

## Step 3: Add Tokens to .env

Open the `.env` file and add the tokens you just got:

```bash
# Twitter
TWITTER_ACCESS_TOKEN="paste-here"
TWITTER_ACCESS_SECRET="paste-here"

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN="paste-here"
FACEBOOK_PAGE_ID="paste-here"

# LinkedIn
LINKEDIN_ACCESS_TOKEN="paste-here"
LINKEDIN_PERSON_URN="paste-here"

# Blogger
GOOGLE_REFRESH_TOKEN="paste-here"
GOOGLE_BLOG_ID="paste-here"

# Tumblr
TUMBLR_ACCESS_TOKEN="paste-here"
TUMBLR_ACCESS_SECRET="paste-here"
TUMBLR_BLOG_IDENTIFIER="yourblog.tumblr.com"
```

---

## Step 4: Test It Works

```bash
npm run test-connections
```

You should see ✅ for all platforms!

---

## Step 5: Send Tokens to Production

Create a file called `.tokens.txt` with all the token values, then send it securely.

---

## Need Help?

- 📖 Detailed guide: `scripts/oauth/README.md`
- 🔧 Setup wizard: `npm run setup-tokens`
- ✅ Test connections: `npm run test-connections`

---

**Questions?** Contact Fabien
