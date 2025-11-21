import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PostingManager } from '@/lib/social-media/posting-manager';

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
    const { contentId } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const postingManager = new PostingManager();
    const results = await postingManager.retryFailed(contentId);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error retrying failed posts:', error);
    return NextResponse.json(
      {
        error: 'Failed to retry posts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
