import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { aiProvider } from '@/lib/ai/provider';
import { Topic, ContentAngle } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Map enum values to display names
const topicDescriptions: Record<Topic, string> = {
  PHYSICAL_SCIENCE: 'Physical Science',
  EARTH_SCIENCE: 'Earth Science',
  LIFE_SCIENCE: 'Life Science',
  BIOLOGY: 'Biology',
  MATH: 'Math',
};

const angleDescriptions: Record<ContentAngle, string> = {
  TIME_SAVER: 'time-saver',
  BILINGUAL: 'bilingual support',
  ENGAGEMENT: 'student engagement',
  STAAR_PREP: 'STAAR prep',
  STUDENT_SUCCESS: 'student success',
  TEACHER_TESTIMONIAL: 'teacher testimonial',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, concept, gradeLevel, contentAngle } = body;

    // Validate required fields
    if (!topic || !concept || !gradeLevel || !contentAngle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get a testimonial video (rotate through them)
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { usageCount: 'asc' }, // Use least-used testimonial
      take: 1,
    });

    if (testimonials.length === 0) {
      return NextResponse.json(
        { error: 'No testimonial videos available. Please seed the database.' },
        { status: 500 }
      );
    }

    const testimonial = testimonials[0];

    // Generate content using AI
    console.log('Generating content with AI provider...');
    const generatedContent = await aiProvider.generateContent({
      topic: topicDescriptions[topic as Topic],
      concept,
      gradeLevel,
      contentAngle: angleDescriptions[contentAngle as ContentAngle],
      testimonialUrl: testimonial.youtubeUrl,
      testimonialTitle: testimonial.title,
    });

    // Save to database
    const content = await prisma.content.create({
      data: {
        ideaTitle: generatedContent.ideaTitle,
        topic: topic as Topic,
        specificConcept: concept,
        gradeLevel,
        contentAngle: contentAngle as ContentAngle,
        linkedinPost: generatedContent.linkedinPost,
        redditPost: generatedContent.redditPost,
        facebookPost: generatedContent.facebookPost,
        twitterPost: generatedContent.twitterPost,
        testimonialId: testimonial.id,
        status: 'DRAFT',
      },
      include: {
        testimonial: true,
      },
    });

    // Update testimonial usage count
    await prisma.testimonial.update({
      where: { id: testimonial.id },
      data: { usageCount: { increment: 1 } },
    });

    console.log(`✅ Content generated: ${content.ideaTitle}`);

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
