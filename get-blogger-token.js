// Google Blogger OAuth 2.0 Token Generator
// Run this script, then open the URL in your browser

const CLIENT_ID = '305997237748-j33ella3krf8np4446usl7hhsp3ikteo.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Scopes needed for Blogger
const SCOPES = [
  'https://www.googleapis.com/auth/blogger',
].join(' ');

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;

console.log('\n📝 Google Blogger OAuth Authorization\n');
console.log('=' .repeat(60));
console.log('\n1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with the Google account that owns your Blogger blog');
console.log('\n3. Authorize the app');
console.log('\n4. You\'ll be redirected to a URL like:');
console.log('   http://localhost:3000/callback?code=XXXXXX\n');
console.log('5. Copy the "code" value from the URL and paste it here.\n');
console.log('=' .repeat(60));
