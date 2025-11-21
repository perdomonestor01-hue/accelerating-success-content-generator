# OAuth Token Setup Guide

## Quick Start

**On the computer where social media accounts are logged in:**

```bash
cd accelerating-success-content-generator
npm run setup-tokens
```

This will show you exactly what tokens you need and where to get them!

## Step-by-Step Instructions

### 1. Twitter/X

1. **Go to:** https://developer.twitter.com/en/portal/dashboard
2. **Click** on your app name
3. **Click** "Keys and tokens" tab
4. **Scroll down** to "Authentication Tokens"
5. **Click** "Generate" under "Access Token and Secret"
6. ⚠️ **Copy immediately** - they won't show again!
7. **Add to .env:**
   ```
   TWITTER_ACCESS_TOKEN="your-access-token-here"
   TWITTER_ACCESS_SECRET="your-access-secret-here"
   ```

### 2. Facebook

1. **Go to:** https://developers.facebook.com/tools/explorer/
2. **Select** your app from dropdown (top right)
3. **Click** "Get Token" button
4. **Select** "Get Page Access Token"
5. **Choose** your Facebook Page
6. **Check** permission: `pages_manage_posts`
7. **Click** "Generate Access Token"
8. **Copy** the token
9. **Get Page ID:**
   - Go to your Facebook Page
   - Click "About"
   - Scroll to bottom - Page ID is there
10. **Add to .env:**
    ```
    FACEBOOK_PAGE_ACCESS_TOKEN="your-long-token-here"
    FACEBOOK_PAGE_ID="your-page-id-numbers"
    ```

**⏰ Token expires in 60 days** - will auto-refresh

### 3. LinkedIn

1. **Go to:** https://www.linkedin.com/developers/apps
2. **Click** your app
3. **Click** "Auth" tab
4. **Copy** the OAuth 2.0 redirect URL: `https://www.linkedin.com/developers/tools/oauth`
5. **Use** LinkedIn's OAuth tool or Postman
6. **Request** scope: `w_member_social`
7. **Complete** OAuth flow
8. **Copy** access token
9. **Get Person URN:**
   ```bash
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        https://api.linkedin.com/v2/userinfo
   ```
   Copy the `sub` value (that's your URN)
10. **Add to .env:**
    ```
    LINKEDIN_ACCESS_TOKEN="your-access-token"
    LINKEDIN_PERSON_URN="your-sub-value-from-api"
    ```

### 4. Google Blogger

1. **Go to:** https://developers.google.com/oauthplayground
2. **Click** settings gear (top right)
3. **Check** "Use your own OAuth credentials"
4. **Enter** your Client ID and Secret (from .env)
5. **Close** settings
6. **Select** "Blogger API v3" from left sidebar
7. **Click** "Authorize APIs"
8. **Sign in** to Google account
9. **Click** "Exchange authorization code for tokens"
10. **Copy** the "Refresh token" (very long string)
11. **Get Blog ID:**
    - Go to blogger.com
    - URL will be: `blogger.com/blogger.g?blogID=XXXXXXXXX`
    - Copy those numbers
12. **Add to .env:**
    ```
    GOOGLE_REFRESH_TOKEN="your-very-long-refresh-token"
    GOOGLE_BLOG_ID="your-blog-id-numbers"
    ```

### 5. Tumblr

1. **Go to:** https://api.tumblr.com/console
2. **Click** "Authenticate via OAuth"
3. **Log in** to Tumblr
4. **Allow** access
5. **Copy** the Access Token and Access Token Secret shown
6. **Your blog identifier** is: `yourblogname.tumblr.com`
7. **Add to .env:**
   ```
   TUMBLR_CONSUMER_SECRET="your-actual-consumer-secret"
   TUMBLR_ACCESS_TOKEN="your-access-token"
   TUMBLR_ACCESS_SECRET="your-access-secret"
   TUMBLR_BLOG_IDENTIFIER="yourblog.tumblr.com"
   ```

## Verification

After adding all tokens, verify they work:

```bash
npm run test-connections
```

This will test each platform and show ✅ or ❌.

## Sending Tokens to Production

1. Create a file called `.tokens.txt`
2. Copy all the token values from your .env
3. Send securely (encrypted email, password manager, etc.)
4. Add to production Railway environment variables

## Troubleshooting

### "Invalid credentials" error
- Make sure you're logged into the RIGHT account when generating tokens
- Double-check you copied the entire token (no spaces/line breaks)

### "Permission denied" error
- Make sure you requested all required scopes/permissions
- For Facebook: need `pages_manage_posts`
- For LinkedIn: need `w_member_social`

### "Token expired" error
- Tokens expire! Here's the lifespan:
  - Twitter: Never expires (OAuth 1.0a)
  - Facebook: 60 days (auto-refreshes)
  - LinkedIn: ~60 days
  - Google: Refresh token never expires
  - Tumblr: Never expires

## Need Help?

Run the setup wizard:
```bash
npm run setup-tokens
```

It will show exactly what you're missing!
