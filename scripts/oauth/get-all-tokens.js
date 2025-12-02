#!/usr/bin/env node
/**
 * Complete OAuth Token Collector
 *
 * This script helps you get access tokens for ALL social media platforms.
 * Run on a computer where you're logged into all social media accounts.
 */

require('dotenv').config();
const http = require('http');
const https = require('https');
const { TwitterApi } = require('twitter-api-v2');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

const collectedTokens = {};

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🔐 Complete OAuth Token Setup - Accelerating Success      ║
║                                                              ║
║   This wizard will help you get tokens for ALL platforms.   ║
║   Make sure you're logged into each social media account!   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

// ==================== TWITTER ====================
async function setupTwitter() {
  console.log('\n' + '═'.repeat(60));
  console.log('🐦 TWITTER/X SETUP');
  console.log('═'.repeat(60));

  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
    console.log('❌ Missing TWITTER_API_KEY or TWITTER_API_SECRET in .env');
    return;
  }

  console.log('\nOpening browser for Twitter authorization...');
  console.log('Make sure you\'re logged into the @AccSuccess Twitter account!\n');

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
  });

  try {
    const authLink = await client.generateAuthLink('http://localhost:3333/callback/twitter');

    return new Promise((resolve) => {
      const server = http.createServer(async (req, res) => {
        if (req.url.startsWith('/callback/twitter')) {
          const url = new URL(req.url, 'http://localhost:3333');
          const oauthToken = url.searchParams.get('oauth_token');
          const oauthVerifier = url.searchParams.get('oauth_verifier');

          if (!oauthToken || !oauthVerifier) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>Error: Missing OAuth parameters</h1>');
            server.close();
            resolve();
            return;
          }

          try {
            const loggedClient = new TwitterApi({
              appKey: process.env.TWITTER_API_KEY,
              appSecret: process.env.TWITTER_API_SECRET,
              accessToken: oauthToken,
              accessSecret: authLink.oauth_token_secret,
            });

            const { accessToken, accessSecret, screenName, userId } =
              await loggedClient.login(oauthVerifier);

            collectedTokens.TWITTER_ACCESS_TOKEN = accessToken;
            collectedTokens.TWITTER_ACCESS_SECRET = accessSecret;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body style="font-family: sans-serif; padding: 40px; text-align: center; background: #1DA1F2; color: white;">
                  <h1>✅ Twitter Authorized!</h1>
                  <p>Account: <strong>@${screenName}</strong></p>
                  <p>Close this window and return to terminal.</p>
                </body>
              </html>
            `);

            console.log(`✅ Twitter authorized as @${screenName}`);
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<h1>Error: ${error.message}</h1>`);
            console.error('Twitter error:', error.message);
          }

          server.close();
          resolve();
        }
      });

      server.listen(3333, async () => {
        const open = require('open');
        await open(authLink.url);
        console.log('Waiting for Twitter authorization...');
      });
    });
  } catch (error) {
    console.error('Twitter setup error:', error.message);
  }
}

