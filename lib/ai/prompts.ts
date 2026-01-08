import { ContentGenerationParams, VarietySelection } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// VARIETY ENGINE v2.0 - Enforced Pattern Selection with Exclusion
// Patterns are selected BEFORE generation, tracked in DB, and excluded on repeat
// ═══════════════════════════════════════════════════════════════════════════════

// Voice styles - different "personas" the content can take
export const VOICE_STYLES = [
  {
    id: 'mentor',
    name: 'Experienced Mentor',
    description: 'Write as a veteran teacher sharing wisdom with newer colleagues. Warm, supportive, been-there-done-that tone.',
    openingStyle: 'Share a specific moment or realization from your teaching career',
    example: 'After 15 years teaching 6th grade science, I finally learned that engagement beats content coverage every time.'
  },
  {
    id: 'frustrated_ally',
    name: 'Frustrated Ally',
    description: 'Write as a teacher who is fed up with the same struggles, speaking directly to others who feel the same. Raw, honest, validating.',
    openingStyle: 'Express genuine frustration about a teaching challenge',
    example: 'Can we talk about how absurd it is that we\'re expected to cover 47 TEKS standards in 36 weeks?'
  },
  {
    id: 'excited_discoverer',
    name: 'Excited Discoverer',
    description: 'Write as someone who just found something amazing and can\'t wait to share. Enthusiastic, specific, genuine excitement.',
    openingStyle: 'Jump straight into what you discovered and why it matters',
    example: 'I just watched my most disengaged student ASK to stay in during recess to finish a science game. That never happens.'
  },
  {
    id: 'data_driven',
    name: 'Data-Driven Analyst',
    description: 'Write as a teacher who loves metrics and results. Lead with specific numbers and outcomes.',
    openingStyle: 'Open with a surprising statistic or data point from your classroom',
    example: 'My STAAR practice scores jumped 23% in 6 weeks. Here\'s exactly what changed.'
  },
  {
    id: 'question_asker',
    name: 'Curious Questioner',
    description: 'Write as someone exploring a problem out loud, inviting others into the conversation.',
    openingStyle: 'Ask a provocative question that makes teachers stop and think',
    example: 'What if STAAR prep didn\'t have to feel like STAAR prep?'
  },
  {
    id: 'storyteller',
    name: 'Classroom Storyteller',
    description: 'Write as a natural storyteller, focusing on a specific student moment or classroom scene.',
    openingStyle: 'Start with a vivid, specific classroom moment',
    example: 'Maria was staring at the ceiling. Again. Third day in a row. I knew I had to try something different.'
  }
];

// Narrative formats - different structural approaches to the content
export const NARRATIVE_FORMATS = [
  {
    id: 'teacher_transformation',
    name: 'Teacher Transformation Story',
    structure: 'Hook with specific moment → Personal teaching struggle (names, details) → Disappointing result → Discovery of solution → 3-4 bullet benefits → Testimonial link → Emotional payoff → Dual CTAs → Hashtags',
    cta_placement: 'Dual CTAs after emotional payoff'
  },
  {
    id: 'before_after',
    name: 'Before/After Transformation',
    structure: 'Paint vivid "before" picture (specific day/moment) → describe the exact change → show concrete "after" results with numbers',
    cta_placement: 'After showing results'
  },
  {
    id: 'problem_solution',
    name: 'Problem Deep-Dive → Solution',
    structure: 'Explore the problem in visceral detail (make them feel seen) → pause for impact → introduce solution as discovery → show how it works step by step',
    cta_placement: 'After explaining solution'
  },
  {
    id: 'day_in_life',
    name: 'Day in the Life',
    structure: 'Start with exact time and place → describe the struggle as it unfolds → the turning point moment → current reality comparison',
    cta_placement: 'Woven naturally into the story'
  },
  {
    id: 'myth_buster',
    name: 'Myth Busting',
    structure: 'State a common belief in quotes → challenge it with your specific experience → show the surprising alternative reality with proof',
    cta_placement: 'As proof of the alternative'
  },
  {
    id: 'confession',
    name: 'Teacher Confession',
    structure: 'Start with "I used to..." admission → describe what you learned the hard way → show the transformation in your teaching with specific example',
    cta_placement: 'As part of what changed'
  },
  {
    id: 'listicle_story',
    name: 'Mini-Listicle with Story',
    structure: 'Promise "3 things I wish I knew" → each point includes a mini-story from your classroom → end with the bigger picture revelation',
    cta_placement: 'After the third point'
  }
];

