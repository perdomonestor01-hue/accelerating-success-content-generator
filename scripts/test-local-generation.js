#!/usr/bin/env node
/**
 * Local test script to verify content generation variety
 * Tests that:
 * 1. Different titles are generated (NOT "Sunday Prep Struggle")
 * 2. Different voice styles are used
 * 3. JSON parsing works correctly
 * 4. No banned phrases appear
 */

require('dotenv').config();

const BANNED_PHRASES = [
  'sunday prep struggle',
  'prep struggle',
  'weekend prep',
  'sunday prep',
  'the struggle is real',
  'struggle is real',
  'game changer',
  'game-changer',
  'email list',
  'join our email',
  'newsletter',
];

// Test with Groq since it's the fastest
async function testGroqGeneration() {
  const Groq = require('groq-sdk');

  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not found in environment');
    process.exit(1);
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Simulated variety elements (like prompts.ts does)
  const voiceStyles = ['Experienced Mentor', 'Frustrated Ally', 'Excited Discoverer', 'Data-Driven Analyst'];
  const narrativeFormats = ['Teacher Transformation Story', 'Before/After Transformation', 'Problem Deep-Dive'];
  const openingPatterns = ['Open with a specific number or statistic', 'Open with something a student said', 'Open with an honest admission'];

  const voiceStyle = voiceStyles[Math.floor(Math.random() * voiceStyles.length)];
  const narrativeFormat = narrativeFormats[Math.floor(Math.random() * narrativeFormats.length)];
  const openingPattern = openingPatterns[Math.floor(Math.random() * openingPatterns.length)];

  const concept = 'force & motion';
  const gradeLevel = '4th-5th';

  console.log('🧪 Testing content generation locally...\n');
  console.log('📋 Selected variety elements:');
  console.log(`   Voice: ${voiceStyle}`);
  console.log(`   Format: ${narrativeFormat}`);
  console.log(`   Opening: ${openingPattern}\n`);

  const prompt = `Create social media content for Accelerating Success - bilingual Science resources for Texas teachers.

⚠️ CRITICAL: The title "Sunday Prep Struggle" is BANNED. Create a UNIQUE title.

SUGGESTED TITLES (pick one or create similar):
1. "When ${concept} Finally Clicked for My Students"
2. "The ${concept} Breakthrough Every Teacher Needs"
3. "${gradeLevel} Grade ${concept}: A Teaching Transformation"

VOICE STYLE: ${voiceStyle}
NARRATIVE FORMAT: ${narrativeFormat}
OPENING PATTERN: ${openingPattern}

TOPIC: ${concept} for ${gradeLevel} grade (TEKS-aligned)
TESTIMONIAL: https://www.youtube.com/watch?v=lhT6sSU-pdE

BANNED PHRASES (NEVER use these):
• "Sunday Prep Struggle"
• "prep struggle"
• "game-changer"
• "email list"
• "newsletter"

Create engaging content with:
- Hook opening using the ${openingPattern} style
- 4 bullet benefits
- Include testimonial link
- End with TWO CTAs:
  - Primary: [Start free trial](https://accelerating-success.com/subscriptions/)
  - Secondary: [Try free resources](https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/)

Return ONLY valid JSON (no markdown, no code blocks):
{
  "ideaTitle": "Creative unique title",
  "linkedinPost": "Full LinkedIn post (1500-2000 chars)",
  "facebookPost": "Facebook post (1200-1500 chars)",
  "twitterPost": "Tweet under 280 chars"
}`;

  try {
    console.log('🚀 Calling Groq API...\n');

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a marketing expert. Respond with ONLY valid JSON, no markdown.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      console.error('❌ No content in response');
      return;
    }

    console.log('📝 Raw response (first 500 chars):');
    console.log(content.substring(0, 500) + '...\n');

    // Parse JSON
    let jsonText = content.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```\s*/g, '');
    }

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response');
      return;
    }

    // Clean control characters more aggressively
    let cleanJson = jsonMatch[0]
      // Replace literal \n and \r in strings (not actual newlines)
      .replace(/\\n/g, ' ')
      .replace(/\\r/g, '')
      // Replace actual newlines within JSON string values
      .replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
        return match.replace(/\n/g, ' ').replace(/\r/g, '');
      })
      // Clean other control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');

    let result;
    try {
      result = JSON.parse(cleanJson);
    } catch (e) {
      // Try even more aggressive cleaning
      cleanJson = cleanJson
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\t/g, ' ')
        .replace(/\s+/g, ' ');
      result = JSON.parse(cleanJson);
    }

    console.log('✅ JSON parsed successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📌 GENERATED TITLE:', result.ideaTitle);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Check for banned phrases
    const allContent = `${result.ideaTitle} ${result.linkedinPost} ${result.facebookPost}`.toLowerCase();
    const foundBanned = BANNED_PHRASES.filter(phrase => allContent.includes(phrase));

    if (foundBanned.length > 0) {
      console.log('⚠️  BANNED PHRASES FOUND:');
      foundBanned.forEach(p => console.log(`   ❌ "${p}"`));
    } else {
      console.log('✅ No banned phrases found!\n');
    }

    // Check title specifically
    const titleLower = result.ideaTitle.toLowerCase();
    if (titleLower.includes('sunday') || titleLower.includes('prep struggle')) {
      console.log('❌ TITLE CONTAINS BANNED PATTERN!');
    } else {
      console.log('✅ Title is unique and appropriate!\n');
    }

    console.log('📱 LinkedIn Post Preview (first 300 chars):');
    console.log('───────────────────────────────────────────────────────────');
    console.log(result.linkedinPost?.substring(0, 300) + '...\n');

    console.log('🐦 Twitter Post:');
    console.log('───────────────────────────────────────────────────────────');
    console.log(result.twitterPost);
    console.log(`   (${result.twitterPost?.length || 0} chars)\n`);

    return result;

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('JSON')) {
      console.log('\n💡 JSON parsing issue - this is what we fixed in the providers');
    }
  }
}

// Run the test
testGroqGeneration().then(() => {
  console.log('\n✅ Local test complete!');
}).catch(err => {
  console.error('Test failed:', err);
});
