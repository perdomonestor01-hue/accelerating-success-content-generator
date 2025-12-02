import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';
import { BasePoster } from './base-poster';
import { PostingResult } from './types';

export class TumblrPoster extends BasePoster {
  platform = 'TUMBLR' as const;
  private oauth: OAuth;

  constructor() {
    super();
    this.oauth = new OAuth({
      consumer: {
        key: process.env.TUMBLR_CONSUMER_KEY || '',
        secret: process.env.TUMBLR_CONSUMER_SECRET || '',
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });
  }

  async isEnabled(): Promise<boolean> {
    return !!(
      process.env.TUMBLR_CONSUMER_KEY &&
      process.env.TUMBLR_CONSUMER_SECRET &&
      process.env.TUMBLR_ACCESS_TOKEN &&
      process.env.TUMBLR_ACCESS_SECRET &&
      process.env.TUMBLR_BLOG_IDENTIFIER
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `https://api.tumblr.com/v2/user/info`;
      const token = {
        key: process.env.TUMBLR_ACCESS_TOKEN || '',
        secret: process.env.TUMBLR_ACCESS_SECRET || '',
      };

      const authHeader = this.oauth.toHeader(
        this.oauth.authorize({ url, method: 'GET' }, token)
      );

      const response = await axios.get(url, {
        headers: authHeader as any,
      });

      console.log('✓ Tumblr connection successful:', response.data.response.user.name);
      return true;
    } catch (error: any) {
      console.error('✗ Tumblr connection failed:', error.message);
      return false;
    }
  }

  async post(content: string, mediaUrl?: string): Promise<PostingResult> {
    try {
      const url = `https://api.tumblr.com/v2/blog/${process.env.TUMBLR_BLOG_IDENTIFIER}/posts`;
      const token = {
        key: process.env.TUMBLR_ACCESS_TOKEN || '',
        secret: process.env.TUMBLR_ACCESS_SECRET || '',
      };

      const postData = {
        type: 'text',
        title: content.split('\n')[0],
        body: content,
      };

      const authHeader = this.oauth.toHeader(
        this.oauth.authorize({ url, method: 'POST' }, token)
      );

      const response = await axios.post(url, postData, {
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
      });

      const postId = response.data.response.id;

      return {
        success: true,
        platform: this.platform,
        postId: postId.toString(),
        postUrl: `https://${process.env.TUMBLR_BLOG_IDENTIFIER}/post/${postId}`,
      };
    } catch (error: any) {
      console.error('Tumblr posting error:', error);

      if (error.response?.status === 429) {
        return {
          success: false,
          platform: this.platform,
          error: error.response?.data?.meta?.msg || error.message,
          rateLimited: true,
          retryAfter: Date.now() + 900000,
        };
      }

      return {
        success: false,
        platform: this.platform,
        error: error.response?.data?.meta?.msg || error.message,
      };
    }
  }
}
