// LinkedIn OAuth 2.0 Token Generator
// Run this script, then open the URL in your browser

const CLIENT_ID = '77gvomev0bhfhp';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Scopes needed for posting
const SCOPES = [
  'openid',
  'profile',
  'w_member_social',  // Required for posting
].join('%20');

const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}`;

console.log('\n🔗 LinkedIn OAuth Authorization\n');
console.log('=' .repeat(60));
console.log('\n1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with LinkedIn and authorize the app');
console.log('\n3. You\'ll be redirected to a URL like:');
console.log('   http://localhost:3000/callback?code=XXXXXX\n');
console.log('4. Copy the "code" value from the URL and paste it here.\n');
console.log('=' .repeat(60));