// ==================== FACEBOOK ====================
async function setupFacebook() {
  console.log('\n' + '═'.repeat(60));
  console.log('📘 FACEBOOK SETUP');
  console.log('═'.repeat(60));

  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    console.log('❌ Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET in .env');
    console.log('   Get these from: https://developers.facebook.com/apps/');
    return;
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = 'http://localhost:3333/callback/facebook';

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=pages_manage_posts,pages_read_engagement,pages_show_list`;

  console.log('\nOpening browser for Facebook authorization...');
  console.log('Make sure you\'re logged into the Accelerating Success Facebook account!\n');

  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith('/callback/facebook')) {
        const url = new URL(req.url, 'http://localhost:3333');
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error || !code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h1>Error: ${error || 'No code received'}</h1>`);
          server.close();
          resolve();
          return;
        }

        try {
          // Exchange code for user access token
          const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
            `client_id=${process.env.FACEBOOK_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&code=${code}`;

          const tokenResponse = await fetch(tokenUrl);
          const tokenData = await tokenResponse.json();

          if (tokenData.error) {
            throw new Error(tokenData.error.message);
          }

          const userAccessToken = tokenData.access_token;

          // Get pages
          const pagesResponse = await fetch(
            `https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`
          );
          const pagesData = await pagesResponse.json();

          if (!pagesData.data || pagesData.data.length === 0) {
            throw new Error('No Facebook Pages found for this account');
          }

          // Use first page
          const page = pagesData.data[0];
          collectedTokens.FACEBOOK_PAGE_ACCESS_TOKEN = page.access_token;
          collectedTokens.FACEBOOK_PAGE_ID = page.id;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center; background: #4267B2; color: white;">
                <h1>✅ Facebook Authorized!</h1>
                <p>Page: <strong>${page.name}</strong></p>
                <p>Close this window and return to terminal.</p>
              </body>
            </html>
          `);

          console.log(`✅ Facebook authorized for page: ${page.name}`);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`<h1>Error: ${error.message}</h1>`);
          console.error('Facebook error:', error.message);
        }

        server.close();
        resolve();
      }
    });

    server.listen(3333, async () => {
      const open = require('open');
      await open(authUrl);
      console.log('Waiting for Facebook authorization...');
    });
  });
}

// ==================== LINKEDIN ====================
async function setupLinkedIn() {
  console.log('\n' + '═'.repeat(60));
  console.log('💼 LINKEDIN SETUP');
  console.log('═'.repeat(60));

  if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
    console.log('❌ Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in .env');
    return;
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = 'http://localhost:3333/callback/linkedin';
  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}` +
    `&scope=openid%20profile%20w_member_social`;

  console.log('\nOpening browser for LinkedIn authorization...');
  console.log('Make sure you\'re logged into the Accelerating Success LinkedIn account!\n');

  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith('/callback/linkedin')) {
        const url = new URL(req.url, 'http://localhost:3333');
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error || !code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h1>Error: ${error || 'No code received'}</h1>`);
          server.close();
          resolve();
          return;
        }

        try {
          // Exchange code for access token
          const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: redirectUri,
              client_id: process.env.LINKEDIN_CLIENT_ID,
              client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            }),
          });

          const tokenData = await tokenResponse.json();

          if (tokenData.error) {
            throw new Error(tokenData.error_description || tokenData.error);
          }

          const accessToken = tokenData.access_token;
          collectedTokens.LINKEDIN_ACCESS_TOKEN = accessToken;

          // Get user info to construct person URN
          const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userData = await userResponse.json();

          collectedTokens.LINKEDIN_PERSON_URN = `urn:li:person:${userData.sub}`;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center; background: #0077B5; color: white;">
                <h1>✅ LinkedIn Authorized!</h1>
                <p>User: <strong>${userData.name}</strong></p>
                <p>Close this window and return to terminal.</p>
              </body>
            </html>
          `);

          console.log(`✅ LinkedIn authorized as ${userData.name}`);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`<h1>Error: ${error.message}</h1>`);
          console.error('LinkedIn error:', error.message);
        }

        server.close();
        resolve();
      }
    });

    server.listen(3333, async () => {
      const open = require('open');
      await open(authUrl);
      console.log('Waiting for LinkedIn authorization...');
    });
  });
}

