// Tumblr OAuth 1.0a Token Generator
// Step 1: Get request token and authorization URL

const crypto = require('crypto');

const CONSUMER_KEY = '0ExvWebB1drJyzPrC52XsYsKWfESbIRg3oZxEZUSMKevV92QIn';
const CONSUMER_SECRET = 'UmaJGrlQLy5ZrywEOhH5XUyJxsTG9JkjosDUZIyoCgEGmH6fcX';
const CALLBACK_URL = 'http://localhost:3000/callback';

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

async function getRequestToken() {
  const url = 'https://www.tumblr.com/oauth/request_token';
  const params = {
    oauth_callback: CALLBACK_URL,
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_version: '1.0',
  };

  params.oauth_signature = generateSignature('POST', url, params);

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
  console.log('\n🔮 Tumblr OAuth 1.0a Authorization\n');
  console.log('=' .repeat(60));

  try {
    console.log('\n📡 Getting request token...');
    const requestToken = await getRequestToken();

    if (!requestToken.oauth_token) {
      console.error('Failed to get request token:', requestToken);
      return;
    }

    console.log('✅ Request token obtained\n');
    console.log('=' .repeat(60));
    console.log('\n1. Open this URL in your browser:\n');
    console.log(`https://www.tumblr.com/oauth/authorize?oauth_token=${requestToken.oauth_token}`);
    console.log('\n2. Authorize the app');
    console.log('\n3. You\'ll be redirected to a URL like:');
    console.log('   http://localhost:3000/callback?oauth_token=XXX&oauth_verifier=YYY\n');
    console.log('4. Copy the FULL URL and paste it here.\n');
    console.log('=' .repeat(60));
    console.log('\n📋 SAVE THIS (needed for step 2):');
    console.log(`   Request Token: ${requestToken.oauth_token}`);
    console.log(`   Request Token Secret: ${requestToken.oauth_token_secret}\n`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
