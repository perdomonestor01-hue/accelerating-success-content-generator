#!/usr/bin/env node
require('dotenv').config();
const http = require('http');
const { TwitterApi } = require('twitter-api-v2');
const open = require('open');

async function getTwitterTokens() {
  console.log('\n🐦 Twitter OAuth Setup\n');
  console.log('This will open Twitter in your browser to authorize the app.');
  console.log('Make sure you\'re logged into the @AccSuccess Twitter account!\n');

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
  });

  // Step 1: Generate auth link
  const authLink = await client.generateAuthLink('http://localhost:3000/callback');

  console.log('✓ Authorization link generated');
  console.log('Opening browser...\n');

  // Step 2: Start local server to capture callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith('/callback')) {
        const url = new URL(req.url, 'http://localhost:3000');
        const oauthToken = url.searchParams.get('oauth_token');
        const oauthVerifier = url.searchParams.get('oauth_verifier');

        if (!oauthToken || !oauthVerifier) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<h1>❌ Error: Missing OAuth parameters</h1>');
          server.close();
          reject(new Error('Missing OAuth parameters'));
          return;
        }

        try {
          // Step 3: Exchange for access tokens
          const loggedClient = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: oauthToken,
            accessSecret: authLink.oauth_token_secret,
          });

          const { accessToken, accessSecret, screenName, userId } =
            await loggedClient.login(oauthVerifier);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1>✅ Twitter Authorization Successful!</h1>
                <p>Authorized as: <strong>@${screenName}</strong></p>
                <p>You can close this window and return to the terminal.</p>
              </body>
            </html>
          `);

          server.close();
          resolve({
            TWITTER_ACCESS_TOKEN: accessToken,
            TWITTER_ACCESS_SECRET: accessSecret,
            TWITTER_USER_ID: userId,
            TWITTER_SCREEN_NAME: screenName,
          });
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`<h1>❌ Error: ${error.message}</h1>`);
          server.close();
          reject(error);
        }
      }
    });

    server.listen(3000, async () => {
      console.log('Local server started on http://localhost:3000');
      await open(authLink.url);
      console.log('\nWaiting for authorization...');
    });
  });
}

if (require.main === module) {
  getTwitterTokens()
    .then(tokens => {
      console.log('\n✅ Success! Add these to your .env file:\n');
      Object.entries(tokens).forEach(([key, value]) => {
        console.log(`${key}="${value}"`);
      });
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = getTwitterTokens;
