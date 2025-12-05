import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { aiProvider } from '@/lib/ai/provider';
import { Topic, ContentAngle } from '@prisma/client';
import { PostingManager } from '@/lib/social-media/posting-manager';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// TEKS-ALIGNED CONTENT STRUCTURE
// Each concept is paired with its correct grade level(s) - NO random grade selection!
// This ensures we never say "4th grade teachers teaching DNA and heredity"
// ═══════════════════════════════════════════════════════════════════════════════

interface TEKSAlignedContent {
  concept: string;
  grades: string; // The grade(s) that actually teach this concept
  teksRef?: string; // Optional TEKS reference for accuracy
}

// TEKS Chapter 112 aligned - each concept with its correct grade level(s)
const teksAlignedContent: Record<Topic, TEKSAlignedContent[]> = {
  // Physical Science (Grades 3-5) - TEKS Chapter 112, Subchapter A
  PHYSICAL_SCIENCE: [
    { concept: 'states of matter (solid, liquid, gas)', grades: '3rd-5th' },
    { concept: 'properties of matter', grades: '5th' },
    { concept: 'mixtures & solutions', grades: '5th' },
    { concept: 'forces & motion (push, pull)', grades: '3rd-4th' },
    { concept: 'simple machines', grades: '4th-5th' },
    { concept: 'forms of energy', grades: '4th-5th' },
    { concept: 'light & sound energy', grades: '3rd-4th' },
    { concept: 'heat & thermal energy', grades: '4th-5th' },
    { concept: 'electrical circuits', grades: '4th-5th' },
    { concept: 'conductors & insulators', grades: '5th' },
  ],
  // Earth Science (Grades 3-5) - TEKS Chapter 112, Subchapter A
  EARTH_SCIENCE: [
    { concept: 'weather patterns', grades: '3rd-4th' },
    { concept: 'water cycle', grades: '4th-5th' },
    { concept: 'rocks & minerals', grades: '4th-5th' },
    { concept: 'fossils', grades: '4th-5th' },
    { concept: 'soil & erosion', grades: '3rd-4th' },
    { concept: 'natural resources', grades: '3rd-5th' },
    { concept: 'Earth\'s surface changes', grades: '4th-5th' },
    { concept: 'sun, moon & stars', grades: '3rd-4th' },
  ],
  // Life Science (Grades 3-5) - TEKS Chapter 112, Subchapter A
  LIFE_SCIENCE: [
    { concept: 'life cycles (plants & animals)', grades: '3rd-4th' },
    { concept: 'animal adaptations', grades: '3rd-5th' },
    { concept: 'plant structures & functions', grades: '3rd-4th' },
    { concept: 'food chains & food webs', grades: '4th-5th' },
    { concept: 'ecosystems & habitats', grades: '4th-5th' },
    { concept: 'inherited traits', grades: '3rd-4th' },
    { concept: 'basic needs of organisms', grades: '3rd-4th' },
  ],
  // Middle School Science (Grades 6-8) - TEKS Chapter 112, Subchapter B
  BIOLOGY: [
    // Grade 6 (§112.26)
    { concept: 'matter & states (particle motion)', grades: '6th', teksRef: '§112.26' },
    { concept: 'mixtures & pure substances', grades: '6th', teksRef: '§112.26' },
    { concept: 'density & buoyancy', grades: '6th', teksRef: '§112.26' },
    { concept: 'forces (gravity, friction, magnetism)', grades: '6th', teksRef: '§112.26' },
    { concept: 'potential & kinetic energy', grades: '6th', teksRef: '§112.26' },
    { concept: 'waves (transverse & longitudinal)', grades: '6th', teksRef: '§112.26' },
    { concept: 'Earth\'s layers & rock cycle', grades: '6th', teksRef: '§112.26' },
    { concept: 'ecosystems & biomes', grades: '6th', teksRef: '§112.26' },
    { concept: 'symbiotic relationships', grades: '6th', teksRef: '§112.26' },
    { concept: 'cell theory basics', grades: '6th', teksRef: '§112.26' },
    // Grade 7 (§112.27)
    { concept: 'elements & compounds', grades: '7th', teksRef: '§112.27' },
    { concept: 'chemical formulas & periodic table', grades: '7th', teksRef: '§112.27' },
    { concept: 'physical vs chemical changes', grades: '7th', teksRef: '§112.27' },
    { concept: 'speed, velocity & motion', grades: '7th', teksRef: '§112.27' },
    { concept: 'Newton\'s First Law (inertia)', grades: '7th', teksRef: '§112.27' },
    { concept: 'thermal energy transfer', grades: '7th', teksRef: '§112.27' },
    { concept: 'solar system & space', grades: '7th', teksRef: '§112.27' },
    { concept: 'plate tectonics', grades: '7th', teksRef: '§112.27' },
    { concept: 'human body systems', grades: '7th', teksRef: '§112.27' },
    { concept: 'cells, tissues & organs', grades: '7th', teksRef: '§112.27' },
    // Grade 8 (§112.28)
    { concept: 'atoms & atomic structure', grades: '8th', teksRef: '§112.28' },
    { concept: 'Newton\'s Laws of Motion (all three)', grades: '8th', teksRef: '§112.28' },
    { concept: 'force, mass & acceleration (F=ma)', grades: '8th', teksRef: '§112.28' },
    { concept: 'waves & electromagnetic spectrum', grades: '8th', teksRef: '§112.28' },
    { concept: 'DNA, genes & heredity', grades: '8th', teksRef: '§112.28' },
    { concept: 'cell organelles & functions', grades: '8th', teksRef: '§112.28' },
    { concept: 'photosynthesis', grades: '8th', teksRef: '§112.28' },
    { concept: 'ecological succession', grades: '8th', teksRef: '§112.28' },
    { concept: 'stars & galaxies', grades: '8th', teksRef: '§112.28' },
    { concept: 'climate & weather systems', grades: '8th', teksRef: '§112.28' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEACHER PAIN POINTS - The NEW basis for content diversity
// Instead of varying grade level, we vary the pain point being addressed
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

const topicDescriptions: Record<Topic, string> = {
  PHYSICAL_SCIENCE: 'Physical Science',
  EARTH_SCIENCE: 'Earth Science',
  LIFE_SCIENCE: 'Life Science',
  BIOLOGY: 'Biology',
};

const angleDescriptions: Record<ContentAngle, string> = {
  TIME_SAVER: 'time-saver',
  BILINGUAL: 'bilingual support',
  ENGAGEMENT: 'student engagement',
  STAAR_PREP: 'STAAR prep',
  STUDENT_SUCCESS: 'student success',
  TEACHER_TESTIMONIAL: 'teacher testimonial',
};

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for automated calls (Railway cron, external schedulers)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow access if: valid cron secret OR in development
    const isDev = process.env.NODE_ENV === 'development';
    const hasValidSecret = authHeader === `Bearer ${cronSecret}`;

    if (!isDev && !hasValidSecret) {
      console.log('❌ Unauthorized cron request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🤖 Daily content generation started (Pain-Point Diversity mode)');

    // Get today's day of week (0 = Sunday, 6 = Saturday)
    const today = new Date().getDay();

    // Get schedule configuration for today
    let scheduleConfig = await prisma.scheduleConfig.findUnique({
      where: { dayOfWeek: today },
    });

    // If no config for today or not enabled, use default
    if (!scheduleConfig || !scheduleConfig.enabled) {
      console.log(`No schedule config for day ${today}, using defaults`);
      scheduleConfig = {
        id: 'default',
        dayOfWeek: today,
        topicPreference: null,
        contentAnglePreference: null,
        enabled: true,
        customPromptOverride: null,
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NEW CONTENT SELECTION: Pain Point → TEKS-aligned Topic/Concept
    // This ensures grade levels ALWAYS match the concepts being discussed
    // ═══════════════════════════════════════════════════════════════════════════

    // Select a random PAIN POINT as the primary diversity driver
    const painPoint = teacherPainPoints[Math.floor(Math.random() * teacherPainPoints.length)];
    console.log(`📍 Pain Point Focus: ${painPoint.title}`);

    // Select topic (use preference or random)
    const topics = Object.values(Topic);
    const topic = scheduleConfig.topicPreference || topics[Math.floor(Math.random() * topics.length)];

    // Select a TEKS-aligned concept (grade level is now EMBEDDED in the content!)
    const teksContent = teksAlignedContent[topic];
    const selectedContent = teksContent[Math.floor(Math.random() * teksContent.length)];
    const concept = selectedContent.concept;
    const gradeLevel = selectedContent.grades; // Grade comes FROM the concept, not randomly!
    const teksRef = selectedContent.teksRef || '';

    console.log(`📚 Selected: ${concept} (${gradeLevel}) - TEKS alignment guaranteed!`);

    // Content angle based on pain point
    const contentAngle = scheduleConfig.contentAnglePreference || ContentAngle.STAAR_PREP;

    // Get a testimonial video (random selection with weighted rotation)
    // Fetch all testimonials, prioritize less-used ones but add randomness
    const allTestimonials = await prisma.testimonial.findMany({
      orderBy: { usageCount: 'asc' },
    });

    if (allTestimonials.length === 0) {
      throw new Error('No testimonial videos available');
    }

    // Pick randomly from the top 3 least-used testimonials (or all if fewer than 3)
    const poolSize = Math.min(3, allTestimonials.length);
    const testimonialPool = allTestimonials.slice(0, poolSize);
    const testimonial = testimonialPool[Math.floor(Math.random() * poolSize)];

    console.log(`📝 Generating: ${topic} - ${concept} (${gradeLevel})`);
    console.log(`   Pain Point: "${painPoint.title}" | Angle: ${contentAngle}${teksRef ? ` | TEKS: ${teksRef}` : ''}`);

    // Fetch recent content to avoid repetition
    const recentContent = await prisma.content.findMany({
      select: { ideaTitle: true, linkedinPost: true },
      orderBy: { createdAt: 'desc' },
      take: 10, // Last 10 posts for better variety
    });

    const recentTitles = recentContent.map(c => c.ideaTitle);
    const recentHooks = recentContent.map(c => {
      // Extract first sentence/hook from LinkedIn post
      const firstLine = c.linkedinPost?.split('\n')[0] || '';
      return firstLine.slice(0, 100);
    });

    // Generate content using AI with PAIN POINT and TEKS reference for meaningful, specific content
    const generatedContent = await aiProvider.generateContent({
      topic: topicDescriptions[topic],
      concept,
      gradeLevel,
      contentAngle: angleDescriptions[contentAngle],
      testimonialUrl: testimonial.youtubeUrl,
      testimonialTitle: testimonial.title,
      recentTitles,
      recentHooks,
      // NEW: Pass the pain point for meaningful, teacher-focused content
      painPoint: {
        id: painPoint.id,
        title: painPoint.title,
        struggle: painPoint.struggle,
        solution: painPoint.solution,
        hookIdeas: painPoint.hookIdeas,
      },
      // NEW: Pass TEKS reference for accuracy
      teksRef: teksRef || undefined,
    });

    // Save to database
    const content = await prisma.content.create({
      data: {
        ideaTitle: generatedContent.ideaTitle,
        topic,
        specificConcept: concept,
        gradeLevel,
        contentAngle,
        linkedinPost: generatedContent.linkedinPost,
        redditPost: generatedContent.redditPost,
        facebookPost: generatedContent.facebookPost,
        twitterPost: generatedContent.twitterPost,
        bloggerPost: generatedContent.bloggerPost,
        tumblrPost: generatedContent.tumblrPost,
        testimonialId: testimonial.id,
        status: 'DRAFT',
      },
    });

    // Update testimonial usage count
    await prisma.testimonial.update({
      where: { id: testimonial.id },
      data: { usageCount: { increment: 1 } },
    });

    console.log(`✅ Daily content generated: ${content.ideaTitle}`);

    // Check if automated posting is enabled
    let postingResults = null;
    if (process.env.POSTING_ENABLED === 'true') {
      console.log('📤 Automated posting enabled - posting to all platforms...');

      try {
        const postingManager = new PostingManager();
        postingResults = await postingManager.postToAll(content.id);

        const allSucceeded = postingResults.every(r => r.success);
        const anySucceeded = postingResults.some(r => r.success);

        await prisma.content.update({
          where: { id: content.id },
          data: {
            status: allSucceeded ? 'POSTED' : anySucceeded ? 'FAILED' : 'FAILED',
            postedAt: allSucceeded ? new Date() : null,
          },
        });

        console.log(`✅ Posting complete - ${postingResults.filter(r => r.success).length}/${postingResults.length} succeeded`);
      } catch (postError) {
        console.error('❌ Error during automated posting:', postError);
        // Don't fail the entire cron job if posting fails
      }
    } else {
      console.log('📋 Automated posting disabled (POSTING_ENABLED=false)');
    }

    return NextResponse.json({
      success: true,
      message: 'Daily content generated successfully',
      content: {
        id: content.id,
        ideaTitle: content.ideaTitle,
        topic: content.topic,
        concept: content.specificConcept,
      },
      posting: postingResults ? {
        enabled: true,
        results: postingResults,
      } : {
        enabled: false,
      },
    });
  } catch (error) {
    console.error('❌ Error in cron job:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate daily content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
