// Tumblr OAuth 1.0a - Step 2: Exchange for Access Token

const crypto = require('crypto');

// Load from environment variables
const CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET;

// From step 1 - set these after running step 1
const REQUEST_TOKEN = process.env.TUMBLR_REQUEST_TOKEN;
const REQUEST_TOKEN_SECRET = process.env.TUMBLR_REQUEST_TOKEN_SECRET;
const OAUTH_VERIFIER = process.env.TUMBLR_OAUTH_VERIFIER;

function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

function generateTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function generateSignature(method, url, params, tokenSecret = '') {
  const sortedParams = Object.keys(params).sort().map(k => `${percentEncode(k)}=${percentEncode(params[k])}`).join('&');
  const baseString = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(CONSUMER_SECRET)}&${percentEncode(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

async function getAccessToken() {
  const url = 'https://www.tumblr.com/oauth/access_token';
  const params = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_token: REQUEST_TOKEN,
    oauth_verifier: OAUTH_VERIFIER,
    oauth_version: '1.0',
  };

  params.oauth_signature = generateSignature('POST', url, params, REQUEST_TOKEN_SECRET);

  const authHeader = 'OAuth ' + Object.keys(params).map(k => `${percentEncode(k)}="${percentEncode(params[k])}"`).join(', ');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': authHeader },
  });

  const text = await response.text();
  const data = Object.fromEntries(new URLSearchParams(text));
  return data;
}

async function main() {
  console.log('\n🔮 Tumblr OAuth 1.0a - Getting Access Token\n');
  console.log('=' .repeat(60));

  try {
    console.log('\n📡 Exchanging for access token...');
    const accessToken = await getAccessToken();

    if (!accessToken.oauth_token) {
      console.error('Failed to get access token:', accessToken);
      return;
    }

    console.log('✅ Access token obtained!\n');
    console.log('=' .repeat(60));
    console.log('\n📋 YOUR TUMBLR CREDENTIALS:\n');
    console.log(`   Access Token: ${accessToken.oauth_token}`);
    console.log(`   Access Token Secret: ${accessToken.oauth_token_secret}`);
    console.log('\n=' .repeat(60));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
