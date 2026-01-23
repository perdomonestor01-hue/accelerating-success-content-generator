#!/usr/bin/env node
/**
 * Test script for TEKS/STAAR enhanced prompts
 * Generates sample content to verify the new messaging
 * Now includes STAAR_PREP angle-specific instructions and LinkedIn optimization
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;

// Import the prompt builder (we'll inline it for this test)
function buildTestPrompt() {
  const topic = 'Physical Science';
  const concept = 'Force, Motion & Energy';
  const gradeLevel = '6th Grade';
  const contentAngle = 'STAAR_PREP';
  const testimonialUrl = 'https://youtube.com/shorts/example123';
  const testimonialTitle = 'Texas Teacher Success Story';

  // STAAR/TEKS focused hook styles
  const hookStyles = [
    'STAAR anxiety (testing pressure, score goals, admin expectations)',
    'TEKS coverage panic (so many standards, not enough time)',
    'success story (student breakthrough on STAAR-tested concept)',
    'STAAR timeline urgency (testing season countdown)',
    'bilingual STAAR challenge (ELL students and testing)'
  ];
  const randomHook = hookStyles[Math.floor(Math.random() * hookStyles.length)];

  const titleStyles = [
    'STAAR prep breakthrough + result',
    'TEKS mastery question format',
    'the secret to STAAR success in X',
    'STAAR-ready in [timeframe] with [concept]'
  ];
  const randomTitle = titleStyles[Math.floor(Math.random() * titleStyles.length)];

  return `You are a marketing expert for Accelerating Success (@AccSuccess), an educational platform offering bilingual (English/Spanish) Science resources for grades 3-8.

REQUIRED APPROACH FOR THIS POST:
- Hook style: ${randomHook}
- Title format: ${randomTitle}
- Make the title SPECIFIC to ${concept}
- LEAD with STAAR and TEKS messaging - this is critical!

Generate a compelling social media content idea and platform-specific posts.

TOPIC: ${topic} - ${concept}
GRADE LEVEL: ${gradeLevel}
CONTENT ANGLE: ${contentAngle}
TESTIMONIAL VIDEO: ${testimonialUrl} (${testimonialTitle})

═══════════════════════════════════════════════════════════════════════════════
📊 CONTENT ANGLE-SPECIFIC INSTRUCTIONS - STAAR_PREP
═══════════════════════════════════════════════════════════════════════════════

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
- Total length: 1,200-1,500 characters (optimal)

LINKEDIN ENGAGEMENT TRIGGERS:
- Ask a question at the end: "Any other Texas teachers feeling the STAAR pressure?"
- Invite comments: "Drop a 🎯 if you're prepping for STAAR right now"

═══════════════════════════════════════════════════════════════════════════════
🎯 STAAR SCIENCE TESTING CONTEXT
═══════════════════════════════════════════════════════════════════════════════

STAAR TESTING GRADES: Grade 5, Grade 8, Biology EOC
TIMELINE: December-February (prep), March-April (crunch), April-May (testing)

KEY FEATURES:
- ✅ TEKS Chapter 112 aligned (2024-2025 implementation)
- ✅ STAAR-ready practice questions and assessments
- Bilingual resources (English AND Spanish)
- Game-based learning
- Subscription: https://accelerating-success.com/subscriptions/

Generate ONLY the LinkedIn post for this test. Make it powerful, STAAR-focused, and follow the LinkedIn optimization guidelines.

Return ONLY valid JSON:
{
  "ideaTitle": "STAAR/TEKS focused title here",
  "linkedinPost": "Full LinkedIn post following the structure above..."
}`;
}

async function testSTAARPrompts() {
  console.log('🧪 Testing TEKS/STAAR Enhanced Prompts\n');
  console.log('═'.repeat(60));

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment');
    process.exit(1);
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = buildTestPrompt();

  console.log('\n📝 Generating sample content with STAAR/TEKS focus...\n');

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;

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
        throw new Error('Could not parse JSON from response');
      }
    }

    console.log('✅ GENERATED CONTENT:\n');
    console.log('═'.repeat(60));
    console.log('\n📌 IDEA TITLE:');
    console.log(content.ideaTitle);
    console.log('\n' + '─'.repeat(60));
    console.log('\n💼 LINKEDIN POST:\n');
    console.log(content.linkedinPost);
    console.log('\n' + '═'.repeat(60));

    // Analyze STAAR/TEKS mentions
    const linkedinText = content.linkedinPost.toLowerCase();
    const titleText = content.ideaTitle.toLowerCase();

    console.log('\n📊 STAAR/TEKS MESSAGING ANALYSIS:\n');

    const staarMentions = (linkedinText.match(/staar/g) || []).length;
    const teksMentions = (linkedinText.match(/teks/g) || []).length;
    const titleHasSTAAR = titleText.includes('staar');
    const titleHasTEKS = titleText.includes('teks');

    console.log(`   STAAR mentions in post: ${staarMentions}`);
    console.log(`   TEKS mentions in post: ${teksMentions}`);
    console.log(`   Title includes STAAR: ${titleHasSTAAR ? '✅ Yes' : '❌ No'}`);
    console.log(`   Title includes TEKS: ${titleHasTEKS ? '✅ Yes' : '❌ No'}`);

    const hasHashtags = linkedinText.includes('#staar') || linkedinText.includes('#teks');
    console.log(`   STAAR/TEKS hashtags: ${hasHashtags ? '✅ Yes' : '❌ No'}`);

    const score = staarMentions + teksMentions + (titleHasSTAAR ? 2 : 0) + (titleHasTEKS ? 2 : 0) + (hasHashtags ? 1 : 0);
    console.log(`\n   📈 TEKS/STAAR Saturation Score: ${score}/10+`);

    if (score >= 5) {
      console.log('   ✅ Good STAAR/TEKS messaging density!');
    } else {
      console.log('   ⚠️  Consider increasing STAAR/TEKS mentions');
    }

    console.log('\n✅ Test complete!\n');

  } catch (error) {
    console.error('❌ Error generating content:', error.message);
    process.exit(1);
  }
}

testSTAARPrompts();
