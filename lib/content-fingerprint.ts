/**
 * Content Fingerprinting System
 *
 * Purpose: Track which version of prompts generated each piece of content
 * Why: Allows us to verify if deployed code is actually being used
 *
 * How it works:
 * 1. Generate fingerprint from prompts.ts file content
 * 2. Attach fingerprint to each generated content
 * 3. Store in database with content
 * 4. Query to see which prompt version is live
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface ContentFingerprint {
  version: string;           // e.g., "v1.2.3" or commit hash
  hash: string;              // SHA-256 hash of prompt file
  timestamp: string;         // ISO timestamp
  bannedPhrasesCount: number; // Number of banned phrases
  antiSlopEnabled: boolean;  // Whether anti-slop rules exist
}

/**
 * Generate fingerprint from prompts.ts file
 */
export function generatePromptFingerprint(): ContentFingerprint {
  const promptsPath = path.join(process.cwd(), 'lib/ai/prompts.ts');

  if (!fs.existsSync(promptsPath)) {
    throw new Error('prompts.ts file not found');
  }

  const content = fs.readFileSync(promptsPath, 'utf8');

  // Generate hash from file content
  const hash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);

  // Extract version info
  const bannedPhrasesMatch = content.match(/const BANNED_PHRASES = \[([\s\S]*?)\];/);
  const bannedPhrasesCount = bannedPhrasesMatch
    ? (bannedPhrasesMatch[1].match(/'/g) || []).length / 2 // Count string literals
    : 0;

  const antiSlopEnabled = content.includes('ANTI-SLOP RULES');

  // Get git commit hash if available
  let version = 'unknown';
  try {
    const { execSync } = require('child_process');
    version = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    version = hash.substring(0, 7); // Fallback to content hash
  }

  return {
    version,
    hash,
    timestamp: new Date().toISOString(),
    bannedPhrasesCount,
    antiSlopEnabled
  };
}

/**
 * Verify a fingerprint matches current prompts
 */
export function verifyFingerprint(fingerprint: ContentFingerprint): {
  matches: boolean;
  currentVersion: string;
  reason?: string;
} {
  try {
    const current = generatePromptFingerprint();

    if (current.hash === fingerprint.hash) {
      return { matches: true, currentVersion: current.version };
    }

    // Hashes don't match - figure out why
    if (current.bannedPhrasesCount !== fingerprint.bannedPhrasesCount) {
      return {
        matches: false,
        currentVersion: current.version,
        reason: `Banned phrases changed (was ${fingerprint.bannedPhrasesCount}, now ${current.bannedPhrasesCount})`
      };
    }

    if (current.antiSlopEnabled !== fingerprint.antiSlopEnabled) {
      return {
        matches: false,
        currentVersion: current.version,
        reason: `Anti-slop status changed`
      };
    }

    return {
      matches: false,
      currentVersion: current.version,
      reason: 'Prompt content changed'
    };

  } catch (err) {
    return {
      matches: false,
      currentVersion: 'error',
      reason: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

/**
 * Get human-readable fingerprint summary
 */
export function fingerprintSummary(fingerprint: ContentFingerprint): string {
  return [
    `Version: ${fingerprint.version}`,
    `Hash: ${fingerprint.hash}`,
    `Generated: ${new Date(fingerprint.timestamp).toLocaleString()}`,
    `Banned Phrases: ${fingerprint.bannedPhrasesCount}`,
    `Anti-Slop: ${fingerprint.antiSlopEnabled ? 'ENABLED' : 'DISABLED'}`
  ].join('\n');
}

/**
 * Add fingerprint to content metadata
 */
export function attachFingerprintToContent<T extends Record<string, any>>(
  content: T
): T & { _fingerprint: ContentFingerprint } {
  return {
    ...content,
    _fingerprint: generatePromptFingerprint()
  };
}

/**
 * Check if content was generated with current prompts
 */
export function isContentFresh(content: { _fingerprint?: ContentFingerprint }): {
  fresh: boolean;
  reason?: string;
  age?: string;
} {
  if (!content._fingerprint) {
    return {
      fresh: false,
      reason: 'No fingerprint found - content generated before fingerprinting was enabled'
    };
  }

  const verification = verifyFingerprint(content._fingerprint);

  if (!verification.matches) {
    const contentAge = new Date().getTime() - new Date(content._fingerprint.timestamp).getTime();
    const ageHours = Math.floor(contentAge / (1000 * 60 * 60));
    const ageDays = Math.floor(ageHours / 24);

    return {
      fresh: false,
      reason: verification.reason,
      age: ageDays > 0 ? `${ageDays} days old` : `${ageHours} hours old`
    };
  }

  return { fresh: true };
}

/**
 * Middleware to add fingerprint to API responses
 */
export function fingerprintMiddleware(response: any) {
  return attachFingerprintToContent(response);
}
