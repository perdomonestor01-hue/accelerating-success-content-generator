import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { aiProvider } from '@/lib/ai/provider';
import { Topic, ContentAngle } from '@prisma/client';
import { PostingManager } from '@/lib/social-media/posting-manager';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Predefined concepts for each topic
const topicConcepts: Record<Topic, string[]> = {
  SCIENCE: ['force & motion', 'matter & energy', 'weather & water cycle', 'ecosystems', 'solar system', 'photosynthesis', 'rocks & minerals'],
  BIOLOGY: ['cell biology & genetics', 'DNA & heredity', 'evolution', 'cellular respiration', 'mitosis & meiosis', 'molecular biology'],
};

const gradeLevels = ['3rd', '4th', '5th', '4th-5th', '6th', '7th', '8th', '6-8'];

const topicDescriptions: Record<Topic, string> = {
  SCIENCE: 'Science',
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

    console.log('🤖 Daily content generation started');

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

    // Select topic (use preference or random)
    const topics = Object.values(Topic);
    const topic = scheduleConfig.topicPreference || topics[Math.floor(Math.random() * topics.length)];

    // Select concept
    const concepts = topicConcepts[topic];
    const concept = concepts[Math.floor(Math.random() * concepts.length)];

    // Select grade level
    const gradeLevel = gradeLevels[Math.floor(Math.random() * gradeLevels.length)];

    // Select content angle (use preference or random)
    const angles = Object.values(ContentAngle);
    const contentAngle = scheduleConfig.contentAnglePreference || angles[Math.floor(Math.random() * angles.length)];

    // Get a testimonial video (rotate through them)
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { usageCount: 'asc' },
      take: 1,
    });

    if (testimonials.length === 0) {
      throw new Error('No testimonial videos available');
    }

    const testimonial = testimonials[0];

    console.log(`Generating: ${topic} - ${concept} (${gradeLevel}) with ${contentAngle} angle`);

    // Generate content using AI
    const generatedContent = await aiProvider.generateContent({
      topic: topicDescriptions[topic],
      concept,
      gradeLevel,
      contentAngle: angleDescriptions[contentAngle],
      testimonialUrl: testimonial.youtubeUrl,
      testimonialTitle: testimonial.title,
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
