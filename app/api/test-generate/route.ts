import { NextRequest, NextResponse } from 'next/server';
import { aiProvider } from '@/lib/ai/provider';
import { getRotatedTestimonial } from '@/lib/videos';
import { selectVarietyElements } from '@/lib/ai/prompts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// TEACHER PAIN POINTS - The basis for content diversity
// Each post focuses on a DIFFERENT teacher struggle for variety
// ═══════════════════════════════════════════════════════════════════════════════

interface TeacherPainPoint {
  id: string;
  title: string;
  struggle: string;
  solution: string;
  hookIdeas: string[];
}

const teacherPainPoints: TeacherPainPoint[] = [
  {
    id: 'TIME',
    title: 'Not Enough Time to Plan',
    struggle: 'Teachers spend hours searching, prepping, and modifying materials.',
    solution: 'Ready-to-use TEKS-aligned modules with interactive games and visuals that require ZERO prep.',
    hookIdeas: [
      'I used to spend 3 hours every Sunday searching for science materials...',
      'What if your TEKS lessons came ready to teach?',
      'My weekends are finally mine again...',
    ],
  },
  {
    id: 'STAAR_SCORES',
    title: 'Pressure to Improve STAAR Scores',
    struggle: 'Teachers face intense accountability pressure but lack engaging, aligned resources.',
    solution: '100% TEKS-aligned content with STAAR 2.0 question formats (multi-select, drag & drop, evidence-based).',
    hookIdeas: [
      'My admin wants STAAR data every Friday...',
      'STAAR 2.0 formats used to terrify my students. Not anymore.',
      '47 TEKS standards. 12 weeks. One stressed teacher. Sound familiar?',
    ],
  },
  {
    id: 'ENGAGEMENT',
    title: 'Students Struggle with Engagement',
    struggle: 'Keeping students focused—especially in science—is a daily challenge.',
    solution: 'Arcade-style games students BEG to play with immediate feedback and built-in competition.',
    hookIdeas: [
      'From groans to "Can we play again?"...',
      'The day my students ASKED for more science practice...',
      'My classroom went from chaos to engaged in one week...',
    ],
  },
  {
    id: 'DIFFERENTIATION',
    title: 'Difficulty Differentiating Instruction',
    struggle: 'Teachers must support students at multiple reading and skill levels in the same classroom.',
    solution: 'Bilingual English/Spanish toggle, adjustable difficulty levels, and multiple ways to access content.',
    hookIdeas: [
      'Half my class reads below grade level. Here\'s how I reach them all...',
      'ELL students AND advanced learners - same activity, different supports...',
      'Finally, resources that meet EVERY learner where they are...',
    ],
  },
  {
    id: 'RANDOM_RESOURCES',
    title: 'Too Many Disconnected Materials',
    struggle: 'Teachers rely on Pinterest, TPT, or old worksheets that don\'t align to TEKS or STAAR 2.0.',
    solution: 'A fully coherent ecosystem where vocabulary → visuals → games → modules all align together.',
    hookIdeas: [
      'I was drowning in random TPT downloads that didn\'t match my TEKS...',
      'From Pinterest chaos to actual TEKS coherence...',
      'When nothing you find actually matches what STAAR tests...',
    ],
  },
  {
    id: 'VOCABULARY',
    title: 'Students Forget Vocabulary Quickly',
    struggle: 'Academic language is often the biggest barrier for students in science.',
    solution: 'Vocabulary Energizers, flashcards, eBooks, and arcade games with built-in repetition & retrieval practice.',
    hookIdeas: [
      'My students couldn\'t remember "photosynthesis" to save their lives...',
      'Academic vocabulary was killing my STAAR scores. Not anymore...',
      'The vocabulary retention trick that changed everything...',
    ],
  },
  {
    id: 'BURNOUT',
    title: 'Teacher Burnout & Cognitive Overload',
    struggle: 'Teachers feel overwhelmed by new TEKS, new testing formats, and constant initiative fatigue.',
    solution: 'Simple, intuitive tools with no learning curve—teachers click and go.',
    hookIdeas: [
      'I was one more initiative away from quitting teaching...',
      'When "simple" actually means simple...',
      'Finally, resources that don\'t require a PhD to set up...',
    ],
  },
  {
    id: 'INDEPENDENT_PRACTICE',
    title: 'Hard to Manage Independent Practice',
    struggle: 'Teachers need students meaningfully engaged so they can run small groups.',
    solution: 'Self-running games with instant feedback—perfect for stations, RTI groups, and sub days.',
    hookIdeas: [
      'I can finally pull small groups without classroom chaos...',
      'The sub folder that actually works...',
      'Station rotations that run themselves...',
    ],
  },
  {
    id: 'CURRICULUM_GAPS',
    title: 'Curriculum Doesn\'t Match Student Needs',
    struggle: 'Core materials often aren\'t enough on their own—teachers need to fill gaps.',
    solution: 'Flexible supplemental resource that works with ANY curriculum for reteach, enrichment, or acceleration.',
    hookIdeas: [
      'The textbook doesn\'t cover it the way STAAR tests it...',
      'When your curriculum needs backup...',
      'Filling the gaps my textbook leaves behind...',
    ],
  },
  {
    id: 'STAAR_FORMAT',
    title: 'Students Need STAAR 2.0 Format Practice',
    struggle: 'Even when students understand content, they struggle with new item types.',
    solution: 'Games with drag & drop, multi-select, hot spots, and matching that mirror STAAR 2.0 formats.',
    hookIdeas: [
      'My students knew the content but bombed the STAAR format...',
      'Drag & drop questions used to confuse them. Not anymore...',
      'STAAR 2.0 format practice that actually feels like a game...',
    ],
  },
];