// ==================== GOOGLE BLOGGER ====================
async function setupBlogger() {
  console.log('\n' + '═'.repeat(60));
  console.log('📝 GOOGLE BLOGGER SETUP');
  console.log('═'.repeat(60));

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env');
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = 'http://localhost:3333/callback/google';
  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('https://www.googleapis.com/auth/blogger')}` +
    `&access_type=offline` +
    `&prompt=consent` +
    `&state=${state}`;

  console.log('\nOpening browser for Google authorization...');
  console.log('Make sure you\'re logged into the Google account with Blogger access!\n');

  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith('/callback/google')) {
        const url = new URL(req.url, 'http://localhost:3333');
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error || !code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h1>Error: ${error || 'No code received'}</h1>`);
          server.close();
          resolve();
          return;
        }

        try {
          // Exchange code for tokens
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri,
            }),
          });

          const tokenData = await tokenResponse.json();

          if (tokenData.error) {
            throw new Error(tokenData.error_description || tokenData.error);
          }

          collectedTokens.GOOGLE_REFRESH_TOKEN = tokenData.refresh_token;

          // Get list of blogs
          const blogsResponse = await fetch(
            'https://www.googleapis.com/blogger/v3/users/self/blogs',
            { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
          );
          const blogsData = await blogsResponse.json();

          if (!blogsData.items || blogsData.items.length === 0) {
            throw new Error('No blogs found for this account');
          }

          const blog = blogsData.items[0];
          collectedTokens.GOOGLE_BLOG_ID = blog.id;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center; background: #F57C00; color: white;">
                <h1>✅ Blogger Authorized!</h1>
                <p>Blog: <strong>${blog.name}</strong></p>
                <p>Close this window and return to terminal.</p>
              </body>
            </html>
          `);

          console.log(`✅ Blogger authorized for: ${blog.name}`);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`<h1>Error: ${error.message}</h1>`);
          console.error('Blogger error:', error.message);
        }

        server.close();
        resolve();
      }
    });

    server.listen(3333, async () => {
      const open = require('open');
      await open(authUrl);
      console.log('Waiting for Google authorization...');
    });
  });
}

// ==================== TUMBLR ====================
async function setupTumblr() {
  console.log('\n' + '═'.repeat(60));
  console.log('📱 TUMBLR SETUP');
  console.log('═'.repeat(60));

  if (!process.env.TUMBLR_CONSUMER_KEY || !process.env.TUMBLR_CONSUMER_SECRET) {
    console.log('❌ Missing TUMBLR_CONSUMER_KEY or TUMBLR_CONSUMER_SECRET in .env');
    return;
  }

  console.log('\n⚠️  Tumblr requires OAuth 1.0a which is more complex.');
  console.log('Please go to: https://api.tumblr.com/console');
  console.log('1. Click "Authenticate via OAuth"');
  console.log('2. Authorize the app');
  console.log('3. Copy the OAuth Token and Secret shown\n');

  const token = await question('Enter Tumblr OAuth Token: ');
  const secret = await question('Enter Tumblr OAuth Secret: ');
  const blogId = await question('Enter your blog identifier (e.g., yourblog.tumblr.com): ');

  if (token && secret && blogId) {
    collectedTokens.TUMBLR_ACCESS_TOKEN = token.trim();
    collectedTokens.TUMBLR_ACCESS_SECRET = secret.trim();
    collectedTokens.TUMBLR_BLOG_IDENTIFIER = blogId.trim();
    console.log('✅ Tumblr tokens saved');
  } else {
    console.log('❌ Tumblr setup skipped (missing values)');
  }
}

// ==================== MAIN ====================
async function main() {
  console.log('We\'ll set up each platform one at a time.\n');
  console.log('Press Enter to start, or Ctrl+C to cancel...');
  await question('');

  await setupTwitter();
  await setupFacebook();
  await setupLinkedIn();
  await setupBlogger();
  await setupTumblr();

  rl.close();

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 SETUP COMPLETE!');
  console.log('═'.repeat(60));

  if (Object.keys(collectedTokens).length === 0) {
    console.log('\n❌ No tokens were collected.');
    process.exit(1);
  }

  console.log('\n📋 Collected tokens:\n');

  // Print tokens for .env
  console.log('Add these to your .env file:\n');
  console.log('─'.repeat(60));
  Object.entries(collectedTokens).forEach(([key, value]) => {
    console.log(`${key}="${value}"`);
  });
  console.log('─'.repeat(60));

  // Save to file
  const fs = require('fs');
  const tokensFile = '.tokens-collected.txt';
  const tokensContent = Object.entries(collectedTokens)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n');

  fs.writeFileSync(tokensFile, tokensContent);
  console.log(`\n✅ Tokens also saved to: ${tokensFile}`);
  console.log('⚠️  Delete this file after adding tokens to .env!\n');
}

main().catch(console.error);