// Opening patterns - SPECIFIC structures for the first 2 lines (MUST follow exactly)
export const OPENING_PATTERNS = [
  { id: 'stat', pattern: 'Open with a SPECIFIC number or statistic', example: '23 TEKS standards tested. 8 weeks left. My students were at 47% mastery.' },
  { id: 'quote', pattern: 'Open with EXACT words a student or colleague said (in quotes)', example: '"Ms. Rodriguez, can we do the science game again?" I nearly dropped my coffee.' },
  { id: 'confession', pattern: 'Open with "I used to..." or "I\'ll admit it..."', example: 'I used to think STAAR prep had to be boring. I was so wrong.' },
  { id: 'contrast', pattern: 'Open with a surprising BEFORE → NOW contrast', example: 'My quietest student became my most vocal science advocate. Here\'s why.' },
  { id: 'question', pattern: 'Open with a provocative question (NOT rhetorical fluff)', example: 'When did STAAR prep become synonymous with drill-and-kill?' },
  { id: 'moment', pattern: 'Open with EXACT time and place', example: 'Tuesday, 2:15 PM. My 4th period class was actually arguing about photosynthesis. In a good way.' },
  { id: 'realization', pattern: 'Open with a sudden "I realized..." moment', example: 'I realized I was spending more time FINDING resources than TEACHING. That had to stop.' },
  { id: 'challenge', pattern: 'Open by stating a hard truth directly', example: 'Force and motion is one of the hardest TEKS units for 6th graders to grasp.' }
];

// BANNED PHRASES - these should NEVER appear in generated content
const BANNED_PHRASES = [
  'Sunday Prep Struggle',
  'prep struggle',
  'I\'ve been there',
  'But what if I told you',
  'game-changer',
  'Game changer',
  'Let me tell you',
  'Here\'s the thing',
  'Sound familiar?',
  'Struggling with',
  'Transform your classroom',
  'imagine if',
  'Imagine if',
  'What if I said',
  'tired of spending',
  'I hear you',
  'We\'ve all been there',
  'That\'s where',
  'Enter:',
  'email list',
  'join our email',
  'subscribe to our',
  'newsletter',
  'mailing list',
  'sign up for our email',
  'delivered to your inbox',
  'Are you tired',
  'Do you find yourself',
  'Picture this',
  'Let\'s face it',
  'The truth is',
  'Here\'s why',
  'spoiler alert',
  'pro tip',
  'hot take',
];

