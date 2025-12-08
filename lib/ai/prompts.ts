import { ContentGenerationParams } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// VARIETY ENGINE - Forces AI to create genuinely different content each time
// Instead of one massive prompt, we dynamically select structural elements
// ═══════════════════════════════════════════════════════════════════════════════

// Voice styles - different "personas" the content can take
const VOICE_STYLES = [
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
const NARRATIVE_FORMATS = [
  {
    id: 'teacher_transformation',
    name: 'Teacher Transformation Story',
    structure: `FOLLOW THIS EXACT 9-PART STRUCTURE:

1. HOOK QUESTION (Line 1): Start with a relatable pain point question + emoji
   Example: "Ever spend your entire Sunday prepping a solar system unit... only to have your students zone out on Monday? 🌠"

2. PERSONAL FAILURE STORY (2-3 sentences): Share a specific teaching failure with CONCRETE details
   - Include time spent (hours)
   - List specific activities (worksheets, videos, vocab cards)
   - Name the grade level and topic
   Example: "Here's what happened when I tried teaching the solar system to my 4th graders last year: I spent 4 hours creating worksheets, finding videos, and printing vocab cards."

3. CONTRAST MOMENT (1 sentence): The disappointing result
   Example: "Monday morning? Half the class was confused, and the other half was bored."

4. TRANSFORMATION STATEMENT (1 sentence): Introduce the change
   Example: "This year, I'm using Accelerating Success for my solar system unit, and it's completely different:"

5. BULLET BENEFITS (4 specific points): Use • bullets with personality
   - Each bullet should be specific and feature-focused
   - Include enthusiastic parenthetical asides like "(my kids are OBSESSED with the matching game)"
   - Highlight: ready-to-teach modules, bilingual support, STAAR alignment, time savings

6. SOCIAL PROOF (1-2 sentences): Introduce testimonial with context
   Example: "Check out what this teacher says: [testimonial link]"

7. EMOTIONAL PAYOFF (1-2 sentences): Share the best result emotionally
   Example: "The best part? I'm seeing WAY more engagement. Students are actually asking to do the vocab games during free time!"

8. DUAL CTAs:
   - Primary: "Ready to reclaim your weekends? [Start your free trial](link) - 7 days, zero commitment."
   - Secondary: "Not quite ready? [Try free resources](link) for lesson samples!"

9. HASHTAGS: 5 relevant hashtags at the end`,
    cta_placement: 'Dual CTAs after emotional payoff',
    priority: true // This format should be used more often
  },
  {
    id: 'before_after',
    name: 'Before/After Transformation',
    structure: 'Paint the "before" picture → describe what changed → show the "after" results',
    cta_placement: 'After showing results'
  },
  {
    id: 'problem_solution',
    name: 'Problem Deep-Dive → Solution',
    structure: 'Explore the problem in detail (make them feel seen) → introduce solution naturally → show how it works',
    cta_placement: 'After explaining solution'
  },
  {
    id: 'day_in_life',
    name: 'Day in the Life',
    structure: 'Describe a specific moment/day → the struggle → the turning point → current reality',
    cta_placement: 'Woven naturally into the story'
  },
  {
    id: 'myth_buster',
    name: 'Myth Busting',
    structure: 'State a common belief → challenge it with your experience → show the alternative reality',
    cta_placement: 'As proof of the alternative'
  },
  {
    id: 'confession',
    name: 'Teacher Confession',
    structure: 'Admit something you used to do/think → what you learned → how it changed your teaching',
    cta_placement: 'As part of what changed'
  },
  {
    id: 'listicle_story',
    name: 'Mini-Listicle with Story',
    structure: 'Share 3 things you wish you knew earlier → weave personal examples into each → end with the bigger picture',
    cta_placement: 'After the third point'
  }
];

// BANNED PHRASES - these should NEVER appear in generated content
// Note: "reclaim your weekends" is ALLOWED in CTAs (e.g., "Ready to reclaim your weekends?")
const BANNED_PHRASES = [
  'Sunday Prep Struggle',       // Overused title - banned
  'prep struggle',              // Overused phrase
  'I\'ve been there',           // Too generic
  'But what if I told you',     // Cliché opener
  'game-changer',               // Marketing cliché
  'Game changer',               // Marketing cliché
  'Let me tell you',            // Weak opener
  'Here\'s the thing',          // Overused transition
  'Sound familiar?',            // Too generic
  'Struggling with',            // Weak opener
  'Transform your classroom',   // Too generic (specific transforms OK)
  'imagine if',                 // Cliché opener
  'Imagine if',                 // Cliché opener
  'What if I said',             // Cliché opener
  'tired of spending',          // Negative tone opener
  'I hear you',                 // Too sales-y
  'We\'ve all been there',      // Too generic
  'That\'s where',              // Weak transition
  'Enter:',                     // Too dramatic
  // NO EMAIL LIST - use free resources links instead
  'email list',
  'join our email',
  'subscribe to our',
  'newsletter',
  'mailing list',
  'sign up for our email',
  'delivered to your inbox',
];

// Opening patterns - specific structures for the first 2 lines
const OPENING_PATTERNS = [
  { id: 'stat', pattern: 'Open with a specific number or statistic', example: '23 TEKS standards tested. 8 weeks left. My students were at 47% mastery.' },
  { id: 'quote', pattern: 'Open with something a student or colleague said', example: '"Ms. Rodriguez, can we do the science game again?" I nearly dropped my coffee.' },
  { id: 'confession', pattern: 'Open with an honest admission', example: 'I used to think STAAR prep had to be boring. I was so wrong.' },
  { id: 'contrast', pattern: 'Open with a surprising contrast', example: 'My quietest student became my most vocal science advocate. Here\'s why.' },
  { id: 'question', pattern: 'Open with a thought-provoking question', example: 'When did STAAR prep become synonymous with drill-and-kill?' },
  { id: 'moment', pattern: 'Open with a specific moment in time', example: 'Tuesday, 2:15 PM. My 4th period class was actually arguing about photosynthesis. In a good way.' },
  { id: 'realization', pattern: 'Open with a sudden realization', example: 'I realized I was spending more time FINDING resources than TEACHING. That had to stop.' },
  { id: 'challenge', pattern: 'Open by stating a challenge directly', example: 'Force and motion is one of the hardest TEKS units for 6th graders to grasp.' }
];

// Helper to select random element
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Select narrative format with priority weighting
// Teacher Transformation Story has 50% chance, others share remaining 50%
function selectNarrativeFormat() {
  const priorityFormat = NARRATIVE_FORMATS.find(f => f.id === 'teacher_transformation');
  const otherFormats = NARRATIVE_FORMATS.filter(f => f.id !== 'teacher_transformation');

  // 50% chance to use the priority format (Teacher Transformation)
  if (Math.random() < 0.5 && priorityFormat) {
    return priorityFormat;
  }

  return randomElement(otherFormats);
}

// Get today's variety elements (for logging and transparency)
export function getVarietyElements() {
  return {
    voiceStyle: randomElement(VOICE_STYLES),
    narrativeFormat: selectNarrativeFormat(),
    openingPattern: randomElement(OPENING_PATTERNS)
  };
}

export function buildContentGenerationPrompt(params: ContentGenerationParams): string {
  const { topic, concept, gradeLevel, contentAngle, testimonialUrl, testimonialTitle, recentTitles, recentHooks, painPoint, teksRef } = params;

  // Select variety elements for this generation
  // Using priority selection for narrative format (50% Teacher Transformation)
  const voiceStyle = randomElement(VOICE_STYLES);
  const narrativeFormat = selectNarrativeFormat();
  const openingPattern = randomElement(OPENING_PATTERNS);

  // Build recent posts section for reference
  const recentPostsSection = recentTitles && recentTitles.length > 0
    ? `AVOID THESE RECENT TITLES: ${recentTitles.slice(0, 5).join(', ')}`
    : '';

  // Pain point focus if provided
  const painPointFocus = painPoint
    ? `PAIN POINT: "${painPoint.title}" - ${painPoint.struggle}`
    : '';

  // Generate suggested titles based on voice/format/concept to guide the AI away from "Sunday Prep Struggle"
  const titleSuggestions = [
    `${gradeLevel} Grade ${concept} - A ${voiceStyle.name}'s Take`,
    `When ${concept} Finally Clicked for My Students`,
    `The ${concept} Breakthrough: A ${narrativeFormat.name.split(' ')[0]} Story`,
    `${concept}: What ${gradeLevel} Grade Teachers Need to Know`,
    `My ${concept} Teaching Transformation`,
    `${openingPattern.example.split('.')[0]} - Teaching ${concept}`
  ];

  return `Create social media content for Accelerating Success - bilingual Science resources for Texas teachers (grades 3-8).

⚠️⚠️⚠️ CRITICAL: The title "Sunday Prep Struggle" is BANNED. Do NOT use it. ⚠️⚠️⚠️

SUGGESTED TITLES (pick one or create similar):
${titleSuggestions.map((t, i) => `${i + 1}. "${t}"`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
🎭 TODAY'S WRITING STYLE (FOLLOW EXACTLY)
═══════════════════════════════════════════════════════════════════════════════

VOICE: ${voiceStyle.name}
${voiceStyle.description}

NARRATIVE FORMAT: ${narrativeFormat.name}
Structure: ${narrativeFormat.structure}

OPENING PATTERN: ${openingPattern.pattern}
Example: "${openingPattern.example}"

═══════════════════════════════════════════════════════════════════════════════
🚫 BANNED PHRASES - NEVER USE THESE
═══════════════════════════════════════════════════════════════════════════════
${BANNED_PHRASES.map(p => `• "${p}"`).join('\n')}

If you use ANY of these phrases, the content will be rejected.

═══════════════════════════════════════════════════════════════════════════════
📝 CONTENT DETAILS
═══════════════════════════════════════════════════════════════════════════════

TOPIC: ${concept} for ${gradeLevel} grade (TEKS-verified${teksRef ? ` - ${teksRef}` : ''})
ANGLE: ${contentAngle}
${painPointFocus}
TESTIMONIAL: ${testimonialUrl}
${recentPostsSection}

═══════════════════════════════════════════════════════════════════════════════
📊 PLATFORM REQUIREMENTS
═══════════════════════════════════════════════════════════════════════════════

All posts must:
1. Follow the VOICE and NARRATIVE FORMAT above exactly
2. Open with the OPENING PATTERN style
3. Mention TEKS/STAAR alignment naturally
4. Include the testimonial video link
5. End with TWO CTAs (NO email list - only these links):
   - Primary: [Start free trial](https://accelerating-success.com/subscriptions/)
   - Secondary: [Try free resources](https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/) OR [Free 8th grade modules](https://accelerating-success.com/free-8th-grade-conservation-of-mass-periodic-table-online-modules-canva-slide/)

LENGTHS:
• LinkedIn: 1,500-2,000 chars (story-driven, professional)
• Facebook: 1,200-1,500 chars (friendly, shareable)
• Reddit: 800-1,200 chars (authentic, community tone)
• Twitter: Under 280 chars
• Blogger: 5-7 paragraphs with HTML headings
• Tumblr: 3-4 casual paragraphs

LINKS: Use [text](url) format. Keep link text SHORT (2-3 words).

HASHTAGS (end of post):
• LinkedIn: 3-5 max (#STAAR #TEKS #TexasTeachers + topic)
• Facebook/Tumblr: 4-6
• Reddit: None
• Twitter: 2-3

═══════════════════════════════════════════════════════════════════════════════
🎯 ACCELERATING SUCCESS KEY BENEFITS (weave 2-3 into content)
═══════════════════════════════════════════════════════════════════════════════

• TEKS Chapter 112 aligned (2024-2025 implementation)
• Bilingual English/Spanish toggle for every resource
• Arcade-style games students love (not drill-and-kill)
• STAAR 2.0 format practice (drag & drop, multi-select)
• Ready-to-teach modules - zero prep time
• Vocabulary Energizers for academic language
• Perfect for stations, RTI groups, independent practice

LINKS (DO NOT use email list links - only these):
• Trial: https://accelerating-success.com/subscriptions/
• Free 5th grade: https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/
• Free 8th grade: https://accelerating-success.com/free-8th-grade-conservation-of-mass-periodic-table-online-modules-canva-slide/

Generate content in BOTH English and Spanish (bilingual platform).

Return ONLY valid JSON (no markdown, no code blocks):
{
  "ideaTitle": "Creative title reflecting the ${voiceStyle.id} voice and ${narrativeFormat.id} format",
  "linkedinPost": "Full post following ${voiceStyle.name} voice, ${narrativeFormat.name} structure, opening with ${openingPattern.pattern}",
  "redditPost": "Authentic community post (no hashtags)",
  "facebookPost": "Friendly shareable post",
  "twitterPost": "Under 280 chars",
  "bloggerPost": "HTML article with <h2> headings",
  "tumblrPost": "Casual 3-4 paragraphs",
  "linkedinPostEs": "Spanish version",
  "redditPostEs": "Spanish version",
  "facebookPostEs": "Spanish version",
  "twitterPostEs": "Spanish version under 280 chars",
  "bloggerPostEs": "Spanish HTML article",
  "tumblrPostEs": "Spanish casual post"
}`;
}

export function buildRecycleVariationPrompt(
  originalIdeaTitle: string,
  originalLinkedin: string,
  params: ContentGenerationParams
): string {
  const { topic, concept, testimonialUrl } = params;

  return `Take this successful content idea and create a FRESH VARIATION.

ORIGINAL IDEA: "${originalIdeaTitle}"
ORIGINAL LINKEDIN POST: "${originalLinkedin}"

Keep:
- Same topic: ${topic} - ${concept}
- Same benefits: bilingual, ready-to-teach, time-saving, game-based
- Same testimonial video: ${testimonialUrl}
- Same subscription offer: 7-day free trial

Change:
- Different hook/pain point (new teacher struggle or question)
- Different storytelling approach
- Fresh wording throughout (not copy-paste)
- Different hashtags

Example variations of "Sunday Prep Struggle":
- "Monday Morning Panic Mode"
- "Ever wake up at 2am stressing about lesson plans?"
- "The Teacher's Weeknight Struggle"

Generate 4 new platform posts that feel completely fresh but deliver the same value.

CRITICAL: Use embedded links, not raw URLs:
- LinkedIn: [text](url)
- Reddit: [text](url)
- Facebook: [text](url)
- Twitter: "text → url"

Return ONLY valid JSON:
{
  "ideaTitle": "new idea title here",
  "linkedinPost": "...",
  "redditPost": "...",
  "facebookPost": "...",
  "twitterPost": "..."
}`;
}
