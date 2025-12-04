#!/usr/bin/env node
/**
 * Deploy Test Campaign - TEKS/STAAR Enhanced Content Generation
 * Generates multiple content pieces across different topics and angles
 * to verify the new STAAR/TEKS messaging is working correctly
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;

// Campaign configuration
const CAMPAIGN_CONFIG = {
  name: 'TEKS/STAAR Testing Campaign',
  date: new Date().toISOString().split('T')[0],
  testPieces: [
    {
      topic: 'Physical Science',
      concept: 'Force, Motion & Energy',
      gradeLevel: '6th Grade',
      contentAngle: 'STAAR_PREP'
    },
    {
      topic: 'Earth Science',
      concept: 'Weather & Water Cycle',
      gradeLevel: '5th Grade',
      contentAngle: 'BILINGUAL'
    },
    {
      topic: 'Life Science',
      concept: 'Ecosystems & Food Webs',
      gradeLevel: '8th Grade',
      contentAngle: 'ENGAGEMENT'
    },
    {
      topic: 'Physical Science',
      concept: 'Matter & States of Matter',
      gradeLevel: '5th Grade',
      contentAngle: 'TIME_SAVER'
    }
  ]
};

// Testimonials for rotation
const testimonials = [
  { url: 'https://youtube.com/shorts/4TJ7JB87gYc', title: 'Teacher Success: "You can do it, but you need the right tools!"' },
  { url: 'https://youtube.com/shorts/vfz3i6xYZOk', title: 'Low Prep Win: "Before, I was so overwhelmed..."' },
  { url: 'https://youtube.com/shorts/qewX4zMVhWo', title: 'Student Engagement: "My students absolutely loved it!"' },
  { url: 'https://youtube.com/shorts/rZUZJ42h3JI', title: 'Teacher Love: "I can\'t imagine teaching without it!"' }
];

// STAAR/TEKS focused hook styles
const hookStyles = [
  'STAAR anxiety (testing pressure, score goals, admin expectations)',
  'TEKS coverage panic (so many standards, not enough time)',
  'success story (student breakthrough on STAAR-tested concept)',
  'STAAR timeline urgency (testing season countdown)',
  'bilingual STAAR challenge (ELL students and testing)'
];

// Title styles
const titleStyles = [
  'STAAR prep breakthrough + result',
  'TEKS mastery question format',
  'the secret to STAAR success in X',
  'STAAR-ready in [timeframe] with [concept]'
];

function buildPrompt(config, testimonial, hookStyle, titleStyle) {
  const { topic, concept, gradeLevel, contentAngle } = config;

  const angleInstructions = {
    'STAAR_PREP': `
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
`,
    'BILINGUAL': `
🌎 BILINGUAL ANGLE - ELL/DUAL LANGUAGE FOCUS
Emphasize bilingual STAAR prep for ELL students:

REQUIRED ELEMENTS:
1. Address ELL students taking STAAR in English
2. Highlight that EVERY resource is in English AND Spanish
3. Mention dual language classrooms and teachers
4. Reference the challenge of TEKS concepts in two languages
5. Use bilingual hashtags: #BilingualEducation #ELLteachers #DualLanguage
6. Still mention STAAR and TEKS prominently
`,
    'TIME_SAVER': `
⏰ TIME_SAVER ANGLE - PREP TIME REDUCTION FOCUS
Emphasize how teachers save hours while staying TEKS-aligned:

REQUIRED ELEMENTS:
1. Quantify time savings ("Save 5+ hours of prep per week")
2. Mention ready-to-teach, TEKS-aligned modules
3. Address Sunday night/weeknight prep stress
4. Highlight that resources are already STAAR-ready
5. Use time-focused language: "no prep needed", "ready to go"
6. Still mention STAAR and TEKS prominently
`,
    'ENGAGEMENT': `
🎮 ENGAGEMENT ANGLE - STUDENT ENGAGEMENT FOCUS
Emphasize game-based learning that makes TEKS concepts stick:

REQUIRED ELEMENTS:
1. Highlight game-based, interactive learning
2. Mention student engagement and participation
3. Address boring drill-and-kill STAAR prep alternatives
4. Reference student reactions and excitement
5. Use engagement language: "students beg for more", "finally engaged"
6. Still mention STAAR and TEKS prominently
`
  };

  return `You are a marketing expert for Accelerating Success (@AccSuccess), an educational platform offering bilingual (English/Spanish) Science resources for grades 3-8.

REQUIRED APPROACH FOR THIS POST:
- Hook style: ${hookStyle}
- Title format: ${titleStyle}
- Make the title SPECIFIC to ${concept}
- LEAD with STAAR and TEKS messaging - this is critical!

Generate a compelling social media content idea and platform-specific posts.

TOPIC: ${topic} - ${concept}
GRADE LEVEL: ${gradeLevel}
CONTENT ANGLE: ${contentAngle}
TESTIMONIAL VIDEO: ${testimonial.url} (${testimonial.title})

═══════════════════════════════════════════════════════════════════════════════
📊 CONTENT ANGLE-SPECIFIC INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════
${angleInstructions[contentAngle] || angleInstructions['STAAR_PREP']}

═══════════════════════════════════════════════════════════════════════════════
💼 LINKEDIN OPTIMIZATION - HIGH PERFORMANCE GUIDELINES
═══════════════════════════════════════════════════════════════════════════════

LINKEDIN STRUCTURE (optimized for engagement):
1. HOOK (First 2 lines - visible before "see more")
   - Lead with STAAR/TEKS pain point or success metric
   - Use numbers when possible: "47 TEKS standards", "85% passing rate"
   - Create curiosity gap - make them want to click "see more"

2. STORY/CONTEXT (2-3 paragraphs)
   - Share a specific teacher struggle with TEKS/STAAR
   - Include specific grade level, subject, and TEKS standard
   - Build empathy: admin pressure, time constraints, ELL challenges

3. SOLUTION (1-2 paragraphs)
   - Introduce Accelerating Success as the answer
   - Highlight 2-3 specific benefits (TEKS-aligned, bilingual, game-based)
   - Quantify results if possible (score improvements, time saved)

4. SOCIAL PROOF - Reference the testimonial video naturally

5. CTA (Single, clear call-to-action)
   - ONE link only (subscription trial)
   - STAAR-focused language: "Get STAAR-ready" or "Start your TEKS-aligned trial"

6. HASHTAGS (3-5 max at END)
   - Always include: #STAAR #TEKS #TexasTeachers
   - Add topic-specific hashtags

LINKEDIN FORMATTING RULES:
- Use line breaks liberally (creates white space)
- Use emojis sparingly (1-2 max)
- Keep paragraphs to 2-3 sentences max
- Total length: 1,200-1,500 characters optimal

═══════════════════════════════════════════════════════════════════════════════
🎯 STAAR SCIENCE TESTING CONTEXT
═══════════════════════════════════════════════════════════════════════════════

STAAR TESTING GRADES: Grade 5 Science, Grade 8 Science, Biology EOC
TIMELINE: December-February (prep begins), March-April (crunch time), April-May (testing window)

TEACHER PAIN POINTS:
- "47 TEKS standards to cover before STAAR!"
- "My admin tracks STAAR readiness data weekly"
- "Half my students are ELL and need bilingual support"
- "New 2024 TEKS are harder than before"

KEY FEATURES:
- ✅ TEKS Chapter 112 aligned (2024-2025)
- ✅ STAAR-ready practice questions
- ✅ Bilingual (English AND Spanish)
- ✅ Game-based learning
- Subscription: https://accelerating-success.com/subscriptions/

Generate the LinkedIn post AND Twitter post for this campaign test.

Return ONLY valid JSON:
{
  "ideaTitle": "STAAR/TEKS focused title",
  "linkedinPost": "Full LinkedIn post following structure above",
  "twitterPost": "Concise tweet under 280 chars with STAAR/TEKS focus"
}`;
}

async function generateContent(client, config, index) {
  const testimonial = testimonials[index % testimonials.length];
  const hookStyle = hookStyles[Math.floor(Math.random() * hookStyles.length)];
  const titleStyle = titleStyles[Math.floor(Math.random() * titleStyles.length)];

  const prompt = buildPrompt(config, testimonial, hookStyle, titleStyle);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].text;

  // Parse JSON response
  let content;
  try {
    content = JSON.parse(responseText);
  } catch (e) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not parse JSON from response');
    }
  }

  return {
    ...config,
    testimonial,
    hookStyle,
    ...content
  };
}

function analyzeContent(content) {
  const linkedinText = content.linkedinPost.toLowerCase();
  const twitterText = content.twitterPost.toLowerCase();
  const titleText = content.ideaTitle.toLowerCase();

  return {
    staarInLinkedin: (linkedinText.match(/staar/g) || []).length,
    teksInLinkedin: (linkedinText.match(/teks/g) || []).length,
    staarInTwitter: (twitterText.match(/staar/g) || []).length,
    teksInTwitter: (twitterText.match(/teks/g) || []).length,
    titleHasSTAAR: titleText.includes('staar'),
    titleHasTEKS: titleText.includes('teks'),
    hasHashtags: linkedinText.includes('#staar') || linkedinText.includes('#teks'),
    linkedinLength: content.linkedinPost.length,
    twitterLength: content.twitterPost.length,
    twitterUnder280: content.twitterPost.length <= 280
  };
}

async function runCampaign() {
  console.log('\n' + '═'.repeat(70));
  console.log('🚀 DEPLOYING TEKS/STAAR TEST CAMPAIGN');
  console.log('═'.repeat(70));
  console.log(`\n📅 Date: ${CAMPAIGN_CONFIG.date}`);
  console.log(`📝 Campaign: ${CAMPAIGN_CONFIG.name}`);
  console.log(`🎯 Test Pieces: ${CAMPAIGN_CONFIG.testPieces.length}`);
  console.log('\n' + '─'.repeat(70));

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not found');
    process.exit(1);
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const results = [];

  for (let i = 0; i < CAMPAIGN_CONFIG.testPieces.length; i++) {
    const config = CAMPAIGN_CONFIG.testPieces[i];

    console.log(`\n📝 Generating ${i + 1}/${CAMPAIGN_CONFIG.testPieces.length}: ${config.topic} - ${config.concept}`);
    console.log(`   Angle: ${config.contentAngle} | Grade: ${config.gradeLevel}`);

    try {
      const content = await generateContent(client, config, i);
      const analysis = analyzeContent(content);

      results.push({ content, analysis });

      console.log(`   ✅ Generated: "${content.ideaTitle}"`);
      console.log(`   📊 STAAR mentions: ${analysis.staarInLinkedin} | TEKS mentions: ${analysis.teksInLinkedin}`);

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({ error: error.message, config });
    }
  }

  // Print detailed results
  console.log('\n\n' + '═'.repeat(70));
  console.log('📊 CAMPAIGN RESULTS');
  console.log('═'.repeat(70));

  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    if (result.error) {
      console.log(`\n❌ PIECE ${i + 1}: ERROR - ${result.error}`);
      continue;
    }

    const { content, analysis } = result;

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📌 PIECE ${i + 1}: ${content.contentAngle} | ${content.topic}`);
    console.log(`${'─'.repeat(70)}`);

    console.log(`\n🏷️  TITLE: ${content.ideaTitle}`);
    console.log(`   Title has STAAR: ${analysis.titleHasSTAAR ? '✅' : '❌'} | TEKS: ${analysis.titleHasTEKS ? '✅' : '❌'}`);

    console.log(`\n💼 LINKEDIN POST (${analysis.linkedinLength} chars):`);
    console.log('┌' + '─'.repeat(68) + '┐');
    const linkedinLines = content.linkedinPost.split('\n');
    linkedinLines.forEach(line => {
      const wrappedLines = line.match(/.{1,66}/g) || [''];
      wrappedLines.forEach(wl => console.log(`│ ${wl.padEnd(66)} │`));
    });
    console.log('└' + '─'.repeat(68) + '┘');

    console.log(`\n🐦 TWITTER POST (${analysis.twitterLength} chars) ${analysis.twitterUnder280 ? '✅' : '❌ OVER LIMIT'}:`);
    console.log(`   "${content.twitterPost}"`);

    console.log(`\n📊 ANALYSIS:`);
    console.log(`   STAAR in LinkedIn: ${analysis.staarInLinkedin} | TEKS: ${analysis.teksInLinkedin}`);
    console.log(`   STAAR in Twitter: ${analysis.staarInTwitter} | TEKS: ${analysis.teksInTwitter}`);
    console.log(`   Has STAAR/TEKS hashtags: ${analysis.hasHashtags ? '✅' : '❌'}`);

    const score = analysis.staarInLinkedin + analysis.teksInLinkedin +
                  (analysis.titleHasSTAAR ? 3 : 0) + (analysis.titleHasTEKS ? 3 : 0) +
                  (analysis.hasHashtags ? 2 : 0);
    console.log(`   📈 TEKS/STAAR Score: ${score}/15+`);
  }

  // Summary
  console.log('\n\n' + '═'.repeat(70));
  console.log('📈 CAMPAIGN SUMMARY');
  console.log('═'.repeat(70));

  const successful = results.filter(r => !r.error);
  const avgSTAAR = successful.reduce((sum, r) => sum + r.analysis.staarInLinkedin, 0) / successful.length;
  const avgTEKS = successful.reduce((sum, r) => sum + r.analysis.teksInLinkedin, 0) / successful.length;
  const allTwitterOK = successful.every(r => r.analysis.twitterUnder280);
  const allHaveHashtags = successful.every(r => r.analysis.hasHashtags);

  console.log(`\n   ✅ Successful generations: ${successful.length}/${results.length}`);
  console.log(`   📊 Average STAAR mentions per post: ${avgSTAAR.toFixed(1)}`);
  console.log(`   📊 Average TEKS mentions per post: ${avgTEKS.toFixed(1)}`);
  console.log(`   🐦 All tweets under 280 chars: ${allTwitterOK ? '✅' : '❌'}`);
  console.log(`   #️⃣  All posts have STAAR/TEKS hashtags: ${allHaveHashtags ? '✅' : '❌'}`);

  if (avgSTAAR >= 5 && avgTEKS >= 3) {
    console.log(`\n   🎉 CAMPAIGN QUALITY: EXCELLENT - Strong STAAR/TEKS messaging!`);
  } else if (avgSTAAR >= 3 && avgTEKS >= 2) {
    console.log(`\n   ✅ CAMPAIGN QUALITY: GOOD - Solid STAAR/TEKS presence`);
  } else {
    console.log(`\n   ⚠️  CAMPAIGN QUALITY: NEEDS IMPROVEMENT - Increase STAAR/TEKS mentions`);
  }

  console.log('\n' + '═'.repeat(70));
  console.log('🏁 CAMPAIGN DEPLOYMENT COMPLETE');
  console.log('═'.repeat(70) + '\n');

  return results;
}

// Run the campaign
runCampaign().catch(console.error);
