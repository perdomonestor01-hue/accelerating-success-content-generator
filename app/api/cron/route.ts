import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { aiProvider } from '@/lib/ai/provider';
import { Topic, ContentAngle } from '@prisma/client';

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

    return NextResponse.json({
      success: true,
      message: 'Daily content generated successfully',
      content: {
        id: content.id,
        ideaTitle: content.ideaTitle,
        topic: content.topic,
        concept: content.specificConcept,
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
