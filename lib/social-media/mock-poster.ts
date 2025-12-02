import { BasePoster } from './base-poster';
import { PostingResult, Platform } from './types';

/**
 * Mock Poster for local testing without real API tokens
 *
 * When MOCK_POSTING=true, this simulates successful posts
 * and logs what would be posted to each platform.
 */
export class MockPoster extends BasePoster {
  platform: Platform;
  private platformName: string;

  constructor(platform: Platform) {
    super();
    this.platform = platform;
    this.platformName = platform.charAt(0) + platform.slice(1).toLowerCase();
  }

  async isEnabled(): Promise<boolean> {
    // Mock is always enabled when MOCK_POSTING=true
    return process.env.MOCK_POSTING === 'true';
  }

  async testConnection(): Promise<boolean> {
    console.log(`✓ [MOCK] ${this.platformName} connection simulated successfully`);
    return true;
  }

  async post(content: string, mediaUrl?: string): Promise<PostingResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Generate mock post ID
    const mockPostId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log what would be posted
    console.log('\n' + '─'.repeat(60));
    console.log(`📤 [MOCK] Posting to ${this.platformName}`);
    console.log('─'.repeat(60));
    console.log(`Content (${content.length} chars):`);
    console.log(content.substring(0, 280) + (content.length > 280 ? '...' : ''));
    if (mediaUrl) {
      console.log(`Media: ${mediaUrl}`);
    }
    console.log('─'.repeat(60));
    console.log(`✅ [MOCK] Post ID: ${mockPostId}`);
    console.log('');

    return {
      success: true,
      platform: this.platform,
      postId: mockPostId,
      postUrl: this.getMockUrl(mockPostId),
    };
  }

  private getMockUrl(postId: string): string {
    const urls: Record<Platform, string> = {
      TWITTER: `https://twitter.com/mock/status/${postId}`,
      FACEBOOK: `https://facebook.com/mock/${postId}`,
      LINKEDIN: `https://linkedin.com/feed/update/${postId}`,
      BLOGGER: `https://mock-blog.blogspot.com/post/${postId}`,
      TUMBLR: `https://mock-blog.tumblr.com/post/${postId}`,
    };
    return urls[this.platform];
  }
}
