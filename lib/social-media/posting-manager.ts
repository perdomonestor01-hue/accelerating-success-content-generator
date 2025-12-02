import { prisma } from '@/lib/db';
import { TwitterPoster } from './twitter-poster';
import { FacebookPoster } from './facebook-poster';
import { LinkedInPoster } from './linkedin-poster';
import { BloggerPoster } from './blogger-poster';
import { TumblrPoster } from './tumblr-poster';
import { MockPoster } from './mock-poster';
import { PostingResult, Platform, SocialMediaPoster } from './types';

export class PostingManager {
  private posters: Record<Platform, SocialMediaPoster>;
  private isMockMode: boolean;

  constructor() {
    this.isMockMode = process.env.MOCK_POSTING === 'true';

    if (this.isMockMode) {
      console.log('🧪 [MOCK MODE] Using simulated posting - no real posts will be made');
      this.posters = {
        TWITTER: new MockPoster('TWITTER'),
        FACEBOOK: new MockPoster('FACEBOOK'),
        LINKEDIN: new MockPoster('LINKEDIN'),
        BLOGGER: new MockPoster('BLOGGER'),
        TUMBLR: new MockPoster('TUMBLR'),
      };
    } else {
      this.posters = {
        TWITTER: new TwitterPoster(),
        FACEBOOK: new FacebookPoster(),
        LINKEDIN: new LinkedInPoster(),
        BLOGGER: new BloggerPoster(),
        TUMBLR: new TumblrPoster(),
      };
    }
  }

  async postToAll(contentId: string, platforms?: Platform[]): Promise<PostingResult[]> {
    // Get content from database
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new Error(`Content not found: ${contentId}`);
    }

    // Determine which platforms to post to
    const targetPlatforms = platforms || Object.keys(this.posters) as Platform[];

    // Post to each platform
    const results: PostingResult[] = [];

    for (const platform of targetPlatforms) {
      const result = await this.postToPlatform(contentId, platform);
      results.push(result);
    }

    // Update content status based on results
    const allSucceeded = results.every(r => r.success);
    const anySucceeded = results.some(r => r.success);

    await prisma.content.update({
      where: { id: contentId },
      data: {
        status: allSucceeded ? 'POSTED' : anySucceeded ? 'FAILED' : 'FAILED',
        postedAt: allSucceeded ? new Date() : null,
      },
    });

    return results;
  }

  async postToPlatform(contentId: string, platform: Platform): Promise<PostingResult> {
    try {
      // Get content from database
      const content = await prisma.content.findUnique({
        where: { id: contentId },
      });

      if (!content) {
        throw new Error(`Content not found: ${contentId}`);
      }

      // Get platform-specific content
      const postContent = this.getContentForPlatform(content, platform);

      // Check if poster is enabled
      const poster = this.posters[platform];
      const isEnabled = await poster.isEnabled();

      if (!isEnabled) {
        const result: PostingResult = {
          success: false,
          platform,
          error: `${platform} is not enabled (missing credentials)`,
        };

        await this.savePostingHistory(contentId, result);
        return result;
      }

      // Post to platform
      const result = await poster.post(postContent);

      // Save to posting history
      await this.savePostingHistory(contentId, result);

      return result;
    } catch (error: any) {
      const result: PostingResult = {
        success: false,
        platform,
        error: error.message,
      };

      await this.savePostingHistory(contentId, result);
      return result;
    }
  }

  private getContentForPlatform(content: any, platform: Platform): string {
    const platformMap: Record<Platform, string> = {
      TWITTER: content.twitterPost,
      FACEBOOK: content.facebookPost,
      LINKEDIN: content.linkedinPost,
      BLOGGER: content.bloggerPost || content.linkedinPost,
      TUMBLR: content.tumblrPost || content.linkedinPost,
    };

    return platformMap[platform] || content.linkedinPost;
  }

  private async savePostingHistory(contentId: string, result: PostingResult) {
    await prisma.postingHistory.create({
      data: {
        contentId,
        platform: result.platform,
        status: result.success ? 'SUCCESS' : result.rateLimited ? 'RATE_LIMITED' : 'FAILED',
        platformPostId: result.postId,
        platformUrl: result.postUrl,
        error: result.error,
        postedAt: result.success ? new Date() : null,
      },
    });
  }

  async retryFailed(contentId: string): Promise<PostingResult[]> {
    // Get failed posting history
    const failedPosts = await prisma.postingHistory.findMany({
      where: {
        contentId,
        status: { in: ['FAILED', 'RATE_LIMITED'] },
      },
    });

    const results: PostingResult[] = [];

    for (const failed of failedPosts) {
      const platform = failed.platform as Platform;
      const result = await this.postToPlatform(contentId, platform);
      results.push(result);
    }

    return results;
  }

  async testAllConnections(): Promise<Record<Platform, boolean>> {
    const results: Record<Platform, boolean> = {} as any;

    for (const [platform, poster] of Object.entries(this.posters)) {
      try {
        results[platform as Platform] = await poster.testConnection();
      } catch (error) {
        results[platform as Platform] = false;
      }
    }

    return results;
  }
}
