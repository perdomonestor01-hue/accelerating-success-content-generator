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
      const blogId = process.env.TUMBLR_BLOG_IDENTIFIER;
      // Use legacy /post endpoint with form-encoded data (more reliable)
      const url = `https://api.tumblr.com/v2/blog/${blogId}.tumblr.com/post`;
      const token = {
        key: process.env.TUMBLR_ACCESS_TOKEN || '',
        secret: process.env.TUMBLR_ACCESS_SECRET || '',
      };

      // Extract title from first line, rest is body
      const lines = content.split('\n');
      const title = lines[0].replace(/^#*\s*/, '').substring(0, 100); // Remove markdown headers, limit length
      const body = lines.slice(1).join('\n').trim() || content;

      // Form data for legacy endpoint
      const formData = new URLSearchParams({
        type: 'text',
        title: title,
        body: body,
        tags: 'AcceleratingSuccess,education,teachers,science,bilingual',
      });

      // OAuth signature needs to include form data
      const requestData = {
        url,
        method: 'POST',
        data: Object.fromEntries(formData),
      };

      const authHeader = this.oauth.toHeader(
        this.oauth.authorize(requestData, token)
      );

      const response = await axios.post(url, formData.toString(), {
        headers: {
          ...authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const postId = response.data.response.id_string || response.data.response.id;

      return {
        success: true,
        platform: this.platform,
        postId: postId.toString(),
        postUrl: `https://${blogId}.tumblr.com/post/${postId}`,
      };
    } catch (error: any) {
      console.error('Tumblr posting error:', error.response?.data || error.message);

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
