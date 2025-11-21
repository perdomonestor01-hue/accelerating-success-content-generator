#!/usr/bin/env node

/**
 * YouTube Playlist Scraper
 * Extracts video URLs and metadata from a YouTube playlist
 */

const https = require('https');

const playlistUrl = 'https://www.youtube.com/playlist?list=PLLoHRJ_mh-3AIjz2xratC5vEi1sKFV7HR';

function fetchPlaylist(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractVideos(html) {
  const videos = [];

  // Extract video IDs from the playlist page
  // YouTube playlist pages contain video data in ytInitialData
  const ytInitialDataMatch = html.match(/var ytInitialData = ({.+?});/);

  if (ytInitialDataMatch) {
    try {
      const data = JSON.parse(ytInitialDataMatch[1]);

      // Navigate through the nested structure to find videos
      const contents = data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;

      if (contents) {
        contents.forEach(item => {
          const videoRenderer = item.playlistVideoRenderer;
          if (videoRenderer && videoRenderer.videoId) {
            const video = {
              id: videoRenderer.videoId,
              url: `https://www.youtube.com/watch?v=${videoRenderer.videoId}`,
              shortUrl: `https://www.youtube.com/shorts/${videoRenderer.videoId}`,
              title: videoRenderer.title?.runs?.[0]?.text || 'Unknown Title',
              duration: videoRenderer.lengthText?.simpleText || 'Unknown',
              thumbnail: videoRenderer.thumbnail?.thumbnails?.[0]?.url || '',
            };
            videos.push(video);
          }
        });
      }
    } catch (e) {
      console.error('Error parsing ytInitialData:', e.message);
    }
  }

  return videos;
}

async function main() {
  console.log('🎥 Scraping YouTube playlist...');
  console.log(`📺 URL: ${playlistUrl}\n`);

  try {
    const html = await fetchPlaylist(playlistUrl);
    const videos = extractVideos(html);

    if (videos.length === 0) {
      console.log('⚠️  No videos found. The page structure may have changed.');
      console.log('Trying alternative extraction method...\n');

      // Alternative: Extract video IDs from simple regex pattern
      const videoIdMatches = html.matchAll(/"videoId":"([^"]+)"/g);
      const uniqueIds = new Set();

      for (const match of videoIdMatches) {
        uniqueIds.add(match[1]);
      }

      console.log(`Found ${uniqueIds.size} unique video IDs\n`);

      Array.from(uniqueIds).forEach((id, index) => {
        console.log(`${index + 1}. Video ID: ${id}`);
        console.log(`   URL: https://www.youtube.com/watch?v=${id}`);
        console.log(`   Shorts URL: https://www.youtube.com/shorts/${id}`);
        console.log('');
      });

      // Save to file
      const fs = require('fs');
      const output = Array.from(uniqueIds).map(id => ({
        id,
        url: `https://www.youtube.com/watch?v=${id}`,
        shortUrl: `https://www.youtube.com/shorts/${id}`,
      }));

      fs.writeFileSync(
        './playlist-videos.json',
        JSON.stringify(output, null, 2)
      );

      console.log('✅ Saved video URLs to playlist-videos.json');

    } else {
      console.log(`✅ Found ${videos.length} videos:\n`);

      videos.forEach((video, index) => {
        console.log(`${index + 1}. ${video.title}`);
        console.log(`   Duration: ${video.duration}`);
        console.log(`   URL: ${video.url}`);
        console.log(`   Shorts: ${video.shortUrl}`);
        console.log('');
      });

      // Save to file
      const fs = require('fs');
      fs.writeFileSync(
        './playlist-videos.json',
        JSON.stringify(videos, null, 2)
      );

      console.log('✅ Saved video details to playlist-videos.json');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
