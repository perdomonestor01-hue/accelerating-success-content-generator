import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PostingManager } from '@/lib/social-media/posting-manager';
import { Platform } from '@/lib/social-media/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contentId, platforms } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const postingManager = new PostingManager();
    const results = await postingManager.postToAll(
      contentId,
      platforms as Platform[] | undefined
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error posting content:', error);
    return NextResponse.json(
      {
        error: 'Failed to post content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
