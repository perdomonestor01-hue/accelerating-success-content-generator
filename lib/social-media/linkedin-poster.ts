import axios from 'axios';
import { BasePoster } from './base-poster';
import { PostingResult } from './types';

/**
 * LinkedIn Poster with Image Support
 * Uses LinkedIn's UGC Posts API v2
 *
 * Image upload flow:
 * 1. Register upload → get uploadUrl + asset URN
 * 2. Upload binary image to uploadUrl
 * 3. Create post with asset URN
 *
 * Safety features:
 * - Image size limit: 5MB max
 * - Retry logic with exponential backoff
 * - Timeout on downloads: 30 seconds
 */

// Constants
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB - LinkedIn's limit
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const DOWNLOAD_TIMEOUT_MS = 30000;

export interface LinkedInImageUpload {
  imageUrl: string;        // Source URL to download from
  title?: string;          // Alt text / title for the image
}

// Utility: sleep for exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class LinkedInPoster extends BasePoster {
  platform = 'LINKEDIN' as const;

  private get accessToken(): string {
    return process.env.LINKEDIN_ACCESS_TOKEN || '';
  }

  private get personUrn(): string {
    return process.env.LINKEDIN_PERSON_URN || '';
  }

  async isEnabled(): Promise<boolean> {
    return !!(this.accessToken && this.personUrn);
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        'https://api.linkedin.com/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
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

  /**
   * Post content to LinkedIn with optional image
   * @param content Text content of the post
   * @param mediaUrl Optional image URL to include
   */
  async post(content: string, mediaUrl?: string): Promise<PostingResult> {
    try {
      // If we have an image URL, upload it first
      let assetUrn: string | undefined;

      if (mediaUrl) {
        console.log('📸 Uploading image to LinkedIn...');
        assetUrn = await this.uploadImage(mediaUrl);

        if (assetUrn) {
          console.log('✓ Image uploaded successfully:', assetUrn);
        } else {
          console.log('⚠️ Image upload failed, posting text-only');
        }
      }

      // Build the post payload
      const postPayload = this.buildPostPayload(content, assetUrn);

      // Create the post
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        postPayload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
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

  /**
   * Upload an image to LinkedIn with retry logic
   * @param imageUrl URL of the image to upload
   * @returns Asset URN if successful, undefined if failed
   */
  private async uploadImage(imageUrl: string): Promise<string | undefined> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`📤 Image upload attempt ${attempt}/${MAX_RETRIES}...`);

        // Step 1: Download the image binary FIRST (to validate size before registering)
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: DOWNLOAD_TIMEOUT_MS,
        });

        const imageBuffer = Buffer.from(imageResponse.data);
        const contentType = imageResponse.headers['content-type'] || 'image/jpeg';

        // Validate content type is an image
        if (!contentType.startsWith('image/')) {
          console.log(`⚠️ Invalid content type: ${contentType}. Skipping image.`);
          return undefined;
        }

        // Validate image size (LinkedIn max: 5MB)
        if (imageBuffer.length > MAX_IMAGE_SIZE_BYTES) {
          console.log(`⚠️ Image too large: ${(imageBuffer.length / 1024 / 1024).toFixed(2)}MB (max: 5MB). Skipping.`);
          return undefined;
        }

        console.log(`📦 Image size: ${(imageBuffer.length / 1024).toFixed(1)}KB ✓`);

        // Step 2: Register the upload
        const registerResponse = await axios.post(
          'https://api.linkedin.com/v2/assets?action=registerUpload',
          {
            registerUploadRequest: {
              recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
              owner: `urn:li:person:${this.personUrn}`,
              serviceRelationships: [
                {
                  relationshipType: 'OWNER',
                  identifier: 'urn:li:userGeneratedContent',
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0',
            },
            timeout: DOWNLOAD_TIMEOUT_MS,
          }
        );

        const uploadUrl = registerResponse.data.value.uploadMechanism[
          'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
        ].uploadUrl;
        const asset = registerResponse.data.value.asset;

        console.log('📤 Upload URL obtained, uploading to LinkedIn...');

        // Step 3: Upload the image binary
        await axios.put(uploadUrl, imageBuffer, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': contentType,
          },
          maxBodyLength: Infinity,
          timeout: DOWNLOAD_TIMEOUT_MS,
        });

        console.log('✓ Image uploaded successfully');
        return asset;

      } catch (error: any) {
        const isRetryable = error.code === 'ECONNRESET' ||
                          error.code === 'ETIMEDOUT' ||
                          error.response?.status >= 500 ||
                          error.response?.status === 429;

        if (isRetryable && attempt < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          console.log(`⚠️ Upload failed (${error.message}). Retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        console.error(`Image upload error (attempt ${attempt}):`, error.response?.data || error.message);
        return undefined;
      }
    }

    return undefined;
  }

  /**
   * Build the post payload with or without an image
   */
  private buildPostPayload(content: string, assetUrn?: string) {
    const basePayload = {
      author: `urn:li:person:${this.personUrn}`,
      lifecycleState: 'PUBLISHED',
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    if (assetUrn) {
      // Post with image
      return {
        ...basePayload,
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'IMAGE',
            media: [
              {
                status: 'READY',
                media: assetUrn,
              },
            ],
          },
        },
      };
    } else {
      // Text-only post
      return {
        ...basePayload,
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
      };
    }
  }
}
