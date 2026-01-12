#!/usr/bin/env node
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Track recently used elements to avoid repetition
const HISTORY_FILE = path.join(__dirname, '.post-history.json');

function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
  } catch (e) {}
  return { hooks: [], topics: [], hashtags: [] };
}

function saveHistory(history) {
  // Keep only last 5 of each
  history.hooks = history.hooks.slice(-5);
  history.topics = history.topics.slice(-5);
  history.hashtags = history.hashtags.slice(-3);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Shuffle and exclude recently used
function shuffleExcluding(arr, exclude) {
  const available = arr.filter(item => {
    const key = typeof item === 'string' ? item : item.concept;
    return !exclude.includes(key);
  });
  const pool = available.length > 0 ? available : arr;
  return pool.sort(() => Math.random() - 0.5);
}

// VARIETY POOLS
const topics = [
  { concept: 'Force and Motion', grade: '4th-5th', teks: 'TEKS 112.15' },
  { concept: 'States of Matter', grade: '5th', teks: 'TEKS 112.16' },
  { concept: 'Food Chains & Ecosystems', grade: '5th', teks: 'TEKS 112.16' },
  { concept: "Earth's Layers & Rock Cycle", grade: '6th', teks: 'TEKS 112.26' },
  { concept: 'Cells and Cell Theory', grade: '7th', teks: 'TEKS 112.27' },
  { concept: 'Photosynthesis', grade: '8th', teks: 'TEKS 112.28' },
  { concept: 'DNA and Heredity', grade: '8th', teks: 'TEKS 112.28' },
  { concept: 'Chemical vs Physical Changes', grade: '7th', teks: 'TEKS 112.27' },
  { concept: 'Water Cycle & Weather', grade: '4th-5th', teks: 'TEKS 112.15' },
  { concept: 'Plant & Animal Cells', grade: '6th', teks: 'TEKS 112.26' },
];

const painPoints = [
  'spending 4+ hours every Sunday prepping science lessons',
  'STAAR 2.0 pressure from admin wanting data every Friday',
  'students zoning out during complex science concepts',
  'bilingual learners struggling with academic vocabulary',
  'searching endlessly for TEKS-aligned resources',
  'students forgetting vocabulary by test day',
  'managing stations while pulling small groups',
];

const hooks = [
  // STAT/NUMBER OPENINGS
  '23% improvement in STAAR scores. 6 weeks. Zero extra prep time. Here\'s exactly what changed... 📊',
  '47 TEKS standards. 12 weeks left. I was panicking until I found this... 📚',
  '4 hours of prep became 10 minutes. My students\' scores? Up 30%. 🚀',

  // QUOTE/STUDENT MOMENT OPENINGS
  '"Miss, can we do the science game again?" I nearly dropped my coffee. My most disengaged student said that. ☕',
  '"This is actually fun!" - words I never expected during STAAR review. Here\'s what happened... 🎯',
  'My quietest student raised her hand 7 times yesterday. In ONE class period. ✋',

  // CONFESSION/REALIZATION OPENINGS
  'I\'ll admit it: I used to hate teaching this unit. Now it\'s my favorite. 🔬',
  'I was one Pinterest rabbit hole away from burning out completely. Then I made a change... 💡',
  'Confession: I spent more time SEARCHING for resources than actually TEACHING. That had to stop. 🛑',

  // CONTRAST/TRANSFORMATION OPENINGS
  'Last year: students groaning at science. This year: fighting over who gets to answer first. 🙋',
  'Monday morning. 8:15 AM. My 6th graders were actually ARGUING about science concepts. In a good way. ⚡',
  'From "Do we have to?" to "Can we keep going?" - here\'s what shifted everything... 🔄',

  // CHALLENGE/DIRECT OPENINGS
  'Teaching bilingual learners complex science vocabulary is HARD. Here\'s what finally worked... 🌎',
  'STAAR 2.0 formats were destroying my students\' confidence. Until we tried something different... 📝',
  'If your students forget vocabulary faster than you can teach it, read this... 🧠',

  // TIME/WEEKEND VARIETY OPENINGS
  'My weekends used to disappear into lesson planning. Now I actually rest. Here\'s how... 🏖️',
  'I got my free time back AND my students\' scores went up. Not a tradeoff - here\'s why... ⏰',
  'Personal time shouldn\'t mean "unpaid prep time." I finally figured that out... 🙌',
  'Friday night used to mean grading + planning. Now? Actually relaxing. What changed... 🎉',
  'My family noticed I was present again on weekends. The secret? Better resources... 👨‍👩‍👧',
  'I used to spend every free moment searching TPT and Pinterest. Never again... 🔍',
];

const hashtagSets = [
  '#STAAR #TEKS #TexasTeachers #ScienceEducation #EdTech',
  '#TeacherLife #ScienceTeacher #STAAR2025 #BilingualEducation #STEMeducation',
  '#TexasEducation #TEKS2025 #ScienceTeachers #ElementaryScience #MiddleSchoolScience',
  '#STAARprep #TEKSaligned #BilingualTeacher #ScienceIsFun #TeacherTips',
  '#Texas6thGrade #ScienceClass #EducatorLife #TeachersOfLinkedIn #STEM',
  '#STAAR2025 #TexasScience #BilingualEd #TeacherHacks #ScienceRocks',
];

// Testimonials with pre-written snippets for stronger CTAs
const testimonials = [
  {
    url: 'https://youtube.com/shorts/FC_5CXTUl9o',
    quote: '"My STAAR scores jumped 23% in just 6 weeks"',
    context: 'a 5th grade teacher who transformed her classroom'
  },
  {
    url: 'https://youtube.com/shorts/fcXj7ms7oqQ',
    quote: '"I went from 4 hours of Sunday prep to 10 minutes"',
    context: 'a bilingual teacher who got her weekends back'
  },
  {
    url: 'https://youtube.com/shorts/3wWcl8OHDXs',
    quote: '"My students actually ASK for more science practice now"',
    context: 'a 7th grade teacher who changed student engagement'
  },
];

async function generateAndPost() {
  // Load history to avoid repetition
  const history = loadHistory();

  // SHUFFLE AND SELECT (excluding recent)
  const topic = shuffleExcluding(topics, history.topics)[0];
  const painPoint = shuffleExcluding(painPoints, [])[0]; // Pain points can repeat
  const hook = shuffleExcluding(hooks, history.hooks)[0];
  const hashtags = shuffleExcluding(hashtagSets, history.hashtags)[0];
  const testimonial = shuffleExcluding(testimonials, [])[0]; // Testimonials can repeat

  console.log('═'.repeat(60));
  console.log('🎲 SHUFFLED CAMPAIGN SELECTIONS:');
  console.log('═'.repeat(60));
  console.log(`   📚 Topic: ${topic.concept} (${topic.grade}) - ${topic.teks}`);
  console.log(`   😤 Pain Point: ${painPoint}`);
  console.log(`   🎣 Hook: ${hook.substring(0, 50)}...`);
  console.log(`   🏷️  Hashtags: ${hashtags}`);
  console.log(`   🎬 Testimonial: ${testimonial.quote} - ${testimonial.context}`);
  console.log('═'.repeat(60) + '\n');

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Write a LinkedIn post for Accelerating Success - bilingual Science resources for Texas K-8 teachers.

TOPIC: ${topic.concept} for ${topic.grade} grade (${topic.teks})
PAIN POINT FOCUS: ${painPoint}
OPENING HOOK TO USE: ${hook}

═══════════════════════════════════════════════════════════════════════════════
⚠️⚠️⚠️ ANTI-SLOP RULES - VIOLATE THESE = CONTENT REJECTED ⚠️⚠️⚠️
═══════════════════════════════════════════════════════════════════════════════

🚫 FORBIDDEN STRUCTURAL PATTERNS (these make content feel robotic):
- "What if the key to X wasn't Y but Z?" ← BANNED FORMULA - INSTANT REJECTION
- "What if I told you..." ← BANNED
- "What if your students could..." ← BANNED
- Multiple links crammed together like [link1](url)[link2](url2)[link3](url3) ← BANNED
- Generic testimonial phrases like "Watch how one teacher solved this problem" ← BANNED
- Vague benefits like "discover the difference" or "see the impact" ← BANNED

✅ AUTHENTIC STORYTELLING REQUIREMENTS:
- Use SPECIFIC details: names, times, exact numbers, real moments
- BAD: "My students struggled with the water cycle"
- GOOD: "Maria stared at her STAAR practice test. Question 12. Water cycle. Blank."
- BAD: "Teachers love our resources"
- GOOD: "Thursday morning, 6:47 AM. Ms. Chen had 8 TEKS standards to cover before lunch."

✅ LINK INTEGRATION RULES:
- Spread links throughout the post naturally
- NEVER put 3+ links in the same paragraph
- Integrate as part of the narrative, not tacked on at the end

═══════════════════════════════════════════════════════════════════════════════
🎨 VISUAL STRUCTURE - FOLLOW THIS EXACT FORMAT
═══════════════════════════════════════════════════════════════════════════════

Your post MUST follow this 6-part visual structure with emoticons:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1: 🎯 HOOK LINE (attention grabber)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Start with: ${hook}
(Keep it punchy, 1-2 lines max, emoticon at start or end)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2: 📖 THE STORY/PROBLEM (2-3 short paragraphs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Each paragraph = 1-2 sentences MAX
- Use generous line breaks (blank line between paragraphs)
- Connect ${topic.concept} to the pain point: ${painPoint}
- Make it relatable for Texas teachers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3: ✨ SOLUTION BENEFITS (bullet points with emoticons)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format EXACTLY like this (pick 4 benefits, use DIFFERENT emoticons):

✨ What Accelerating Success offers:

🔥 Bilingual modules - English AND Spanish side-by-side
⏰ Zero prep time - ready-to-teach lessons
📊 STAAR 2.0 format practice (drag & drop, multi-select)
🎮 Interactive games students actually want to play
📚 100% TEKS Chapter 112 aligned

EMOTICON GUIDE (use variety):
🎯 = objectives/goals     ✨ = highlights/magic
📊 = data/statistics      💡 = insights/tips
🔥 = exciting results     ⏰ = time-saving
📚 = educational          🎮 = games/engagement
🌟 = standout features    🙌 = wins/celebrations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4: 🎬 TESTIMONIAL (with video link)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format like this:

🎬 Don't just take my word for it:
${testimonial.quote} - ${testimonial.context}
👉 Watch her story: ${testimonial.url}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 5: ➡️ DUAL CTAs (clearly formatted)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format EXACTLY like this:

➡️ Ready to transform your classroom?
1️⃣ [Start your 7-day free trial](https://accelerating-success.com/subscriptions/)
2️⃣ [Try FREE 5th grade modules](https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 6: 🏷️ HASHTAGS (3-5 at the end)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${hashtags}

═══════════════════════════════════════════════════════════════════════════════
📱 MOBILE-FIRST FORMATTING RULES
═══════════════════════════════════════════════════════════════════════════════
- Use GENEROUS line breaks (blank line between every section)
- Each paragraph = 1-2 sentences MAX
- Bullet points with emoticons for easy scanning
- Clear visual sections that pop on mobile screens
- Total length: 1,400-1,800 characters

═══════════════════════════════════════════════════════════════════════════════
🚫 BANNED - NEVER USE (INSTANT REJECTION):
═══════════════════════════════════════════════════════════════════════════════
- "email list" / "newsletter" / "mailing list"
- "Sunday Prep Struggle" / "prep struggle"
- "game-changer" / "game changer"
- "But what if I told you" / "What if I told you"
- "What if the key to" / "What if your students could"
- "wasn't about adding more" / "but about filling the gaps"
- "Watch how one teacher" / "solved this problem"
- "discover the difference" / "see the impact"
- "I've been there" / "We've all been there"
- "Sound familiar?" at the end
- "Transform your classroom"
- "Let me tell you" / "Here's the thing"
- Five identical emojis in a row

Return ONLY the post text. No explanations.`;

  console.log('📝 Generating content with Claude...\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: `You are a TEACHER sharing real classroom experiences with other teachers. You are NOT a corporate marketing writer.

ANTI-SLOP ENFORCEMENT - Your content will be REJECTED if:
1. You use ANY "What if the key to X wasn't Y but Z?" formulas - INSTANT REJECTION
2. You use "What if your students could..." - INSTANT REJECTION
3. You cram multiple links together unnaturally - INSTANT REJECTION
4. You use vague generic claims without specific details - INSTANT REJECTION
5. You sound like a corporate salesperson instead of a teacher - INSTANT REJECTION
6. You use ANY phrases from the banned list - INSTANT REJECTION

WHAT GOOD CONTENT LOOKS LIKE:

BAD (formulaic AI slop):
"What if the key to mastering the water cycle for STAAR prep wasn't about adding more curriculum, but about filling the gaps with the right resources? Watch how one teacher solved this problem."

GOOD (authentic teacher voice):
"Tuesday, 2:15 PM. My 4th period was actually ARGUING about evaporation vs condensation. In a good way. Three weeks ago, they couldn't tell me the difference."

Write like a REAL TEACHER sharing a breakthrough, not a marketer pitching a product.`,
    messages: [{ role: 'user', content: prompt }]
  });

  let post = message.content[0].text;

  // ANTI-SLOP CHECK: Verify no banned patterns slipped through
  const bannedPatterns = [
    'what if the key to',
    'what if your students could',
    'what if i told you',
    'but what if i told you',
    'wasn\'t about adding more',
    'but about filling the gaps',
    'watch how one teacher',
    'solved this problem',
    'discover the difference',
    'see the impact',
    'transform your classroom',
    'game-changer',
    'game changer',
  ];

  const postLower = post.toLowerCase();
  const foundPatterns = bannedPatterns.filter(pattern => postLower.includes(pattern));

  if (foundPatterns.length > 0) {
    console.log('\n🚨 ANTI-SLOP WARNING: Banned patterns detected!');
    foundPatterns.forEach(p => console.log(`   - "${p}"`));
    console.log('⚠️  Content may need manual review or regeneration.\n');
  }

  // CLEANUP STEP 1: Remove internal notes (anything between double underscores)
  post = post.replace(/__[^_]+__/g, '').trim();

  // CLEANUP STEP 2: Fix hashtag formatting issues
  post = post.replace(/hashtag#/gi, '#');
  post = post.replace(/hashtag #/gi, '#');

  // CLEANUP STEP 3: Remove any trailing/leading whitespace from lines
  post = post.split('\n').map(line => line.trimEnd()).join('\n');

  // CLEANUP STEP 4: Remove double blank lines
  post = post.replace(/\n{3,}/g, '\n\n');

  console.log('─'.repeat(60));
  console.log('GENERATED POST (cleaned):\n');
  console.log(post);
  console.log('\n─'.repeat(60));
  console.log(`📊 Character count: ${post.length}`);

  // Post to LinkedIn
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  console.log('\n💼 Posting to LinkedIn...');

  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: post },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );
    console.log('\n✅ SUCCESS! Posted to LinkedIn');
    console.log(`   Post ID: ${response.data.id}`);

    // Save to history to avoid repeating
    history.hooks.push(hook);
    history.topics.push(topic.concept);
    history.hashtags.push(hashtags);
    saveHistory(history);
    console.log('   📝 Saved to history (won\'t repeat soon)');
  } catch (error) {
    console.log('\n❌ LinkedIn Error:', error.response?.data?.message || error.message);
  }

  console.log('\n' + '═'.repeat(60));
}

generateAndPost().catch(console.error);
