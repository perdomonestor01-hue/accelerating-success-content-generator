// Deploy First Campaign - All 4 Platforms
require('dotenv').config();
const crypto = require('crypto');
const { TwitterApi } = require('twitter-api-v2');

// ============================================
// CAMPAIGN CONTENT
// ============================================
const campaign = {
  topic: 'Water Cycle',
  grade: '4th-5th',

  twitter: `🌧️ Teaching the Water Cycle to your 4th graders?

Stop spending hours on lesson prep! Accelerating Success has ready-to-teach bilingual modules with game-based vocab your kids will LOVE.

✅ English & Spanish
✅ STAAR-aligned
✅ 7-day free trial

Try it → https://accelerating-success.com/subscriptions/

#TeacherLife #ScienceEd`,

  linkedin: `Ever spend your entire Sunday prepping a Water Cycle unit... only to have your students zone out on Monday? 🌧️

I know the feeling. Hours creating worksheets, finding videos, printing vocab cards—and then half the class is confused anyway.

Here's what's been working for teachers using Accelerating Success:

🎮 **Game-based vocabulary** that students actually BEG to play
🇺🇸🇲🇽 **Every lesson in English AND Spanish** - perfect for bilingual learners
📝 **STAAR-aligned practice** built right in
⏰ **10-minute prep** instead of 4 hours

Check out what teachers are saying: https://youtube.com/shorts/FC_5CXTUl9o

The best part? Students are asking to do the vocab games during free time!

🎁 Ready to reclaim your weekends? Start your free 7-day trial: https://accelerating-success.com/subscriptions/

Not quite ready? Join our email list for free lesson samples: https://accelerating-success.com/subscribe

#TeacherLife #ScienceTeacher #STAAR #BilingualEducation #EdTech #4thGrade #WaterCycle`,

  blogger: {
    title: 'Teaching the Water Cycle: How to Save Hours of Prep Time',
    content: `
<h2>The Sunday Prep Struggle is Real</h2>
<p>If you're a 4th or 5th grade science teacher, you know the drill. Sunday afternoon rolls around, and you're staring at a blank lesson plan for your Water Cycle unit.</p>

<p>Hours later, you've created worksheets, found YouTube videos (half of which have ads), printed vocab cards, and prepared hands-on activities. Monday morning arrives, and... half your class is confused, the other half is bored.</p>

<p>Sound familiar?</p>

<h2>There's a Better Way</h2>
<p>What if you could prep your entire Water Cycle unit in 10-15 minutes instead of 4 hours?</p>

<p>That's exactly what teachers are experiencing with <strong>Accelerating Success</strong>, a platform designed specifically for 3rd-8th grade science instruction.</p>

<h2>What Makes It Different</h2>
<ul>
  <li><strong>🎮 Game-Based Vocabulary:</strong> Students don't just memorize terms—they PLAY with them. The matching games and interactive activities turn evaporation, condensation, and precipitation into concepts kids actually remember.</li>
  <li><strong>🇺🇸🇲🇽 Fully Bilingual:</strong> Every single lesson comes in both English AND Spanish. No more scrambling to translate materials for your bilingual learners.</li>
  <li><strong>📝 STAAR-Aligned:</strong> Built-in practice questions aligned to Texas standards, so your students are test-ready without extra prep work.</li>
  <li><strong>⏰ Ready-to-Teach Modules:</strong> Everything you need is prepared. Just open, teach, and watch your students engage.</li>
</ul>

<h2>Real Teachers, Real Results</h2>
<p>Don't just take our word for it. Check out what this teacher has to say: <a href="https://youtube.com/shorts/FC_5CXTUl9o">Watch the testimonial</a></p>

<h2>Try It Free for 7 Days</h2>
<p>Ready to reclaim your weekends? <a href="https://accelerating-success.com/subscriptions/">Start your free 7-day trial</a> — no credit card required, no strings attached.</p>

<p>Not ready to commit? <a href="https://accelerating-success.com/subscribe">Join our email list</a> for free lesson samples and teaching tips delivered to your inbox.</p>

<p><em>Your students (and your Sunday afternoons) will thank you.</em></p>
`
  },

  tumblr: {
    title: '🌧️ Water Cycle Teaching Made Easy',
    body: `<h2>Teachers, let's be real...</h2>

<p>Prepping science lessons shouldn't eat your entire weekend. 😤</p>

<p>If you're teaching the <strong>Water Cycle</strong> to your 4th or 5th graders, here's a game-changer:</p>

<p><strong>Accelerating Success</strong> has ready-to-teach modules with:</p>
<ul>
<li>🎮 Game-based vocab (kids literally BEG to play)</li>
<li>🇺🇸🇲🇽 Every lesson in English AND Spanish</li>
<li>📝 STAAR practice built in</li>
<li>⏰ 10-minute prep instead of hours</li>
</ul>

<p>Real talk: my students are asking to do vocab games during FREE TIME. That never happened before! 🤯</p>

<p>Check it out: <a href="https://youtube.com/shorts/FC_5CXTUl9o">Teacher testimonial</a></p>

<p>🎁 <a href="https://accelerating-success.com/subscriptions/">Start your free 7-day trial</a></p>

<p>Not ready? <a href="https://accelerating-success.com/subscribe">Get free resources via email</a></p>`,
    tags: 'education,teachers,science,watercycle,bilingual,teacherlife,edtech,4thgrade,5thgrade'
  }
};

