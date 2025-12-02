# 🔐 Get Your OAuth Tokens - Step by Step

**You have the API Keys/Secrets. Now we need Access Tokens.**

## Quick Start

Run this in your terminal (one platform at a time):

```bash
cd ~/accelerating-success-content-generator
```

---

## 🐦 1. TWITTER

```bash
node scripts/oauth/twitter-oauth.js
```

This will:
1. Open Twitter in your browser
2. Ask you to authorize
3. Display the tokens in terminal

**Copy these to .env:**
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`

---

## 📘 2. FACEBOOK

Go to: https://developers.facebook.com/tools/explorer/

1. Select your app from dropdown
2. Click **"Generate Access Token"**
3. Select permissions: `pages_manage_posts`, `pages_read_engagement`
4. Click **"Generate Access Token"**
5. Authorize your Facebook page

Get your Page ID:
- Go to your Facebook Page
- Look at URL: `facebook.com/YOUR_PAGE_ID`
- Or: Page Settings → General → Page ID

**Copy these to .env:**
- `FACEBOOK_PAGE_ACCESS_TOKEN` = the long token you generated
- `FACEBOOK_PAGE_ID` = your page ID number

---

## 💼 3. LINKEDIN

Go to: https://www.linkedin.com/developers/tools/oauth/token-generator

1. Select your app
2. Check scopes: `openid`, `profile`, `w_member_social`
3. Click **"Request access token"**
4. Copy the access token

Get your Person URN:
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://api.linkedin.com/v2/userinfo
```
Your URN is: `urn:li:person:` + the `sub` value from response

**Copy these to .env:**
- `LINKEDIN_ACCESS_TOKEN` = the access token
- `LINKEDIN_PERSON_URN` = `urn:li:person:YOUR_SUB_ID`

---

## 📝 4. GOOGLE BLOGGER

Go to: https://developers.google.com/oauthplayground

1. Click ⚙️ (settings gear) → Check "Use your own OAuth credentials"
2. Enter your Client ID and Client Secret
3. In left panel, find "Blogger API v3" → Select all scopes
4. Click **"Authorize APIs"**
5. Sign in with Google
6. Click **"Exchange authorization code for tokens"**
7. Copy the **Refresh Token** (not access token!)

Get your Blog ID:
- Go to Blogger dashboard
- Your blog URL contains the ID: `blogger.com/blog/posts/BLOG_ID`

**Copy these to .env:**
- `GOOGLE_REFRESH_TOKEN` = the refresh token
- `GOOGLE_BLOG_ID` = your blog ID number

---

## 📱 5. TUMBLR

Go to: https://api.tumblr.com/console

1. Click **"Authenticate via OAuth"**
2. Authorize the app
3. You'll see OAuth Token and Secret displayed

**Copy these to .env:**
- `TUMBLR_ACCESS_TOKEN` = OAuth Token shown
- `TUMBLR_ACCESS_SECRET` = OAuth Token Secret shown
- `TUMBLR_BLOG_IDENTIFIER` = `yourblog.tumblr.com`

---

## ✅ After Getting All Tokens

1. Update your `.env` file with all the tokens
2. Test connections:
   ```bash
   npm run test-connections
   ```
3. Enable posting:
   ```bash
   # In .env, change:
   POSTING_ENABLED="true"
   ```

---

## 🚀 Ready to Auto-Post!

Once all tokens are configured, your daily cron job at `/api/cron` will:
1. Generate AI content using Claude
2. Post to all 5 platforms automatically
3. Track posting history in database

To test manually:
```bash
curl http://localhost:3000/api/cron
```

---

## Need Help?

- Check current status: `npm run setup-tokens`
- Test connections: `npm run test-connections`
