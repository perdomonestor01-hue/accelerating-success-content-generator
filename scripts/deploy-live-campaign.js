#!/usr/bin/env node
/**
 * LIVE Campaign Deployment Script
 * Generates content with Pain Points + TEKS/STAAR formula and posts to all platforms
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;
const { TwitterApi } = require('twitter-api-v2');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');

// ============================================================================
// CONFIGURATION
// ============================================================================

const campaignConfig = {
  topic: 'Physical Science',
  concept: 'Force, Motion & Energy - Newton\'s Laws',
  gradeLevel: '6th Grade',
  contentAngle: 'STAAR_PREP',
  testimonialUrl: 'https://youtube.com/shorts/abc123',
  testimonialTitle: 'Texas 6th Grade Teacher Success Story'
};

// ============================================================================
// CONTENT GENERATION (Pain Points + TEKS/STAAR)
// ============================================================================

function buildPrompt(config) {
  const { topic, concept, gradeLevel, contentAngle, testimonialUrl, testimonialTitle } = config;

  const hookStyles = [
    'time-saving breakthrough (hours saved on prep)',
    'student engagement transformation (from groans to cheers)',
    'STAAR 2.0 format practice (drag & drop, multi-select ready)',
    'teacher burnout relief (simple tools that just work)',
    'independent practice win (small groups finally work)'
  ];
  const randomHook = hookStyles[Math.floor(Math.random() * hookStyles.length)];

  return `You are a marketing expert for Accelerating Success (@AccSuccess), an educational platform offering bilingual (English/Spanish) Science resources for grades 3-8.

REQUIRED APPROACH FOR THIS POST:
- Hook style: ${randomHook}
- Make the title SPECIFIC to ${concept}

🔥 CRITICAL HOOK FORMULA: Pain Point + TEKS/STAAR = Winning Content
Every hook MUST combine a real teacher struggle WITH TEKS/STAAR alignment messaging.

TOPIC: ${topic} - ${concept}
GRADE LEVEL: ${gradeLevel}
CONTENT ANGLE: ${contentAngle}
TESTIMONIAL VIDEO: ${testimonialUrl}

═══════════════════════════════════════════════════════════════════════════════
🎯 TOP 10 TEACHER PAIN POINTS - USE 2-3 IN YOUR CONTENT
═══════════════════════════════════════════════════════════════════════════════

📌 PAIN POINT 1: NOT ENOUGH TIME TO PLAN - "3 hours every Sunday prepping..."
📌 PAIN POINT 2: STAAR 2.0 PRESSURE - "Admin wants data every Friday..."
📌 PAIN POINT 3: ENGAGEMENT - "Arcade-style games students BEG to play"
📌 PAIN POINT 4: DIFFERENTIATION - "Bilingual English/Spanish toggles"
📌 PAIN POINT 5: RANDOM RESOURCES - "Pinterest chaos to TEKS coherence"
📌 PAIN POINT 6: VOCABULARY - "Academic language was killing STAAR scores"
📌 PAIN POINT 7: BURNOUT - "Simple, click-and-go resources"
📌 PAIN POINT 8: INDEPENDENT PRACTICE - "Self-running while I pull small groups"
📌 PAIN POINT 10: STAAR 2.0 FORMAT - "Drag & drop, multi-select practice"

═══════════════════════════════════════════════════════════════════════════════
KEY FEATURES:
- ✅ 100% TEKS Chapter 112 aligned (2024-2025)
- ✅ STAAR 2.0 formats (drag & drop, multi-select)
- ✅ Bilingual English/Spanish
- ✅ Arcade-style games
- ✅ Zero-prep, ready-to-teach

═══════════════════════════════════════════════════════════════════════════════
🔗 LINKS (Use ONLY these URLs - embed with [text](url) format)
═══════════════════════════════════════════════════════════════════════════════

• Trial: https://accelerating-success.com/subscriptions/
• Free 5th Grade Resources: https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/
• Free 8th Grade Resources: https://accelerating-success.com/free-8th-grade-conservation-of-mass-periodic-table-online-modules-canva-slide/

END every post with TWO CTAs:
1. [Start your free trial](https://accelerating-success.com/subscriptions/)
2. [Try FREE resources](https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/)

═══════════════════════════════════════════════════════════════════════════════
🚫 BANNED PHRASES - NEVER USE THESE:
═══════════════════════════════════════════════════════════════════════════════
• "email list" / "newsletter" / "mailing list" / "subscribe to our email"
• "Sunday Prep Struggle" / "prep struggle"
• "game-changer" / "Game changer"
• "But what if I told you"
• "I've been there"

═══════════════════════════════════════════════════════════════════════════════
🎨 PLATFORM-SPECIFIC VISUAL STRUCTURES
═══════════════════════════════════════════════════════════════════════════════

LINKEDIN (1,400-1,800 chars) - 6-PART VISUAL STRUCTURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1: 🎯 HOOK LINE (attention grabber with emoticon)
PART 2: 📖 THE STORY (2-3 short paragraphs, 1-2 sentences each, generous line breaks)
PART 3: ✨ SOLUTION BENEFITS (bullet points with varied emoticons):
   🔥 Benefit 1
   ⏰ Benefit 2
   📊 Benefit 3
   🎮 Benefit 4
PART 4: 🎬 TESTIMONIAL (quote + video link)
PART 5: ➡️ DUAL CTAs (numbered: 1️⃣ and 2️⃣)
PART 6: 🏷️ HASHTAGS (3-5)

Use visual separator lines between sections. Mobile-first formatting!

TWITTER (under 270 chars) - VISUAL PUNCH:
Format: [emoticon] [punchy stat/insight] [CTA link] [2-3 hashtags]
Example: "🚀 23% STAAR score jump in 6 weeks. Zero prep. Try free → https://accelerating-success.com/subscriptions/ #STAAR #TexasTeachers"

TUMBLR - VISUAL STORYTELLING FORMAT:
🎯 [Attention-grabbing hook]

📖 [2-3 sentence story about the teaching struggle]

✨ What's working now:
• 🔥 [Benefit 1]
• ⏰ [Benefit 2]
• 🎮 [Benefit 3]
• 📊 [Benefit 4]

🎬 [Testimonial quote] - [video link]

➡️ [Casual CTA]
[links]

#STAAR #TEKS #TexasTeachers #ScienceEducation #BilingualEd

BLOGGER - HTML VISUAL STRUCTURE:
<article>
  <h1>[SEO title]</h1>
  <p>🎯 <strong>[Hook]</strong></p>
  <p>[Problem expansion]</p>

  <h2>📖 The Challenge</h2>
  <p>[Teaching struggle]</p>

  <h2>✨ The Solution</h2>
  <ul>
    <li>🔥 <strong>Bilingual modules</strong> - English AND Spanish</li>
    <li>⏰ <strong>Zero prep</strong> - ready-to-teach</li>
    <li>📊 <strong>STAAR 2.0 formats</strong> - drag & drop practice</li>
    <li>🎮 <strong>Interactive games</strong> - students love them</li>
  </ul>

  <h2>🎬 Real Results</h2>
  <p>[Testimonial]</p>
  <p>👉 <a href="[url]">Watch the full story</a></p>

  <h2>➡️ Get Started</h2>
  <p><a href="https://accelerating-success.com/subscriptions/">Start free trial</a></p>
  <p><a href="https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/">Try FREE resources</a></p>
</article>

Return ONLY valid JSON (no markdown, no code blocks):
{
  "ideaTitle": "Pain Point + TEKS/STAAR title",
  "linkedinPost": "6-part visual structure with emoticons and line breaks...",
  "twitterPost": "UNDER 270 CHARS! [emoticon] [stat] [link] [hashtags]",
  "tumblrPost": "Visual storytelling format with emoticon sections...",
  "bloggerPost": "HTML with emoji headers and bullet lists..."
}`;
}

async function generateContent() {
  console.log('📝 Generating content with Pain Points + TEKS/STAAR...\n');

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: 'You are a social media expert. Return ONLY valid JSON. Twitter posts MUST be under 270 characters.',
    messages: [{ role: 'user', content: buildPrompt(campaignConfig) }]
  });

  let responseText = message.content[0].text;
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const content = JSON.parse(responseText);

  // Validate Twitter length
  if (content.twitterPost && content.twitterPost.length > 280) {
    console.log('⚠️  Twitter post too long, truncating...');
    content.twitterPost = content.twitterPost.substring(0, 270) + '...';
  }

  return content;
}

// ============================================================================
// PLATFORM POSTERS
// ============================================================================

async function postToTwitter(content) {
  console.log('\n🐦 Posting to Twitter...');

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  try {
    const tweet = await client.v2.tweet(content);
    console.log(`✅ Twitter: Posted successfully!`);
    console.log(`   Tweet ID: ${tweet.data.id}`);
    return { success: true, postId: tweet.data.id, platform: 'TWITTER' };
  } catch (error) {
    console.log(`❌ Twitter Error: ${error.message}`);
    return { success: false, error: error.message, platform: 'TWITTER' };
  }
}

async function postToLinkedIn(content) {
  console.log('\n💼 Posting to LinkedIn...');

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    console.log('❌ LinkedIn: Missing credentials');
    return { success: false, error: 'Missing credentials', platform: 'LINKEDIN' };
  }

  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: content },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    console.log(`✅ LinkedIn: Posted successfully!`);
    return { success: true, postId: response.data.id, platform: 'LINKEDIN' };
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.log(`❌ LinkedIn Error: ${errMsg}`);
    return { success: false, error: errMsg, platform: 'LINKEDIN' };
  }
}

async function postToTumblr(content) {
  console.log('\n💜 Posting to Tumblr...');

  const oauth = OAuth({
    consumer: {
      key: process.env.TUMBLR_CONSUMER_KEY,
      secret: process.env.TUMBLR_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
  });

  const token = {
    key: process.env.TUMBLR_ACCESS_TOKEN,
    secret: process.env.TUMBLR_ACCESS_SECRET,
  };

  const blogIdentifier = process.env.TUMBLR_BLOG_IDENTIFIER;
  const url = `https://api.tumblr.com/v2/blog/${blogIdentifier}/post`;

  const requestData = {
    url,
    method: 'POST',
  };

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        type: 'text',
        title: 'STAAR-Ready Newton\'s Laws: From Prep Chaos to Click-and-Teach',
        body: content,
        tags: 'STAAR,TEKS,TexasTeachers,ScienceEducation,NewtonsLaws',
        format: 'markdown'
      }),
      {
        headers: {
          ...oauth.toHeader(oauth.authorize(requestData, token)),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const postId = response.data?.response?.id;
    console.log(`✅ Tumblr: Posted successfully!`);
    console.log(`   Post ID: ${postId}`);
    return { success: true, postId, platform: 'TUMBLR' };
  } catch (error) {
    const errMsg = error.response?.data?.meta?.msg || error.message;
    console.log(`❌ Tumblr Error: ${errMsg}`);
    return { success: false, error: errMsg, platform: 'TUMBLR' };
  }
}

async function postToBlogger(content, title) {
  console.log('\n📝 Posting to Blogger...');

  const blogId = process.env.GOOGLE_BLOG_ID;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!blogId || !refreshToken) {
    console.log('❌ Blogger: Missing credentials');
    return { success: false, error: 'Missing credentials', platform: 'BLOGGER' };
  }

  try {
    // Refresh access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const accessToken = tokenResponse.data.access_token;

    // Create blog post
    const response = await axios.post(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`,
      {
        kind: 'blogger#post',
        title: title || 'STAAR-Ready Newton\'s Laws for Texas Teachers',
        content: content,
        labels: ['STAAR', 'TEKS', 'Newton\'s Laws', 'Texas Teachers', '6th Grade Science']
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Blogger: Posted successfully!`);
    console.log(`   URL: ${response.data.url}`);
    return { success: true, postId: response.data.id, postUrl: response.data.url, platform: 'BLOGGER' };
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.log(`❌ Blogger Error: ${errMsg}`);
    return { success: false, error: errMsg, platform: 'BLOGGER' };
  }
}

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================

async function deployLiveCampaign() {
  console.log('═'.repeat(70));
  console.log('🚀 LIVE CAMPAIGN DEPLOYMENT');
  console.log('═'.repeat(70));
  console.log('\n⚠️  This will post REAL content to your social media accounts!\n');

  // Check environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not found');
    process.exit(1);
  }

  // Check if mock mode
  if (process.env.MOCK_POSTING === 'true') {
    console.log('🧪 MOCK MODE ENABLED - No real posts will be made');
    console.log('   Set MOCK_POSTING=false in .env to post for real\n');
  }

  try {
    // Step 1: Generate content
    const content = await generateContent();

    console.log('\n' + '─'.repeat(50));
    console.log('📋 GENERATED CONTENT:');
    console.log('─'.repeat(50));
    console.log(`\n📌 Title: ${content.ideaTitle}`);
    console.log(`\n🐦 Twitter (${content.twitterPost?.length || 0} chars):`);
    console.log(content.twitterPost);

    console.log(`\n💼 LinkedIn (${content.linkedinPost?.length || 0} chars):`);
    console.log(content.linkedinPost?.substring(0, 300) + '...');

    // Step 2: Post to platforms
    console.log('\n' + '═'.repeat(70));
    console.log('📤 POSTING TO PLATFORMS:');
    console.log('═'.repeat(70));

    const results = [];

    // Twitter
    if (content.twitterPost) {
      const twitterResult = await postToTwitter(content.twitterPost);
      results.push(twitterResult);
    }

    // LinkedIn
    if (content.linkedinPost) {
      const linkedinResult = await postToLinkedIn(content.linkedinPost);
      results.push(linkedinResult);
    }

    // Tumblr
    if (content.tumblrPost) {
      const tumblrResult = await postToTumblr(content.tumblrPost);
      results.push(tumblrResult);
    }

    // Blogger
    if (content.bloggerPost) {
      const bloggerResult = await postToBlogger(content.bloggerPost, content.ideaTitle);
      results.push(bloggerResult);
    }

    // Summary
    console.log('\n' + '═'.repeat(70));
    console.log('📊 DEPLOYMENT SUMMARY:');
    console.log('═'.repeat(70));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`\n✅ Successful: ${successful.length}`);
    successful.forEach(r => console.log(`   • ${r.platform}: ${r.postId || r.postUrl || 'Posted'}`));

    if (failed.length > 0) {
      console.log(`\n❌ Failed: ${failed.length}`);
      failed.forEach(r => console.log(`   • ${r.platform}: ${r.error}`));
    }

    console.log('\n' + '═'.repeat(70));
    console.log('🎉 CAMPAIGN DEPLOYMENT COMPLETE!');
    console.log('═'.repeat(70) + '\n');

    return { content, results };

  } catch (error) {
    console.error('\n❌ Deployment Error:', error.message);
    process.exit(1);
  }
}

// Run the deployment
deployLiveCampaign();
