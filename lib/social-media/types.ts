// Social Media Posting Types

export interface PostingResult {
  success: boolean;
  platform: string;
  postId?: string;
  postUrl?: string;
  error?: string;
  rateLimited?: boolean;
  retryAfter?: number;
}

export interface SocialMediaPoster {
  platform: string;
  isEnabled(): Promise<boolean>;
  post(content: string, mediaUrl?: string): Promise<PostingResult>;
  testConnection(): Promise<boolean>;
  refreshToken?(): Promise<void>;
}

export type Platform = 'TWITTER' | 'FACEBOOK' | 'LINKEDIN' | 'BLOGGER' | 'TUMBLR';
export type PostingStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'RATE_LIMITED';

export interface PlatformConfig {
  enabled: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  config?: Record<string, any>;
}
