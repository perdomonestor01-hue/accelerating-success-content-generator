import { TwitterApi } from 'twitter-api-v2';
import { BasePoster } from './base-poster';
import { PostingResult } from './types';

export class TwitterPoster extends BasePoster {
  platform = 'TWITTER';
  private client: TwitterApi | null = null;

  private initClient() {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      throw new Error('Twitter API credentials not configured');
    }

    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
  }

  async isEnabled(): Promise<boolean> {
    return !!(
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.client) this.initClient();
      const me = await this.client!.v2.me();
      console.log('✓ Twitter connection successful:', me.data.username);
      return true;
    } catch (error: any) {
      console.error('✗ Twitter connection failed:', error.message);
      return false;
    }
  }

  async post(content: string, mediaUrl?: string): Promise<PostingResult> {
    try {
      if (!this.client) this.initClient();

      const tweet = await this.client!.v2.tweet({
        text: content,
      });

      return {
        success: true,
        platform: this.platform,
        postId: tweet.data.id,
        postUrl: `https://twitter.com/i/web/status/${tweet.data.id}`,
      };
    } catch (error: any) {
      console.error('Twitter posting error:', error);

      // Check for rate limiting
      if (error.code === 429 || error.rateLimit) {
        return {
          success: false,
          platform: this.platform,
          error: error.message,
          rateLimited: true,
          retryAfter: error.rateLimit?.reset || Date.now() + 900000, // 15 min default
        };
      }

      return {
        success: false,
        platform: this.platform,
        error: error.message || 'Unknown error',
      };
    }
  }
}
