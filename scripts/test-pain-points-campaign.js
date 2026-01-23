#!/usr/bin/env node
/**
 * Test script for Pain Points + TEKS/STAAR enhanced prompts
 * Generates a FULL campaign to verify the new combined messaging
 * Tests all platforms with the 10 Teacher Pain Points framework
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;

// Build the full prompt with 10 Pain Points (inlined from prompts.ts)
function buildContentGenerationPrompt(params) {
  const { topic, concept, gradeLevel, contentAngle, testimonialUrl, testimonialTitle, recentTitles, recentHooks } = params;

  // Generate a random hook style to force variety - TEKS/STAAR focused + Pain Points
  const hookStyles = [
    'STAAR anxiety (testing pressure, score goals, admin expectations)',
    'TEKS coverage panic (so many standards, not enough time)',
    'success story (student breakthrough on STAAR-tested concept)',
    'question about STAAR prep (thought-provoking)',
    'comparison (before vs after TEKS-aligned resources)',
    'STAAR statistics (passing rates, growth scores)',
    'relatable moment (classroom chaos during test prep)',
    'STAAR timeline urgency (testing season countdown)',
    'student STAAR success quote or reaction',
    'bilingual STAAR challenge (ELL students and testing)',
    // NEW: Pain Point focused hooks
    'time-saving breakthrough (hours saved on prep)',
    'student engagement transformation (from groans to cheers)',
    'differentiation solution (finally meeting all learners)',
    'resource coherence (no more random TPT worksheets)',
    'vocabulary retention success (students remembering terms)',
    'teacher burnout relief (simple tools that just work)',
    'independent practice win (small groups finally work)',
    'curriculum gap solution (filling what the textbook misses)',
    'STAAR 2.0 format practice (drag & drop, multi-select ready)'
  ];
  const randomHook = hookStyles[Math.floor(Math.random() * hookStyles.length)];

  // Random title styles to prevent repetition - TEKS/STAAR emphasis + Pain Points
  const titleStyles = [
    'STAAR prep breakthrough + result',
    'TEKS mastery question format',
    'the TEKS standard that changed my classroom',
    'why Texas teachers are acing STAAR with X',
    'the secret to STAAR success in X',
    'how to cover [TEKS standard] before testing',
    'STAAR-ready in [timeframe] with [concept]',
    // NEW: Pain Point focused titles
    'how I got my prep time back teaching [concept]',
    'the engagement hack that transformed my science class',
    'finally: STAAR 2.0 practice that students love',
    'from Pinterest chaos to TEKS coherence',
    'why my students actually remember [concept] vocabulary now',
    'the click-and-go resources saving my sanity',
    'how [concept] runs itself while I pull small groups',
    'STAAR 2.0 drag & drop? My students are ready now'
  ];
  const randomTitle = titleStyles[Math.floor(Math.random() * titleStyles.length)];

  // Build the recent posts section to avoid repetition
  const recentPostsSection = recentTitles && recentTitles.length > 0
    ? `
RECENT POSTS (DO NOT REPEAT THESE - create something COMPLETELY DIFFERENT):
Previous titles used:
${recentTitles.map((t, i) => `${i + 1}. "${t}"`).join('\n')}

Previous hooks used:
${recentHooks?.map((h, i) => `${i + 1}. "${h}"`).join('\n') || 'None'}

YOU MUST CREATE A COMPLETELY DIFFERENT TITLE AND HOOK FROM ALL OF THE ABOVE!
`
    : '';

  // Build angle-specific instructions
  let angleInstructions = '';
  if (contentAngle === 'STAAR_PREP') {
    angleInstructions = `
🎯 STAAR_PREP ANGLE - AGGRESSIVE TESTING FOCUS
This is your most important messaging angle. Go ALL IN on STAAR/TEKS:

REQUIRED ELEMENTS:
1. LEAD with STAAR in the first sentence - "STAAR is coming..." or "With STAAR just X weeks away..."
2. Mention specific TEKS standards being covered (e.g., "TEKS §112.26(b)(6)")
3. Include countdown urgency - "Only X weeks until STAAR testing"
4. Reference released STAAR questions or common STAAR problem areas
5. Highlight STAAR readiness data/scores improvement
6. Address admin pressure around STAAR data
7. Use STAAR-focused hashtags: #STAAR #STAARprep #STAARready #STAARscience

STAAR_PREP MESSAGING TONE:
- Urgent but not panicky
- Solution-focused (we have the answer)
- Data-driven (mention score improvements)
- Empathetic to teacher stress
`;
  } else if (contentAngle === 'ENGAGEMENT') {
    angleInstructions = `
🎮 ENGAGEMENT ANGLE - STUDENT ENGAGEMENT FOCUS
Emphasize game-based learning that makes TEKS concepts stick:

REQUIRED ELEMENTS:
1. Highlight game-based, interactive learning
2. Mention student engagement and participation
3. Address boring drill-and-kill STAAR prep alternatives
4. Reference student reactions and excitement
5. Use engagement language: "students beg for more", "finally engaged"
`;
  } else if (contentAngle === 'TIME_SAVER') {
    angleInstructions = `
⏰ TIME_SAVER ANGLE - PREP TIME REDUCTION FOCUS
Emphasize how teachers save hours while staying TEKS-aligned:

REQUIRED ELEMENTS:
1. Quantify time savings ("Save 5+ hours of prep per week")
2. Mention ready-to-teach, TEKS-aligned modules
3. Address Sunday night/weeknight prep stress
4. Highlight that resources are already STAAR-ready
5. Use time-focused language: "no prep needed", "ready to go"
`;
  }

  return `You are a marketing expert for Accelerating Success (@AccSuccess), an educational platform offering bilingual (English/Spanish) Science resources for grades 3-8.
${recentPostsSection}
REQUIRED APPROACH FOR THIS POST:
- Hook style: ${randomHook}
- Title format: ${randomTitle}
- Make the title SPECIFIC to ${concept}

🔥 CRITICAL HOOK FORMULA: Pain Point + TEKS/STAAR = Winning Content
Every hook MUST combine a real teacher struggle (see 10 Pain Points below) WITH TEKS/STAAR alignment messaging.
Example: "I was drowning in random worksheets for [TEKS concept]. Now my STAAR prep runs itself."

Generate a compelling social media content idea and platform-specific posts.

TOPIC: ${topic} - ${concept}
GRADE LEVEL: ${gradeLevel}
CONTENT ANGLE: ${contentAngle}
TESTIMONIAL VIDEO: ${testimonialUrl} (${testimonialTitle})

═══════════════════════════════════════════════════════════════════════════════
📊 CONTENT ANGLE-SPECIFIC INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════
${angleInstructions}

═══════════════════════════════════════════════════════════════════════════════
🎯 TOP 10 TEACHER PAIN POINTS & HOW ACCELERATING SUCCESS SOLVES THEM
═══════════════════════════════════════════════════════════════════════════════

USE THESE PAIN POINTS IN YOUR CONTENT! Pick 2-3 that relate to the topic/concept and weave them naturally into your posts.

📌 PAIN POINT 1: NOT ENOUGH TIME TO PLAN LESSONS
THE STRUGGLE: Teachers spend hours searching, prepping, and modifying materials.
HOW WE SOLVE IT:
- Ready-to-use TEKS-aligned modules
- Interactive games, vocabulary energizers, and visuals that require ZERO prep
- Printable and digital options that save teachers hours each week
HOOK IDEAS: "I used to spend 3 hours every Sunday..." / "What if your lessons came ready to teach?"

📌 PAIN POINT 2: PRESSURE TO IMPROVE STAAR 2.0 SCORES
THE STRUGGLE: Teachers face intense accountability but lack engaging, aligned resources.
HOW WE SOLVE IT:
- 100% TEKS-aligned content grades 3–Biology
- STAAR 2.0 question formats (multi-select, drag & drop, evidence-based responses)
- High-engagement practice that leads to real gains in mastery
HOOK IDEAS: "My admin wants STAAR data every Friday..." / "STAAR 2.0 formats used to terrify my students..."

📌 PAIN POINT 3: STUDENTS STRUGGLE WITH ENGAGEMENT
THE STRUGGLE: Keeping students focused—especially in science—is a daily challenge.
HOW WE SOLVE IT:
- Arcade-style games students BEG to play
- Immediate feedback loops
- Built-in competition, badges, and game mechanics that motivate learners
- Engagement skyrockets = behavior challenges drop
HOOK IDEAS: "From groans to 'Can we play again?'" / "The day my students ASKED for science practice..."

📌 PAIN POINT 4: DIFFICULTY DIFFERENTIATING INSTRUCTION
THE STRUGGLE: Teachers must support students at multiple reading and skill levels.
HOW WE SOLVE IT:
- Bilingual English/Spanish toggles
- Adjustable difficulty levels
- Multiple ways for students to access content (games, visuals, vocabulary, modules)
- Teachers can finally meet students where they are without creating 6 versions of a lesson
HOOK IDEAS: "Half my class reads below grade level..." / "ELL students AND advanced learners in one room..."

📌 PAIN POINT 5: TOO MANY DISCONNECTED OR LOW-QUALITY MATERIALS
THE STRUGGLE: Teachers often rely on Pinterest, TPT, or old worksheets that don't align well to TEKS or STAAR 2.0.
HOW WE SOLVE IT:
- A fully coherent supplemental ecosystem
- Vocabulary → visuals → games → modules all aligned
- No more piecing together random resources
- Everything consistent, cleanly designed, and TEKS-specific
HOOK IDEAS: "I was drowning in random TPT downloads..." / "When nothing you find actually matches the TEKS..."

📌 PAIN POINT 6: STUDENTS FORGET VOCABULARY QUICKLY
THE STRUGGLE: Academic language is often the biggest barrier for students in science.
HOW WE SOLVE IT:
- Vocabulary Energizers, flashcards, eBooks, and arcade-style games
- Built-in repetition & retrieval practice
- Bilingual supports that improve access
- Students retain words long-term because they practice them in multiple contexts
HOOK IDEAS: "My students couldn't remember 'photosynthesis' to save their lives..." / "Academic vocabulary was killing my STAAR scores..."

📌 PAIN POINT 7: TEACHER BURNOUT & COGNITIVE OVERLOAD
THE STRUGGLE: Teachers feel overwhelmed by new TEKS, new testing formats, and constant initiative fatigue.
HOW WE SOLVE IT:
- Simple, intuitive tools designed for Texas teachers
- No learning curve—teachers click and go
- Huge value for teachers who need resources that work without adding stress
HOOK IDEAS: "I was one more initiative away from quitting..." / "When simple actually means simple..."

📌 PAIN POINT 8: HARD TO MANAGE INDEPENDENT PRACTICE
THE STRUGGLE: Teachers need students meaningfully engaged so they can run small groups.
HOW WE SOLVE IT:
- Self-running games that keep students engaged AND quiet
- Instant feedback students can understand independently
- Perfect for stations, RTI groups, tutoring rotations, and sub days
- Teachers finally get time back to work with the kids who need them most
HOOK IDEAS: "I can finally pull small groups without chaos..." / "The sub folder that actually works..."

📌 PAIN POINT 9: CURRICULUM DOESN'T MATCH THE NEEDS OF THEIR STUDENTS
THE STRUGGLE: Teachers often feel their core HQIM or district materials aren't enough on their own.
HOW WE SOLVE IT:
- A flexible supplemental resource that fits with ANY curriculum
- Easy add-ins that strengthen core lessons or fill conceptual gaps
- Perfect for reteach, enrichment, and acceleration
- Gives teachers the freedom to adjust instruction without creating more work
HOOK IDEAS: "The textbook doesn't cover it the way STAAR tests it..." / "When your curriculum needs backup..."

📌 PAIN POINT 10: STUDENTS NEED MORE PRACTICE IN STAAR 2.0 FORMAT
THE STRUGGLE: Even when content is understood, students struggle with the new item types.
HOW WE SOLVE IT:
- Games incorporate STAAR 2.0-style interactions:
  • Drag & drop
  • Multi-select
  • Hot spots
  • Matching
- Students get comfortable with the FORMAT, not just the content
- Teachers get better performance because students aren't surprised on test day
HOOK IDEAS: "My students knew the content but bombed the STAAR format..." / "Drag & drop used to confuse them. Not anymore."

═══════════════════════════════════════════════════════════════════════════════
KEY FEATURES (mapped to Teacher Pain Points):
═══════════════════════════════════════════════════════════════════════════════
- ✅ TEKS Chapter 112 aligned (2024-2025 implementation) → Solves Pain Points #2, #5, #9
- ✅ STAAR 2.0 ready (drag & drop, multi-select, hot spots) → Solves Pain Points #2, #10
- ✅ Bilingual English/Spanish toggle → Solves Pain Point #4
- ✅ Arcade-style games students BEG to play → Solves Pain Points #3, #6, #8
- ✅ Zero-prep, ready-to-teach modules → Solves Pain Points #1, #7
- ✅ Vocabulary Energizers with retrieval practice → Solves Pain Point #6
- ✅ Self-running for independent practice/stations → Solves Pain Point #8
- ✅ Adjustable difficulty levels → Solves Pain Point #4
- ✅ Coherent ecosystem (vocabulary → visuals → games → modules) → Solves Pain Point #5
- ✅ Simple, intuitive - click and go → Solves Pain Point #7
- ✅ Flexible supplemental (works with ANY curriculum) → Solves Pain Point #9
- Subscription link: https://accelerating-success.com/subscriptions/
- Free resources: https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/
- Offer: 7-day free trial, no strings attached

═══════════════════════════════════════════════════════════════════════════════
🔥 COMBINED HOOK EXAMPLES (Pain Point + TEKS/STAAR)
═══════════════════════════════════════════════════════════════════════════════

Every hook should address BOTH a teacher struggle AND testing alignment:

• Newton's Laws + TIME SAVING: "I used to spend 4 hours prepping my Force & Motion TEKS unit. Now I click and teach STAAR-ready content in minutes 🎯"
• Water Cycle + ENGAGEMENT: "My students used to groan at Earth's water cycle. Now they BEG to play the TEKS §112.26 review games before STAAR."
• Photosynthesis + VOCABULARY: "Academic vocabulary was killing my STAAR scores on photosynthesis. Then I found Vocabulary Energizers..."
• Cells + DIFFERENTIATION: "Half my class are ELL students taking STAAR in English. Cell organelles in BOTH languages? Game changer. 🌎"
• Ecosystems + STAAR 2.0 FORMAT: "47 TEKS standards. Ecosystems alone has 6. My students knew the content but bombed the drag & drop questions. Not anymore."

═══════════════════════════════════════════════════════════════════════════════
REQUIREMENTS:
1. Create a relatable teacher pain point or engaging question for the content idea
2. Generate 6 EXTENDED posts (LinkedIn, Reddit, Facebook, Twitter/X, Blogger, Tumblr)
3. Include CONCRETE EXAMPLES showing how teachers actually use the platform
4. Add testimonial video naturally in the posts
5. Use the COMBINED Pain Point + TEKS/STAAR formula in every hook
6. End with clear CTAs

CRITICAL LINK FORMATTING:
- LinkedIn: [Start your free trial](https://accelerating-success.com/subscriptions/)
- Twitter: "Try it free → https://accelerating-success.com/subscriptions/"

HASHTAG STRATEGY:
- Always include: #STAAR #TEKS #TexasTeachers
- Add: #STAARprep #TEKSaligned plus topic-specific hashtags
- LinkedIn: 3-5 max at END

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "ideaTitle": "A UNIQUE creative title that combines Pain Point + TEKS/STAAR",
  "linkedinPost": "full LinkedIn post with combined Pain Point + STAAR hook...",
  "redditPost": "full Reddit post...",
  "facebookPost": "full Facebook post...",
  "twitterPost": "full Twitter post (under 280 chars)...",
  "bloggerPost": "full Blogger article with HTML tags...",
  "tumblrPost": "full Tumblr post..."
}`;
}

// Test configuration
const testConfig = {
  topic: 'Physical Science',
  concept: 'Force, Motion & Energy - Newton\'s Laws',
  gradeLevel: '6th Grade',
  contentAngle: 'STAAR_PREP',
  testimonialUrl: 'https://youtube.com/shorts/abc123',
  testimonialTitle: 'Texas 6th Grade Teacher Success Story'
};

async function generateCampaign(config) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = buildContentGenerationPrompt(config);

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`📚 GENERATING: ${config.concept} (${config.gradeLevel})`);
  console.log(`🎯 ANGLE: ${config.contentAngle}`);
  console.log(`${'═'.repeat(70)}\n`);

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: 'You are a social media marketing expert. Return ONLY valid JSON with no markdown formatting or code blocks.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    let responseText = message.content[0].text;

    // Clean up response - remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response
    let content;
    try {
      content = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
      } else {
        console.error('Raw response:', responseText.substring(0, 500));
        throw new Error('Could not parse JSON from response');
      }
    }

    return content;

  } catch (error) {
    console.error('❌ Error generating content:', error.message);
    return null;
  }
}

function analyzeContent(content, config) {
  console.log('\n📊 CONTENT ANALYSIS:\n');
  console.log('─'.repeat(50));

  // Title analysis
  console.log(`\n📌 IDEA TITLE: "${content.ideaTitle}"`);

  const titleLower = content.ideaTitle.toLowerCase();
  const titleHasSTAAR = titleLower.includes('staar');
  const titleHasTEKS = titleLower.includes('teks');
  const titleHasPainPoint =
    titleLower.includes('time') ||
    titleLower.includes('save') ||
    titleLower.includes('engage') ||
    titleLower.includes('burnout') ||
    titleLower.includes('struggle') ||
    titleLower.includes('finally') ||
    titleLower.includes('chaos') ||
    titleLower.includes('vocabulary') ||
    titleLower.includes('hour') ||
    titleLower.includes('prep');

  console.log(`   STAAR in title: ${titleHasSTAAR ? '✅' : '❌'}`);
  console.log(`   TEKS in title: ${titleHasTEKS ? '✅' : '❌'}`);
  console.log(`   Pain Point language: ${titleHasPainPoint ? '✅' : '❌'}`);

  // LinkedIn analysis (primary platform)
  if (content.linkedinPost) {
    console.log('\n💼 LINKEDIN POST ANALYSIS:');
    const linkedin = content.linkedinPost.toLowerCase();

    const staarCount = (linkedin.match(/staar/g) || []).length;
    const teksCount = (linkedin.match(/teks/g) || []).length;

    // Pain point detection
    const painPointKeywords = {
      '#1 TIME/PREP': ['hour', 'minute', 'prep', 'sunday', 'weekend', 'time'],
      '#2 STAAR PRESSURE': ['admin', 'principal', 'accountability', 'score'],
      '#3 ENGAGEMENT': ['groan', 'beg', 'love', 'engage', 'excited', 'ask for more', 'arcade'],
      '#4 DIFFERENTIATION': ['ell', 'bilingual', 'spanish', 'level', 'differentiat'],
      '#5 RANDOM RESOURCES': ['pinterest', 'tpt', 'random', 'piecing', 'coherent'],
      '#6 VOCABULARY': ['vocabulary', 'terms', 'academic language', 'remember', 'energizer'],
      '#7 BURNOUT': ['burnout', 'overwhelm', 'stress', 'sanity', 'simple', 'initiative'],
      '#8 INDEPENDENT PRACTICE': ['small group', 'station', 'independent', 'self-running', 'rti'],
      '#9 CURRICULUM GAPS': ['textbook', 'curriculum', 'supplement', 'gap'],
      '#10 STAAR 2.0 FORMAT': ['drag', 'drop', 'multi-select', 'hot spot', 'format']
    };

    let detectedPainPoints = [];
    for (const [painPoint, keywords] of Object.entries(painPointKeywords)) {
      if (keywords.some(kw => linkedin.includes(kw))) {
        detectedPainPoints.push(painPoint);
      }
    }

    console.log(`   STAAR mentions: ${staarCount}`);
    console.log(`   TEKS mentions: ${teksCount}`);
    console.log(`   Pain Points detected: ${detectedPainPoints.length}`);
    if (detectedPainPoints.length > 0) {
      detectedPainPoints.forEach(pp => console.log(`      • ${pp}`));
    }
    console.log(`   Character count: ${content.linkedinPost.length}`);

    // Check for proper structure
    const hasHashtags = linkedin.includes('#staar') || linkedin.includes('#teks') || linkedin.includes('#texasteachers');
    const hasLink = linkedin.includes('accelerating-success.com');
    const hasQuestion = linkedin.includes('?');

    console.log(`   Has STAAR/TEKS hashtags: ${hasHashtags ? '✅' : '❌'}`);
    console.log(`   Has CTA link: ${hasLink ? '✅' : '❌'}`);
    console.log(`   Has engagement question: ${hasQuestion ? '✅' : '❌'}`);

    // Combined score
    const combinedScore = (staarCount > 0 ? 2 : 0) +
                          (teksCount > 0 ? 2 : 0) +
                          (detectedPainPoints.length * 2) +
                          (hasHashtags ? 1 : 0) +
                          (hasLink ? 1 : 0);

    console.log(`\n   🎯 PAIN POINT + TEKS/STAAR SCORE: ${combinedScore}/20+`);

    if (combinedScore >= 10) {
      console.log('   ✅ EXCELLENT - Strong combination of Pain Points + STAAR/TEKS!');
    } else if (combinedScore >= 6) {
      console.log('   ⚠️  GOOD - Could add more Pain Point language');
    } else {
      console.log('   ❌ NEEDS WORK - Missing Pain Point + STAAR/TEKS combination');
    }
  }

  return content;
}

async function runTestCampaign() {
  console.log('\n🚀 PAIN POINTS + TEKS/STAAR TEST CAMPAIGN');
  console.log('═'.repeat(70));
  console.log('Testing the new 10 Teacher Pain Points framework combined with STAAR/TEKS messaging\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment');
    console.log('Please set ANTHROPIC_API_KEY in your .env file');
    process.exit(1);
  }

  console.log('✅ API Key found');
  console.log('📝 Generating content with Pain Point + TEKS/STAAR formula...\n');

  const content = await generateCampaign(testConfig);

  if (content) {
    analyzeContent(content, testConfig);

    // Show all generated platforms
    console.log('\n\n' + '═'.repeat(70));
    console.log('📱 GENERATED CONTENT BY PLATFORM:');
    console.log('═'.repeat(70));

    // LinkedIn (full)
    console.log('\n💼 LINKEDIN POST (FULL):');
    console.log('─'.repeat(50));
    console.log(content.linkedinPost);

    // Twitter
    console.log('\n\n🐦 TWITTER POST:');
    console.log('─'.repeat(50));
    console.log(content.twitterPost);
    console.log(`\nCharacters: ${content.twitterPost?.length || 0}/280`);

    // Facebook (preview)
    if (content.facebookPost) {
      console.log('\n\n📘 FACEBOOK POST (preview):');
      console.log('─'.repeat(50));
      console.log(content.facebookPost.substring(0, 600) + '...');
    }

    // Reddit (preview)
    if (content.redditPost) {
      console.log('\n\n🔶 REDDIT POST (preview):');
      console.log('─'.repeat(50));
      console.log(content.redditPost.substring(0, 600) + '...');
    }

    // Blogger (preview)
    if (content.bloggerPost) {
      console.log('\n\n📝 BLOGGER POST (preview):');
      console.log('─'.repeat(50));
      console.log(content.bloggerPost.substring(0, 600) + '...');
    }

    // Tumblr (preview)
    if (content.tumblrPost) {
      console.log('\n\n💜 TUMBLR POST (preview):');
      console.log('─'.repeat(50));
      console.log(content.tumblrPost.substring(0, 600) + '...');
    }

    console.log('\n\n' + '═'.repeat(70));
    console.log('✅ TEST CAMPAIGN COMPLETE!');
    console.log('═'.repeat(70));
    console.log('\nThe prompts now combine:');
    console.log('  • 10 Teacher Pain Points (time, engagement, differentiation, etc.)');
    console.log('  • TEKS/STAAR alignment messaging');
    console.log('  • Platform-specific optimization');
    console.log('\n🔥 Every hook addresses BOTH teacher struggles AND testing alignment.');
    console.log('═'.repeat(70) + '\n');

  } else {
    console.log('\n❌ Failed to generate campaign content');
  }
}

runTestCampaign().catch(console.error);
