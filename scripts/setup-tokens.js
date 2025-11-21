#!/usr/bin/env node
/**
 * Interactive OAuth Token Setup for Social Media Posting
 *
 * This script helps you collect OAuth access tokens for:
 * - Twitter/X
 * - Facebook
 * - LinkedIn
 * - Google Blogger
 * - Tumblr
 *
 * Run this on the computer where social media accounts are logged in.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔐 Social Media OAuth Token Setup                      ║
║   Accelerating Success - Content Automation              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

console.log('This wizard will help you set up OAuth tokens for automated posting.\n');
console.log('📋 Current Status:\n');

// Check which credentials are already configured
const tokens = {
  twitter: {
    name: 'Twitter/X',
    hasKeys: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET),
    hasTokens: !!(process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_ACCESS_SECRET),
  },
  facebook: {
    name: 'Facebook',
    hasKeys: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
    hasTokens: !!(process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID),
  },
  linkedin: {
    name: 'LinkedIn',
    hasKeys: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
    hasTokens: !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN),
  },
  blogger: {
    name: 'Google Blogger',
    hasKeys: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    hasTokens: !!(process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_BLOG_ID),
  },
  tumblr: {
    name: 'Tumblr',
    hasKeys: !!(process.env.TUMBLR_CONSUMER_KEY && process.env.TUMBLR_CONSUMER_SECRET),
    hasTokens: !!(process.env.TUMBLR_ACCESS_TOKEN && process.env.TUMBLR_ACCESS_SECRET),
  },
};

Object.entries(tokens).forEach(([key, info]) => {
  const keysStatus = info.hasKeys ? '✅' : '❌';
  const tokensStatus = info.hasTokens ? '✅' : '❌';
  console.log(`  ${keysStatus} ${info.name.padEnd(20)} API Keys: ${info.hasKeys ? 'Found' : 'Missing'}`);
  console.log(`  ${tokensStatus} ${' '.repeat(20)} Tokens: ${info.hasTokens ? 'Configured' : 'Needed'}`);
});

console.log('\n' + '═'.repeat(60) + '\n');

// Provide instructions based on what's missing
const needsTokens = Object.entries(tokens).filter(([_, info]) => info.hasKeys && !info.hasTokens);

if (needsTokens.length === 0) {
  console.log('✅ All platforms are fully configured!');
  console.log('\nYou can test your connections with:');
  console.log('  npm run test-social-media');
  process.exit(0);
}

console.log('📝 To get OAuth tokens, follow these simple steps:\n');

needsTokens.forEach(([platform, info], index) => {
  console.log(`${index + 1}. ${info.name}:`);

  switch (platform) {
    case 'twitter':
      console.log('   → Go to: https://developer.twitter.com/en/portal/dashboard');
      console.log('   → Select your app → "Keys and tokens" tab');
      console.log('   → Click "Generate" under "Access Token and Secret"');
      console.log('   → Copy both tokens to your .env file\n');
      break;

    case 'facebook':
      console.log('   → Go to: https://developers.facebook.com/tools/explorer/');
      console.log('   → Select your app from dropdown');
      console.log('   → Click "Get Token" → "Get Page Access Token"');
      console.log('   → Select your Facebook Page');
      console.log('   → Request permission: pages_manage_posts');
      console.log('   → Copy the token');
      console.log('   → Get Page ID from your Facebook Page settings\n');
      break;

    case 'linkedin':
      console.log('   → Go to: https://www.linkedin.com/developers/tools/oauth');
      console.log('   → Follow the OAuth 2.0 flow');
      console.log('   → Request scope: w_member_social');
      console.log('   → Copy the access token');
      console.log('   → Get Person URN from: https://api.linkedin.com/v2/userinfo\n');
      break;

    case 'blogger':
      console.log('   → Go to: https://developers.google.com/oauthplayground');
      console.log('   → Select "Blogger API v3"');
      console.log('   → Click "Authorize APIs"');
      console.log('   → Exchange authorization code for tokens');
      console.log('   → Copy the "Refresh Token"');
      console.log('   → Get Blog ID from Blogger dashboard URL\n');
      break;

    case 'tumblr':
      console.log('   → Go to: https://api.tumblr.com/console');
      console.log('   → Click "Authenticate via OAuth"');
      console.log('   → Complete the OAuth flow');
      console.log('   → Copy the access token and secret');
      console.log('   → Your blog identifier is: yourblog.tumblr.com\n');
      break;
  }
});

console.log('═'.repeat(60) + '\n');
console.log('💡 TIP: Once you get the tokens, add them to your .env file.');
console.log('Then run this script again to verify everything is set up!\n');
console.log('📄 For detailed instructions, see: scripts/oauth/README.md\n');

// Offer to save tokens to a separate file for easy transfer
console.log('═'.repeat(60));
console.log('\n📤 SENDING TOKENS TO PRODUCTION:\n');
console.log('After getting all tokens, create a file called ".tokens.txt" with this format:');
console.log(`
TWITTER_ACCESS_TOKEN="your-token-here"
TWITTER_ACCESS_SECRET="your-secret-here"

FACEBOOK_PAGE_ACCESS_TOKEN="your-token-here"
FACEBOOK_PAGE_ID="your-page-id-here"

LINKEDIN_ACCESS_TOKEN="your-token-here"
LINKEDIN_PERSON_URN="urn:li:person:YOUR-ID"

GOOGLE_REFRESH_TOKEN="your-refresh-token-here"
GOOGLE_BLOG_ID="your-blog-id-here"

TUMBLR_ACCESS_TOKEN="your-token-here"
TUMBLR_ACCESS_SECRET="your-secret-here"
TUMBLR_BLOG_IDENTIFIER="yourblog.tumblr.com"
`);

console.log('Then send this file securely to add to production .env\n');
