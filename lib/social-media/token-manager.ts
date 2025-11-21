import axios from 'axios';
import { prisma } from '@/lib/db';

export class TokenManager {
  async refreshGoogleToken(): Promise<string> {
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

      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      // Update database
      await prisma.socialMediaConfig.upsert({
        where: { platform: 'BLOGGER' },
        update: {
          accessToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
        create: {
          platform: 'BLOGGER',
          enabled: true,
          accessToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
      });

      return accessToken;
    } catch (error: any) {
      console.error('Failed to refresh Google token:', error.message);
      throw error;
    }
  }

  async refreshFacebookToken(): Promise<string> {
    try {
      // Exchange short-lived token for long-lived token
      const response = await axios.get(
        'https://graph.facebook.com/v18.0/oauth/access_token',
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
          },
        }
      );

      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      await prisma.socialMediaConfig.upsert({
        where: { platform: 'FACEBOOK' },
        update: {
          accessToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
        create: {
          platform: 'FACEBOOK',
          enabled: true,
          accessToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
      });

      return accessToken;
    } catch (error: any) {
      console.error('Failed to refresh Facebook token:', error.message);
      throw error;
    }
  }

  async refreshLinkedInToken(): Promise<string> {
    // LinkedIn tokens are long-lived (60 days)
    // This is a placeholder for when you need to implement refresh
    console.log('LinkedIn token refresh not yet implemented');
    return process.env.LINKEDIN_ACCESS_TOKEN || '';
  }

  async refreshTwitterToken(): Promise<string> {
    // Twitter OAuth 1.0a tokens don't expire
    // OAuth 2.0 tokens would need refresh logic here
    console.log('Twitter token refresh not needed for OAuth 1.0a');
    return process.env.TWITTER_ACCESS_TOKEN || '';
  }

  async checkAndRefreshAll(): Promise<void> {
    const configs = await prisma.socialMediaConfig.findMany();

    for (const config of configs) {
      if (!config.tokenExpiresAt) continue;

      // Refresh if expiring within 24 hours
      const expiresIn = config.tokenExpiresAt.getTime() - Date.now();
      if (expiresIn < 24 * 60 * 60 * 1000) {
        console.log(`Refreshing ${config.platform} token...`);

        try {
          switch (config.platform) {
            case 'BLOGGER':
              await this.refreshGoogleToken();
              break;
            case 'FACEBOOK':
              await this.refreshFacebookToken();
              break;
            case 'LINKEDIN':
              await this.refreshLinkedInToken();
              break;
          }
        } catch (error: any) {
          console.error(`Failed to refresh ${config.platform}:`, error.message);
        }
      }
    }
  }
}
