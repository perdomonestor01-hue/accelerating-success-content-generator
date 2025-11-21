import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PostingManager } from '@/lib/social-media/posting-manager';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postingManager = new PostingManager();
    const connectionTests = await postingManager.testAllConnections();

    return NextResponse.json({
      success: true,
      connections: connectionTests,
    });
  } catch (error) {
    console.error('Error testing connections:', error);
    return NextResponse.json(
      {
        error: 'Failed to test connections',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