// ============================================
// TWITTER POSTER
// ============================================
async function postToTwitter() {
  console.log('\n🐦 Posting to Twitter/X...');

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const tweet = await client.v2.tweet({ text: campaign.twitter });
  const url = `https://twitter.com/AccSuccess1/status/${tweet.data.id}`;
  console.log(`✅ Twitter: ${url}`);
  return url;
}

// ============================================
// LINKEDIN POSTER
// ============================================
async function postToLinkedIn() {
  console.log('\n🔗 Posting to LinkedIn...');

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  const postContent = {
    author: `urn:li:person:${personUrn}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: campaign.linkedin },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(postContent),
  });

  const postId = response.headers.get('x-restli-id');
  const url = `https://www.linkedin.com/feed/update/${postId}`;
  console.log(`✅ LinkedIn: ${url}`);
  return url;
}

// ============================================
// BLOGGER POSTER
// ============================================
async function postToBlogger() {
  console.log('\n📝 Posting to Blogger...');

  // Get fresh access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  const blogId = process.env.GOOGLE_BLOG_ID;
  const postContent = {
    kind: 'blogger#post',
    title: campaign.blogger.title,
    content: campaign.blogger.content,
  };

  const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postContent),
  });

  const postData = await response.json();
  console.log(`✅ Blogger: ${postData.url}`);
  return postData.url;
}

// ============================================
// TUMBLR POSTER
// ============================================
async function postToTumblr() {
  console.log('\n🔮 Posting to Tumblr...');

  const CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY;
  const CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET;
  const ACCESS_TOKEN = process.env.TUMBLR_ACCESS_TOKEN;
  const ACCESS_TOKEN_SECRET = process.env.TUMBLR_ACCESS_SECRET;
  const BLOG_ID = process.env.TUMBLR_BLOG_IDENTIFIER;

  function percentEncode(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  }

  function generateSignature(method, url, params, tokenSecret) {
    const sortedParams = Object.keys(params).sort().map(k => `${percentEncode(k)}=${percentEncode(params[k])}`).join('&');
    const baseString = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
    const signingKey = `${percentEncode(CONSUMER_SECRET)}&${percentEncode(tokenSecret)}`;
    return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  }

  const postUrl = `https://api.tumblr.com/v2/blog/${BLOG_ID}.tumblr.com/post`;

  const bodyParams = {
    type: 'text',
    title: campaign.tumblr.title,
    body: campaign.tumblr.body,
    tags: campaign.tumblr.tags
  };

  const oauthParams = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN,
    oauth_version: '1.0',
  };

  const allParams = { ...oauthParams, ...bodyParams };
  oauthParams.oauth_signature = generateSignature('POST', postUrl, allParams, ACCESS_TOKEN_SECRET);

  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ');

  const formBody = Object.keys(bodyParams)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(bodyParams[k])}`)
    .join('&');

  const response = await fetch(postUrl, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });

  const postData = await response.json();
  const postId = postData.response.id_string || postData.response.id;
  const url = `https://${BLOG_ID}.tumblr.com/post/${postId}`;
  console.log(`✅ Tumblr: ${url}`);
  return url;
}

// ============================================
// MAIN CAMPAIGN DEPLOYMENT
// ============================================
async function deployCampaign() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 DEPLOYING CAMPAIGN: Water Cycle (4th-5th Grade)');
  console.log('='.repeat(60));
  console.log(`\nTime: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT`);

  const results = {
    twitter: null,
    linkedin: null,
    blogger: null,
    tumblr: null,
  };

  try {
    results.twitter = await postToTwitter();
  } catch (error) {
    console.error('❌ Twitter failed:', error.message);
  }

  try {
    results.linkedin = await postToLinkedIn();
  } catch (error) {
    console.error('❌ LinkedIn failed:', error.message);
  }

  try {
    results.blogger = await postToBlogger();
  } catch (error) {
    console.error('❌ Blogger failed:', error.message);
  }

  try {
    results.tumblr = await postToTumblr();
  } catch (error) {
    console.error('❌ Tumblr failed:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 CAMPAIGN DEPLOYMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n🐦 Twitter:  ${results.twitter || '❌ Failed'}`);
  console.log(`🔗 LinkedIn: ${results.linkedin || '❌ Failed'}`);
  console.log(`📝 Blogger:  ${results.blogger || '❌ Failed'}`);
  console.log(`🔮 Tumblr:   ${results.tumblr || '❌ Failed'}`);
  console.log('\n' + '='.repeat(60));

  const successCount = Object.values(results).filter(r => r !== null).length;
  console.log(`\n🎉 Campaign deployed to ${successCount}/4 platforms!`);
  console.log('='.repeat(60) + '\n');
}

deployCampaign();
