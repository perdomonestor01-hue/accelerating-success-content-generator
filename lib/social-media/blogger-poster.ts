import axios from 'axios';
import { BasePoster } from './base-poster';
import { PostingResult } from './types';

export class BloggerPoster extends BasePoster {
  platform = 'BLOGGER' as const;

  async isEnabled(): Promise<boolean> {
    return !!(
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_BLOG_ID
    );
  }

  private async getAccessToken(): Promise<string> {
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      throw new Error('Google refresh token not configured');
    }

    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
          grant_type: 'refresh_token',
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      throw new Error(`Failed to refresh Google token: ${error.message}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://www.googleapis.com/blogger/v3/blogs/${process.env.GOOGLE_BLOG_ID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('✓ Blogger connection successful:', response.data.name);
      return true;
    } catch (error: any) {
      console.error('✗ Blogger connection failed:', error.message);
      return false;
    }
  }

  async post(content: string, mediaUrl?: string): Promise<PostingResult> {
    try {
      const accessToken = await this.getAccessToken();

      // Extract title from first line of content
      const lines = content.split('\n');
      const title = lines[0].replace(/^#+\s*/, '').trim();
      const body = lines.slice(1).join('\n');

      const response = await axios.post(
        `https://www.googleapis.com/blogger/v3/blogs/${process.env.GOOGLE_BLOG_ID}/posts/`,
        {
          kind: 'blogger#post',
          title,
          content: body.replace(/\n/g, '<br>'),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        platform: this.platform,
        postId: response.data.id,
        postUrl: response.data.url,
      };
    } catch (error: any) {
      console.error('Blogger posting error:', error);

      if (error.response?.status === 429) {
        return {
          success: false,
          platform: this.platform,
          error: error.response?.data?.error?.message || error.message,
          rateLimited: true,
          retryAfter: Date.now() + 900000,
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
