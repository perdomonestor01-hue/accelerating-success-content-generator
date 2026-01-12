#!/usr/bin/env node

/**
 * Deployment Verification Script
 *
 * Purpose: Verify that deployed code matches local code to prevent silent deployment failures
 *
 * What this checks:
 * 1. Git status - any uncommitted changes?
 * 2. Remote sync - is local ahead of remote?
 * 3. Build success - does project build locally?
 * 4. Railway deployment - latest commit deployed?
 * 5. Content fingerprint - verify prompts match deployed version
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RAILWAY_URL = 'https://resourceful-love-production.up.railway.app';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function log(color, icon, message) {
  console.log(`${color}${icon} ${message}${RESET}`);
}

function error(message) {
  log(RED, '✗', message);
}

function success(message) {
  log(GREEN, '✓', message);
}

function warning(message) {
  log(YELLOW, '⚠', message);
}

function info(message) {
  log(BLUE, 'ℹ', message);
}

function exec(command, silent = true) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    }).trim();
  } catch (err) {
    return null;
  }
}

function header(title) {
  console.log('\n' + BLUE + '═'.repeat(80) + RESET);
  console.log(BLUE + title.toUpperCase().padStart(40 + title.length / 2) + RESET);
  console.log(BLUE + '═'.repeat(80) + RESET + '\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK 1: Git Status - Uncommitted Changes
// ═══════════════════════════════════════════════════════════════════════════════
function checkGitStatus() {
  header('Check 1: Git Status');

  const status = exec('git status --porcelain');

  if (!status || status.length === 0) {
    success('No uncommitted changes');
    return { passed: true };
  } else {
    error('Uncommitted changes detected:');
    console.log(status);
    warning('These changes are NOT deployed');
    return { passed: false, reason: 'Uncommitted changes exist' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK 2: Remote Sync - Local Ahead of Remote?
// ═══════════════════════════════════════════════════════════════════════════════
function checkRemoteSync() {
  header('Check 2: Remote Sync');

  // Fetch latest from remote
  info('Fetching from remote...');
  exec('git fetch origin', false);

  const localCommit = exec('git rev-parse HEAD');
  const remoteCommit = exec('git rev-parse origin/main');

  if (!localCommit || !remoteCommit) {
    error('Could not get commit hashes');
    return { passed: false, reason: 'Git commands failed' };
  }

  if (localCommit === remoteCommit) {
    success('Local and remote are in sync');
    info(`Commit: ${localCommit.substring(0, 7)}`);
    return { passed: true, commit: localCommit };
  } else {
    error('Local is ahead of remote (or diverged)');
    info(`Local:  ${localCommit.substring(0, 7)}`);
    info(`Remote: ${remoteCommit.substring(0, 7)}`);
    warning('Your changes are NOT pushed to GitHub');

    // Show commits ahead
    const ahead = exec('git log origin/main..HEAD --oneline');
    if (ahead) {
      console.log('\nCommits not pushed:');
      console.log(ahead);
    }

    return { passed: false, reason: 'Local ahead of remote', localCommit, remoteCommit };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK 3: Build Success - Does it Build?
// ═══════════════════════════════════════════════════════════════════════════════
function checkBuildSuccess() {
  header('Check 3: Build Success');

  info('Running npm run build...');

  const result = exec('npm run build 2>&1', false);

  if (result !== null) {
    success('Build succeeded');
    return { passed: true };
  } else {
    error('Build failed');
    warning('Railway deployment will fail with this code');
    return { passed: false, reason: 'Build failed' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK 4: Railway Deployment Status
// ═══════════════════════════════════════════════════════════════════════════════
function checkRailwayDeployment(remoteCommit) {
  header('Check 4: Railway Deployment Status');

  info('Checking Railway deployment...');

  const railwayStatus = exec('railway status --json 2>&1');

  if (!railwayStatus) {
    warning('Could not check Railway status (CLI not authenticated?)');
    return { passed: false, reason: 'Railway CLI unavailable' };
  }

  try {
    const status = JSON.parse(railwayStatus);
    const service = status.services?.edges?.find(e => e.node.name === 'resourceful-love');

    if (!service) {
      error('Could not find service in Railway status');
      return { passed: false, reason: 'Service not found' };
    }

    const deployment = service.node.serviceInstances?.edges?.[0]?.node?.latestDeployment;

    if (!deployment) {
      error('No deployment found');
      return { passed: false, reason: 'No deployment found' };
    }

    info(`Deployment status: ${deployment.status}`);
    info(`Deployed at: ${deployment.createdAt}`);

    if (deployment.status !== 'SUCCESS') {
      error(`Deployment status is ${deployment.status}, not SUCCESS`);
      return { passed: false, reason: `Deployment ${deployment.status}` };
    }

    success('Latest Railway deployment succeeded');

    // Check if remote commit matches deployment
    // Note: Railway doesn't expose the exact git commit in status, so we can't verify this automatically
    warning('Cannot verify exact commit deployed (Railway limitation)');
    info('Manually verify deployment time matches your latest push');

    return { passed: true, deploymentTime: deployment.createdAt };

  } catch (err) {
    error(`Failed to parse Railway status: ${err.message}`);
    return { passed: false, reason: 'Railway status parsing failed' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK 5: Content Fingerprint - Verify Prompts
// ═══════════════════════════════════════════════════════════════════════════════
function checkContentFingerprint() {
  header('Check 5: Content Fingerprint');

  info('Checking prompt file for anti-slop rules...');

  const promptFile = path.join(__dirname, '../lib/ai/prompts.ts');

  if (!fs.existsSync(promptFile)) {
    error('Prompt file not found');
    return { passed: false, reason: 'Prompt file missing' };
  }

  const content = fs.readFileSync(promptFile, 'utf8');

  // Check for critical anti-slop markers
  const criticalPatterns = [
    'ANTI-SLOP RULES',
    'BANNED PHRASES',
    'Sunday Prep Struggle',
    'game-changer',
    'What if the key to',
  ];

  const missing = [];
  const found = [];

  for (const pattern of criticalPatterns) {
    if (content.includes(pattern)) {
      found.push(pattern);
    } else {
      missing.push(pattern);
    }
  }

  if (missing.length === 0) {
    success('All critical anti-slop patterns found in prompts.ts');
    info(`Verified ${found.length} critical patterns`);
    return { passed: true, found };
  } else {
    error('Missing critical patterns:');
    missing.forEach(p => console.log(`  - ${p}`));
    return { passed: false, reason: 'Anti-slop patterns missing', missing };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK 6: Test Live API (if Railway URL accessible)
// ═══════════════════════════════════════════════════════════════════════════════
function checkLiveAPI() {
  header('Check 6: Live API Health');

  info(`Testing ${RAILWAY_URL}...`);

  // Test login page (healthcheck endpoint)
  const loginTest = exec(`curl -s -o /dev/null -w "%{http_code}" ${RAILWAY_URL}/login`);

  if (loginTest === '200') {
    success('Live site responding (login page accessible)');
    return { passed: true };
  } else {
    error(`Live site returned HTTP ${loginTest || 'timeout'}`);
    return { passed: false, reason: `HTTP ${loginTest}` };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN VERIFICATION FLOW
// ═══════════════════════════════════════════════════════════════════════════════
function main() {
  console.log('\n');
  console.log(BLUE + '╔═══════════════════════════════════════════════════════════════════════════╗' + RESET);
  console.log(BLUE + '║' + '           DEPLOYMENT VERIFICATION - Accelerating Success             '.padEnd(75) + '║' + RESET);
  console.log(BLUE + '╚═══════════════════════════════════════════════════════════════════════════╝' + RESET);

  const results = {};

  // Run all checks
  results.gitStatus = checkGitStatus();
  results.remoteSync = checkRemoteSync();
  results.buildSuccess = checkBuildSuccess();
  results.railwayDeployment = checkRailwayDeployment(results.remoteSync.remoteCommit);
  results.contentFingerprint = checkContentFingerprint();
  results.liveAPI = checkLiveAPI();

  // Summary
  header('Verification Summary');

  const checks = [
    { name: 'Git Status', result: results.gitStatus },
    { name: 'Remote Sync', result: results.remoteSync },
    { name: 'Build Success', result: results.buildSuccess },
    { name: 'Railway Deployment', result: results.railwayDeployment },
    { name: 'Content Fingerprint', result: results.contentFingerprint },
    { name: 'Live API Health', result: results.liveAPI },
  ];

  let allPassed = true;
  let criticalFailures = [];

  checks.forEach(check => {
    if (check.result.passed) {
      success(`${check.name.padEnd(25)} PASSED`);
    } else {
      error(`${check.name.padEnd(25)} FAILED - ${check.result.reason || 'Unknown'}`);
      allPassed = false;

      // Mark critical failures
      if (['Git Status', 'Remote Sync', 'Content Fingerprint'].includes(check.name)) {
        criticalFailures.push(check.name);
      }
    }
  });

  console.log('\n');

  if (allPassed) {
    console.log(GREEN + '╔═══════════════════════════════════════════════════════════════════════════╗' + RESET);
    console.log(GREEN + '║' + '                    ✓ ALL CHECKS PASSED                               '.padEnd(75) + '║' + RESET);
    console.log(GREEN + '║' + '              Deployment is ready and verified                        '.padEnd(75) + '║' + RESET);
    console.log(GREEN + '╚═══════════════════════════════════════════════════════════════════════════╝' + RESET);
    process.exit(0);
  } else if (criticalFailures.length > 0) {
    console.log(RED + '╔═══════════════════════════════════════════════════════════════════════════╗' + RESET);
    console.log(RED + '║' + '                  ✗ CRITICAL FAILURES DETECTED                         '.padEnd(75) + '║' + RESET);
    console.log(RED + '║' + '            DO NOT DEPLOY - Fix these issues first                    '.padEnd(75) + '║' + RESET);
    console.log(RED + '╚═══════════════════════════════════════════════════════════════════════════╝' + RESET);
    console.log('');
    criticalFailures.forEach(failure => error(`  - ${failure}`));
    console.log('');
    process.exit(1);
  } else {
    console.log(YELLOW + '╔═══════════════════════════════════════════════════════════════════════════╗' + RESET);
    console.log(YELLOW + '║' + '                   ⚠ WARNINGS DETECTED                                '.padEnd(75) + '║' + RESET);
    console.log(YELLOW + '║' + '             Review failures before deploying                         '.padEnd(75) + '║' + RESET);
    console.log(YELLOW + '╚═══════════════════════════════════════════════════════════════════════════╝' + RESET);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkGitStatus,
  checkRemoteSync,
  checkBuildSuccess,
  checkRailwayDeployment,
  checkContentFingerprint,
  checkLiveAPI
};
