import axios from 'axios';
import { BasePoster } from './base-poster';
import { PostingResult } from './types';

export class LinkedInPoster extends BasePoster {
  platform = 'LINKEDIN' as const;

  async isEnabled(): Promise<boolean> {
    return !!(
      process.env.LINKEDIN_ACCESS_TOKEN &&
      process.env.LINKEDIN_PERSON_URN
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        'https://api.linkedin.com/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
          },
        }
      );
      console.log('✓ LinkedIn connection successful:', response.data.name);
      return true;
    } catch (error: any) {
      console.error('✗ LinkedIn connection failed:', error.message);
      return false;
    }
  }

  async post(content: string, mediaUrl?: string): Promise<PostingResult> {
    try {
      const personUrn = process.env.LINKEDIN_PERSON_URN;

      // Use UGC Posts API (more reliable than rest/posts)
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${personUrn}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      const postId = response.headers['x-restli-id'] || response.data.id;

      return {
        success: true,
        platform: this.platform,
        postId,
        postUrl: `https://www.linkedin.com/feed/update/${postId}`,
      };
    } catch (error: any) {
      console.error('LinkedIn posting error:', error.response?.data || error.message);

      if (error.response?.status === 429) {
        return {
          success: false,
          platform: this.platform,
          error: error.response?.data?.message || error.message,
          rateLimited: true,
          retryAfter: Date.now() + 900000,
        };
      }

      return {
        success: false,
        platform: this.platform,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}
