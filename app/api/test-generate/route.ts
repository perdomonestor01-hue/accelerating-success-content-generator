import { NextRequest, NextResponse } from 'next/server';
import { aiProvider } from '@/lib/ai/provider';
import { getRotatedTestimonial } from '@/lib/videos';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Test endpoint that doesn't require database
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

    console.log('🤖 Generating content with AI...');
    console.log(`Topic: ${topic}, Concept: ${concept}, Grade: ${gradeLevel}, Angle: ${contentAngle}`);

    // Generate content using AI (no database required)
    const generatedContent = await aiProvider.generateContent({
      topic,
      concept,
      gradeLevel,
      contentAngle,
      testimonialUrl: finalTestimonialUrl,
      testimonialTitle: finalTestimonialTitle,
    });

    console.log(`✅ Content generated: ${generatedContent.ideaTitle}`);

    return NextResponse.json({
      success: true,
      content: generatedContent,
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