// Session-based tracking to avoid repeating patterns within the same session
// This is reset on server restart but provides variety within a user session
let sessionPatterns = {
  voiceStyles: [] as string[],
  narrativeFormats: [] as string[],
  openingPatterns: [] as string[],
  painPointIds: [] as string[],
};

// Keep only last 3 patterns to allow cycling back
function updateSessionPatterns(variety: ReturnType<typeof selectVarietyElements>, painPointId: string) {
  sessionPatterns.voiceStyles.push(variety.voiceStyle.id);
  sessionPatterns.narrativeFormats.push(variety.narrativeFormat.id);
  sessionPatterns.openingPatterns.push(variety.openingPattern.id);
  sessionPatterns.painPointIds.push(painPointId);

  // Keep only last 3 of each to allow cycling
  if (sessionPatterns.voiceStyles.length > 3) sessionPatterns.voiceStyles.shift();
  if (sessionPatterns.narrativeFormats.length > 3) sessionPatterns.narrativeFormats.shift();
  if (sessionPatterns.openingPatterns.length > 3) sessionPatterns.openingPatterns.shift();
  if (sessionPatterns.painPointIds.length > 3) sessionPatterns.painPointIds.shift();
}

// Select pain point, excluding recently used ones
function selectPainPoint(excludeIds: string[]): TeacherPainPoint {
  const available = teacherPainPoints.filter(pp => !excludeIds.includes(pp.id));
  const pool = available.length > 0 ? available : teacherPainPoints;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Test endpoint with FULL variety system (no database required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, concept, gradeLevel, contentAngle, testimonialUrl, testimonialTitle } = body;

    // Validate required fields
    if (!topic || !concept || !gradeLevel || !contentAngle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use provided testimonial or get rotated video from our collection
    let finalTestimonialUrl: string;
    let finalTestimonialTitle: string;

    if (testimonialUrl && testimonialTitle) {
      finalTestimonialUrl = testimonialUrl;
      finalTestimonialTitle = testimonialTitle;
    } else {
      const rotatedVideo = getRotatedTestimonial();
      finalTestimonialUrl = rotatedVideo.url;
      finalTestimonialTitle = rotatedVideo.title;
      console.log(`🎬 Using rotated video: ${finalTestimonialTitle}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VARIETY ENGINE - Select different voice, narrative, opening, and pain point
    // This ensures each generation produces noticeably different content
    // ═══════════════════════════════════════════════════════════════════════════

    // Select variety elements, excluding recent patterns from this session
    const varietyElements = selectVarietyElements({
      voiceStyles: sessionPatterns.voiceStyles,
      narrativeFormats: sessionPatterns.narrativeFormats,
      openingPatterns: sessionPatterns.openingPatterns,
    });

    // Select a pain point focus, excluding recently used ones
    const painPoint = selectPainPoint(sessionPatterns.painPointIds);

    // Update session patterns for next generation
    updateSessionPatterns(varietyElements, painPoint.id);

    console.log('🤖 Generating content with AI (VARIETY MODE)...');
    console.log(`📚 Topic: ${topic}, Concept: ${concept}, Grade: ${gradeLevel}, Angle: ${contentAngle}`);
    console.log(`🎭 Voice: ${varietyElements.voiceStyle.id}, Narrative: ${varietyElements.narrativeFormat.id}, Opening: ${varietyElements.openingPattern.id}`);
    console.log(`📍 Pain Point: ${painPoint.title}`);

    // Generate content using AI with FULL variety elements
    const generatedContent = await aiProvider.generateContent({
      topic,
      concept,
      gradeLevel,
      contentAngle,
      testimonialUrl: finalTestimonialUrl,
      testimonialTitle: finalTestimonialTitle,
      // Pass variety elements for diverse content structure
      varietyElements,
      // Pass pain point for meaningful, teacher-focused content
      painPoint: {
        id: painPoint.id,
        title: painPoint.title,
        struggle: painPoint.struggle,
        solution: painPoint.solution,
        hookIdeas: painPoint.hookIdeas,
      },
      // Pass recent patterns for reference (in case prompt wants to double-check)
      recentPatterns: sessionPatterns,
    });

    console.log(`✅ Content generated: ${generatedContent.ideaTitle}`);
    console.log(`   Used: ${varietyElements.voiceStyle.name} voice, ${varietyElements.narrativeFormat.name} format, ${varietyElements.openingPattern.id} opening`);

    return NextResponse.json({
      success: true,
      content: generatedContent,
      // Include variety info for debugging/transparency
      variety: {
        voiceStyle: varietyElements.voiceStyle.name,
        narrativeFormat: varietyElements.narrativeFormat.name,
        openingPattern: varietyElements.openingPattern.pattern,
        painPoint: painPoint.title,
      },
    });
  } catch (error) {
    console.error('❌ Error generating content:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
