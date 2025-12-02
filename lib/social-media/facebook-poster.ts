import axios from 'axios';
import { BasePoster } from './base-poster';
import { PostingResult } from './types';

export class FacebookPoster extends BasePoster {
  platform = 'FACEBOOK' as const;

  async isEnabled(): Promise<boolean> {
    return !!(
      process.env.FACEBOOK_PAGE_ACCESS_TOKEN &&
      process.env.FACEBOOK_PAGE_ID
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/me`,
        {
          params: {
            access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
          },
        }
      );
      console.log('✓ Facebook connection successful:', response.data.name);
      return true;
    } catch (error: any) {
      console.error('✗ Facebook connection failed:', error.message);
      return false;
    }
  }

  async post(content: string, mediaUrl?: string): Promise<PostingResult> {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
        {
          message: content,
          access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
        }
      );

      return {
        success: true,
        platform: this.platform,
        postId: response.data.id,
        postUrl: `https://facebook.com/${response.data.id}`,
      };
    } catch (error: any) {
      console.error('Facebook posting error:', error);

      // Check for rate limiting
      if (error.response?.status === 429) {
        return {
          success: false,
          platform: this.platform,
          error: error.response?.data?.error?.message || error.message,
          rateLimited: true,
          retryAfter: Date.now() + 900000, // 15 min
        };
      }

      return {
        success: false,
        platform: this.platform,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }
}
