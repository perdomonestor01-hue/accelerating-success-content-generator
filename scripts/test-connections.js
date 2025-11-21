#!/usr/bin/env node
/**
 * Test Social Media Platform Connections
 *
 * This script tests if all OAuth tokens are working correctly
 */

require('dotenv').config();
const { PostingManager } = require('../lib/social-media/posting-manager');

async function testConnections() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔍 Testing Social Media Connections                    ║
║   Accelerating Success - Content Automation              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

  console.log('Testing connections to all platforms...\n');

  try {
    const manager = new PostingManager();
    const results = await manager.testAllConnections();

    console.log('Results:\n');

    const platforms = [
      { key: 'TWITTER', name: 'Twitter/X', emoji: '🐦' },
      { key: 'FACEBOOK', name: 'Facebook', emoji: '📘' },
      { key: 'LINKEDIN', name: 'LinkedIn', emoji: '💼' },
      { key: 'BLOGGER', name: 'Google Blogger', emoji: '📝' },
      { key: 'TUMBLR', name: 'Tumblr', emoji: '📱' },
    ];

    let successCount = 0;
    let failCount = 0;

    platforms.forEach(({ key, name, emoji }) => {
      const success = results[key];
      const status = success ? '✅ Connected' : '❌ Failed';
      console.log(`  ${emoji} ${name.padEnd(20)} ${status}`);

      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`\n📊 Summary: ${successCount}/5 platforms working`);

    if (failCount > 0) {
      console.log('\n⚠️  Some platforms failed. Check:');
      console.log('   1. Are OAuth tokens configured in .env?');
      console.log('   2. Are tokens still valid (not expired)?');
      console.log('   3. Run: npm run setup-tokens\n');
      process.exit(1);
    } else {
      console.log('\n✅ All platforms are ready for automated posting!\n');
      console.log('   You can enable posting by setting:');
      console.log('   POSTING_ENABLED="true" in your .env\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Error testing connections:', error.message);
    console.error('\nMake sure you have:');
    console.error('  1. Run: npm install');
    console.error('  2. Created .env with credentials');
    console.error('  3. Run: npm run db:push\n');
    process.exit(1);
  }
}

testConnections();