// Helper to select random element, EXCLUDING recent ones
function selectExcluding<T extends { id: string }>(arr: T[], excludeIds: string[]): T {
  const available = arr.filter(item => !excludeIds.includes(item.id));
  // If all are excluded (unlikely), fall back to full array
  const pool = available.length > 0 ? available : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Select narrative format with priority weighting, excluding recent
function selectNarrativeFormat(excludeIds: string[]) {
  const available = NARRATIVE_FORMATS.filter(f => !excludeIds.includes(f.id));
  const pool = available.length > 0 ? available : NARRATIVE_FORMATS;

  // Teacher Transformation gets 30% chance (reduced from 50%)
  const priorityFormat = pool.find(f => f.id === 'teacher_transformation');
  const otherFormats = pool.filter(f => f.id !== 'teacher_transformation');

  if (Math.random() < 0.3 && priorityFormat) {
    return priorityFormat;
  }

  return otherFormats[Math.floor(Math.random() * otherFormats.length)] || pool[0];
}

/**
 * Select variety elements BEFORE generation, excluding recent patterns
 * This is the KEY function - it ensures we don't repeat patterns
 */
export function selectVarietyElements(recentPatterns?: {
  voiceStyles: string[];
  narrativeFormats: string[];
  openingPatterns: string[];
}): VarietySelection {
  const excludeVoice = recentPatterns?.voiceStyles || [];
  const excludeNarrative = recentPatterns?.narrativeFormats || [];
  const excludeOpening = recentPatterns?.openingPatterns || [];

  return {
    voiceStyle: selectExcluding(VOICE_STYLES, excludeVoice),
    narrativeFormat: selectNarrativeFormat(excludeNarrative),
    openingPattern: selectExcluding(OPENING_PATTERNS, excludeOpening)
  };
}

export function buildContentGenerationPrompt(params: ContentGenerationParams): string {
  const {
    topic, concept, gradeLevel, contentAngle, testimonialUrl, testimonialTitle,
    recentTitles, recentHooks, painPoint, teksRef, varietyElements, featuredLab
  } = params;

  // Use provided variety elements OR select new ones (should be provided by cron)
  const voiceStyle = varietyElements?.voiceStyle || selectExcluding(VOICE_STYLES, []);
  const narrativeFormat = varietyElements?.narrativeFormat || selectNarrativeFormat([]);
  const openingPattern = varietyElements?.openingPattern || selectExcluding(OPENING_PATTERNS, []);

  // Build recent posts section for reference
  const recentPostsSection = recentTitles && recentTitles.length > 0
    ? `\n⚠️ DO NOT USE THESE RECENT TITLES: ${recentTitles.slice(0, 5).join(' | ')}`
    : '';

  // Pain point focus if provided
  const painPointSection = painPoint
    ? `
═══════════════════════════════════════════════════════════════════════════════
🎯 PAIN POINT FOCUS (Build content around THIS specific struggle)
═══════════════════════════════════════════════════════════════════════════════

"${painPoint.title}"
TEACHER'S STRUGGLE: ${painPoint.struggle}
YOUR SOLUTION TO OFFER: ${painPoint.solution}

HOOK IDEAS (use one or create similar):
${painPoint.hookIdeas.map((h, i) => `${i + 1}. "${h}"`).join('\n')}`
    : '';

  // Featured virtual lab section
  const featuredLabSection = featuredLab
    ? `
═══════════════════════════════════════════════════════════════════════════════
🧪 FEATURED VIRTUAL LAB (Highlight this specific resource!)
═══════════════════════════════════════════════════════════════════════════════

LAB NAME: "${featuredLab.name}"
CATEGORY: ${featuredLab.subcategory}
DESCRIPTION: ${featuredLab.description}
DIRECT LINK: ${featuredLab.url}

⭐ IMPORTANT: Mention this specific lab by name in your post!
Example: "Try our ${featuredLab.name} - ${featuredLab.description.toLowerCase()}"`
    : '';

  return `You are writing social media content for Accelerating Success - bilingual Science resources for Texas K-8 teachers.

═══════════════════════════════════════════════════════════════════════════════
⚠️⚠️⚠️ CRITICAL REQUIREMENTS - READ FIRST ⚠️⚠️⚠️
═══════════════════════════════════════════════════════════════════════════════

1. Your FIRST LINE must follow this EXACT opening pattern: "${openingPattern.pattern}"
   EXAMPLE: "${openingPattern.example}"

2. Write in the "${voiceStyle.name}" voice throughout:
   ${voiceStyle.description}

3. Follow the "${narrativeFormat.name}" structure:
   ${narrativeFormat.structure}

4. The title "Sunday Prep Struggle" and phrase "prep struggle" are BANNED.

5. Return ONLY valid JSON - no markdown, no code blocks, no explanation.
${recentPostsSection}

═══════════════════════════════════════════════════════════════════════════════
🚫 BANNED PHRASES - Using ANY of these will REJECT the content
═══════════════════════════════════════════════════════════════════════════════
${BANNED_PHRASES.map(p => `• "${p}"`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
📝 CONTENT REQUIREMENTS
═══════════════════════════════════════════════════════════════════════════════

TOPIC: ${concept} for ${gradeLevel} grade${teksRef ? ` (${teksRef})` : ''}
ANGLE: ${contentAngle}
TESTIMONIAL VIDEO: ${testimonialUrl}
${painPointSection}
${featuredLabSection}

═══════════════════════════════════════════════════════════════════════════════
🎭 VOICE & STRUCTURE ENFORCEMENT
═══════════════════════════════════════════════════════════════════════════════

VOICE: ${voiceStyle.name}
- ${voiceStyle.description}
- Opening style: ${voiceStyle.openingStyle}
- Example tone: "${voiceStyle.example}"

NARRATIVE: ${narrativeFormat.name}
- Structure: ${narrativeFormat.structure}
- CTA placement: ${narrativeFormat.cta_placement}

OPENING (MUST follow this pattern):
- Pattern: ${openingPattern.pattern}
- Your first line MUST match this style: "${openingPattern.example}"

═══════════════════════════════════════════════════════════════════════════════
📊 PLATFORM SPECS
═══════════════════════════════════════════════════════════════════════════════

LINKEDIN (1,500-2,000 chars) - ENHANCED STRUCTURE WITH EMOTICONS:
- Professional but warm
- Start with the EXACT opening pattern above
- USE EMOTICONS strategically to break up sections and add visual appeal:
  • 🎯 for key points or objectives
  • ✨ for benefits or highlights
  • 📊 for data/statistics
  • 💡 for insights or tips
  • 🔥 for exciting results
  • ⏰ for time-saving benefits
  • 📚 for educational content
  • 🙌 for celebrations or wins
  • ➡️ for action items or next steps
  • 🌟 for standout features
- STRUCTURE your LinkedIn post like this:
  1. 🎯 HOOK LINE (attention grabber with emoticon)
  2. 📖 STORY/PROBLEM (2-3 short paragraphs)
  3. ✨ SOLUTION BENEFITS (bullet points with emoticons):
     • 🔥 Benefit 1
     • ⏰ Benefit 2
     • 📊 Benefit 3
  4. 🎬 TESTIMONIAL (link to video if available)
  5. ➡️ DUAL CTAs (clearly formatted)
  6. 🏷️ HASHTAGS (3-5)
- Use line breaks generously for mobile readability
- Each paragraph should be 1-2 sentences MAX
- End with 3-5 hashtags: #STAAR #TEKS #TexasTeachers + topic-specific

FACEBOOK (1,200-1,500 chars):
- Friendly, shareable
- Same opening pattern
- Use emoticons (similar to LinkedIn)
- 4-6 hashtags at end

REDDIT (800-1,200 chars):
- Authentic community voice
- NO hashtags, NO emoticons
- Less promotional tone

TWITTER (under 280 chars) - VISUAL PUNCH:
- Start with emoticon hook: 🚀 or 🎯 or 💡
- ONE powerful insight or stat
- End with CTA + 2-3 hashtags
- Format: [emoticon] [punchy statement] [link] [hashtags]
- Example: "🚀 23% STAAR score jump in 6 weeks. Zero extra prep. Try free → [link] #STAAR #TexasTeachers"

BLOGGER (HTML blog post) - VISUAL STRUCTURE WITH FORMATTING:
Create a visually compelling blog post using this HTML structure:

<article>
  <h1>[SEO-optimized title with power word]</h1>

  <p>🎯 <strong>[Opening hook - attention-grabbing first sentence]</strong></p>

  <p>[2-3 sentences expanding on the problem/pain point]</p>

  <h2>📖 The Challenge Texas Teachers Face</h2>
  <p>[Describe the specific teaching struggle authentically - 2-3 sentences]</p>

  <h2>✨ The Solution: What Actually Works</h2>
  <p>Accelerating Success offers:</p>
  <ul>
    <li>🔥 <strong>Bilingual modules</strong> - English AND Spanish side-by-side</li>
    <li>⏰ <strong>Zero prep time</strong> - ready-to-teach lessons</li>
    <li>📊 <strong>STAAR 2.0 formats</strong> - drag & drop, multi-select practice</li>
    <li>🎮 <strong>Interactive games</strong> - students actually want to play</li>
    <li>📚 <strong>100% TEKS aligned</strong> - Chapter 112 guaranteed</li>
  </ul>

  <h2>🎬 Real Teacher Results</h2>
  <p>[Testimonial quote with context]</p>
  <p>👉 <a href="[testimonial_url]">Watch her full story</a></p>

  <h2>📊 The Transformation</h2>
  <p>[Specific results: prep time saved, score improvements, engagement changes]</p>

  <h2>➡️ Ready to Try It?</h2>
  <p><strong>Option 1:</strong> <a href="https://accelerating-success.com/subscriptions/">Start your 7-day free trial</a> - no commitment</p>
  <p><strong>Option 2:</strong> <a href="https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/">Try FREE 5th grade modules</a> - no signup needed</p>
</article>

TUMBLR (casual blog) - VISUAL STORYTELLING:
Format with emoticons and casual structure:

🎯 [Attention-grabbing hook]

📖 [2-3 sentence story about the teaching struggle - keep it real and relatable]

[Blank line for visual break]

✨ What's working for me now:
• 🔥 [Benefit 1 - short and punchy]
• ⏰ [Benefit 2]
• 🎮 [Benefit 3]
• 📊 [Benefit 4]

🎬 [Testimonial quote] - [link to video]

➡️ [Casual CTA - "Worth checking out if you're drowning in lesson planning"]
[link]

#STAAR #TEKS #TexasTeachers #ScienceEducation #BilingualEd #TeacherLife

═══════════════════════════════════════════════════════════════════════════════
🔗 LINKS (Use ONLY these - embed with [text](url) format)
═══════════════════════════════════════════════════════════════════════════════

• Trial: https://accelerating-success.com/subscriptions/
• Free 5th grade: https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/
• Free 8th grade: https://accelerating-success.com/free-8th-grade-conservation-of-mass-periodic-table-online-modules-canva-slide/
• Elementary Virtual Labs: https://accelerating-success.com/elementary-virtual-labs/
• Testimonial: ${testimonialUrl}${featuredLab ? `\n• Featured Lab: ${featuredLab.url}` : ''}

END every post with TWO CTAs:
1. [Start your free trial](https://accelerating-success.com/subscriptions/)
2. ${featuredLab
  ? `[Try the ${featuredLab.name}](${featuredLab.url})`
  : '[Try free resources](https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/)'}

═══════════════════════════════════════════════════════════════════════════════
✅ OUTPUT FORMAT - Return ONLY this JSON structure
═══════════════════════════════════════════════════════════════════════════════

{
  "ideaTitle": "Creative title (NOT Sunday Prep Struggle)",
  "linkedinPost": "Full LinkedIn post with emoticons, structured sections, and line breaks",
  "redditPost": "Reddit post (no hashtags, no emoticons)",
  "facebookPost": "Facebook post with emoticons",
  "twitterPost": "Under 280 chars with 1-2 emoticons",
  "bloggerPost": "HTML article with <h2> headings",
  "tumblrPost": "Casual 3-4 paragraphs",
  "imageSearchTerm": "2-4 word search term for finding a relevant education/classroom image (e.g., 'science classroom students', 'teacher helping student', 'kids science experiment')"
}`;
}

export function buildRecycleVariationPrompt(
  originalIdeaTitle: string,
  originalLinkedin: string,
  params: ContentGenerationParams
): string {
  const { topic, concept, testimonialUrl, varietyElements } = params;

  // Use NEW variety elements for the recycled version
  const voiceStyle = varietyElements?.voiceStyle || selectExcluding(VOICE_STYLES, []);
  const narrativeFormat = varietyElements?.narrativeFormat || selectNarrativeFormat([]);
  const openingPattern = varietyElements?.openingPattern || selectExcluding(OPENING_PATTERNS, []);

  return `Take this content and create a COMPLETELY DIFFERENT version using a new voice and structure.

ORIGINAL: "${originalIdeaTitle}"
ORIGINAL POST: "${originalLinkedin.substring(0, 500)}..."

═══════════════════════════════════════════════════════════════════════════════
🆕 NEW VOICE & STRUCTURE (Must be noticeably different from original)
═══════════════════════════════════════════════════════════════════════════════

VOICE: ${voiceStyle.name}
${voiceStyle.description}

NARRATIVE: ${narrativeFormat.name}
${narrativeFormat.structure}

OPENING PATTERN: ${openingPattern.pattern}
Example: "${openingPattern.example}"

Keep:
- Same topic: ${topic} - ${concept}
- Same benefits: bilingual, ready-to-teach, time-saving, game-based
- Same testimonial video: ${testimonialUrl}
- Same subscription offer: 7-day free trial

Change EVERYTHING ELSE:
- Different opening (follow the pattern above)
- Different story angle
- Different tone (match the voice above)
- Different structure (match the narrative above)
- Fresh wording throughout

Return ONLY valid JSON:
{
  "ideaTitle": "new title here",
  "linkedinPost": "...",
  "redditPost": "...",
  "facebookPost": "...",
  "twitterPost": "..."
}`;
}
