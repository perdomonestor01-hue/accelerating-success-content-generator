# Deployment Guide - Accelerating Success Content Generator

## The Problem This Solves

**SYMPTOM:** You fix the AI prompts locally. Everything looks perfect. You think it's deployed. But the live site still generates flat, generic content.

**ROOT CAUSE:** Silent deployment failures. The cycle looked like:
1. Fix prompts ✅
2. Test locally ✅
3. Assume it's deployed ✅
4. Live site still uses old prompts ❌
5. Repeat forever ❌

**SOLUTION:** This guide ensures **every** code change makes it to production, **verified**.

---

## The Foolproof 5-Step Deployment Process

### Step 1: Make Your Changes

Edit code as normal:
```bash
# Example: Fix AI prompts
vim lib/ai/prompts.ts

# Test locally
npm run dev
```

### Step 2: Run Pre-Deployment Checklist

**MANDATORY** - This catches 99% of deployment failures:

```bash
bash scripts/pre-deploy-checklist.sh
```

This script checks:
- ✅ All changes committed to git
- ✅ All commits pushed to GitHub
- ✅ Build succeeds locally
- ✅ Anti-slop rules are present
- ✅ No secrets exposed
- ✅ User preferences committed

**If ANY check fails, STOP. Fix it before proceeding.**

Example output:
```
═══════════════════════════════════════════════════════════════════════════════
PRE-DEPLOYMENT CHECKLIST - Accelerating Success
═══════════════════════════════════════════════════════════════════════════════

[CHECK] 1. Checking for uncommitted changes...
✓ PASS: No uncommitted changes

[CHECK] 2. Checking if changes are pushed to GitHub...
✓ PASS: Local and remote are in sync (commit: 82891d3)

[CHECK] 3. Running production build...
✓ PASS: Build succeeded

[CHECK] 4. Verifying anti-slop rules in prompts...
✓ PASS: Anti-slop rules verified (5 critical patterns found)

[CHECK] 5. Scanning for exposed secrets...
✓ PASS: No exposed secrets detected

[CHECK] 6. Checking user preferences are committed...
✓ PASS: User preferences are committed

[CHECK] 7. Checking environment variables are documented...
✓ PASS: Environment variables documented (12 variables)

═══════════════════════════════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════════════════════════════
Passed:   7
Failed:   0
Warnings: 0

╔═══════════════════════════════════════════════════════════════════════════╗
║                    ✓ ALL CHECKS PASSED                                   ║
║                 Safe to deploy to Railway                                ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Step 3: Deploy to Railway

Railway auto-deploys when you push to GitHub:

```bash
# If pre-checklist passed, this triggers deployment
git push origin main
```

Monitor the deployment:
```bash
railway logs --tail
```

Wait for:
- ✅ "Build succeeded"
- ✅ "Deployment live"
- ✅ No error logs

**Average deployment time: 3-5 minutes**

### Step 4: Verify Deployment

**CRITICAL** - Don't assume it worked. Verify:

```bash
node scripts/verify-deployment.js
```

This script verifies:
- ✅ Git status clean
- ✅ Remote sync matches local
- ✅ Build succeeds
- ✅ Railway deployment status SUCCESS
- ✅ Content fingerprint matches (prompts are live)
- ✅ Live API responds

Example output:
```
═══════════════════════════════════════════════════════════════════════════════
Check 1: Git Status
═══════════════════════════════════════════════════════════════════════════════
✓ No uncommitted changes

═══════════════════════════════════════════════════════════════════════════════
Check 2: Remote Sync
═══════════════════════════════════════════════════════════════════════════════
✓ Local and remote are in sync
ℹ Commit: 82891d3

═══════════════════════════════════════════════════════════════════════════════
Check 5: Content Fingerprint
═══════════════════════════════════════════════════════════════════════════════
✓ All critical anti-slop patterns found in prompts.ts
ℹ Verified 5 critical patterns

═══════════════════════════════════════════════════════════════════════════════
Verification Summary
═══════════════════════════════════════════════════════════════════════════════
✓ Git Status                  PASSED
✓ Remote Sync                 PASSED
✓ Build Success               PASSED
✓ Railway Deployment          PASSED
✓ Content Fingerprint         PASSED
✓ Live API Health             PASSED

╔═══════════════════════════════════════════════════════════════════════════╗
║                    ✓ ALL CHECKS PASSED                                   ║
║              Deployment is ready and verified                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Step 5: Test Live Content

Generate content and verify it's NOT generic:

```bash
# Visit the live site
open https://resourceful-love-production.up.railway.app

# Login and generate content
# Check for:
# ❌ No "Sunday Prep Struggle"
# ❌ No "game-changer"
# ❌ No "What if the key to..."
# ✅ Specific details (names, times, numbers)
# ✅ Natural storytelling
# ✅ Authentic voice
```

---

## Common Failure Modes & Fixes

### 1. "Changes not committed"

**Symptom:** Pre-checklist fails with uncommitted changes

**Fix:**
```bash
git status
git add .
git commit -m "Fix: describe your changes"
```

### 2. "Local ahead of remote"

**Symptom:** Pre-checklist shows local commits not pushed

**Fix:**
```bash
git push origin main
```

**Why this matters:** Railway deploys from GitHub, not your local machine. If you don't push, Railway deploys the OLD code.

### 3. "Build failed"

**Symptom:** Build errors during deployment

**Fix:**
```bash
npm run build
# Fix all errors
# Re-run pre-checklist
```

### 4. "Anti-slop rules missing"

**Symptom:** Verification can't find banned phrases

**Fix:**
- Check `lib/ai/prompts.ts` has `BANNED_PHRASES` array
- Ensure "Sunday Prep Struggle", "game-changer", etc. are listed
- Commit changes

### 5. "Railway deployment pending/failed"

**Symptom:** Railway logs show errors

**Fix:**
```bash
railway logs --tail

# Common issues:
# - Database connection error → Check DATABASE_URL in Railway env vars
# - Build timeout → Check build command in railway.json
# - Port binding error → Check PORT env var exists
```

### 6. "Content fingerprint mismatch"

**Symptom:** Verification says prompts don't match deployed version

**What this means:** You edited prompts locally but either:
- Didn't commit
- Didn't push
- Railway hasn't finished deploying

**Fix:**
1. Check commit status: `git status`
2. Check push status: `git log origin/main..HEAD`
3. Wait for Railway deployment to complete
4. Re-run verification

---

## Emergency: Content is Still Flat After Deployment

If you followed all steps but content is still generic:

### Debug Checklist

1. **Verify Railway is using correct branch:**
   ```bash
   railway status --json | jq '.services.edges[0].node.serviceInstances.edges[0].node.source'
   ```
   Should show your GitHub repo and main branch.

2. **Check Railway environment variables:**
   ```bash
   railway variables
   ```
   Verify all required vars are set (especially AI API keys).

3. **Check Railway build logs:**
   ```bash
   railway logs --deployment
   ```
   Look for build errors or warnings.

4. **Force rebuild:**
   ```bash
   railway up --detach
   ```
   This forces Railway to rebuild and redeploy.

5. **Clear Railway cache:**
   - Go to Railway dashboard
   - Click project → Settings → Danger Zone
   - Click "Clear Build Cache"
   - Redeploy

6. **Verify prompts file in deployment:**
   ```bash
   railway run cat lib/ai/prompts.ts | grep "ANTI-SLOP"
   ```
   This shows if the deployed code actually has your changes.

### Nuclear Option: Complete Redeploy

If nothing works:

```bash
# 1. Create fresh commit
git add .
git commit -m "Force redeploy: $(date)"

# 2. Push with force (only if necessary)
git push origin main --force

# 3. Trigger Railway rebuild
railway up --detach

# 4. Watch logs closely
railway logs --tail

# 5. Verify EVERYTHING
node scripts/verify-deployment.js
```

---

## Maintenance & Prevention

### Weekly

- Run health check:
  ```bash
  node scripts/verify-deployment.js
  ```

- Check generated content manually for quality

### After Every Prompt Change

1. Run pre-deployment checklist
2. Deploy
3. Verify deployment
4. Test live content
5. **NEVER skip verification**

### Automated Monitoring (Future Enhancement)

Consider adding:
- Cron job to run verification daily
- Slack/email alerts on verification failure
- Content quality scoring in generated posts
- Automatic rollback on quality degradation

---

## The Golden Rules

1. **ALWAYS run pre-deployment checklist** - No exceptions
2. **NEVER assume deployment worked** - Always verify
3. **GIT PUSH IS NOT OPTIONAL** - Railway needs GitHub
4. **TEST LIVE CONTENT** - Verification ≠ quality check
5. **COMMIT USER PREFERENCES** - Or they'll disappear

---

## Quick Reference

### Before Deployment
```bash
bash scripts/pre-deploy-checklist.sh
```

### Deploy
```bash
git push origin main
railway logs --tail
```

### After Deployment
```bash
node scripts/verify-deployment.js
```

### Emergency Debug
```bash
railway logs --tail
railway status --json
railway variables
```

---

## Technical Details

### How Railway Deploys

1. You push to GitHub
2. Railway webhook detects push
3. Railway clones repo
4. Runs `npm run build` (from railway.json)
5. Runs `npm start` (from railway.json)
6. Deployment goes live

**Key insight:** Railway builds from GitHub, NOT your local machine. If code isn't pushed, it won't deploy.

### Content Fingerprinting

Every generated content includes a fingerprint:

```json
{
  "ideaTitle": "...",
  "linkedinPost": "...",
  "_fingerprint": {
    "version": "82891d3",
    "hash": "a1b2c3d4e5f6",
    "timestamp": "2026-01-12T10:30:00Z",
    "bannedPhrasesCount": 45,
    "antiSlopEnabled": true
  }
}
```

This allows verification scripts to confirm:
- Which git commit generated the content
- Whether anti-slop rules were active
- How many banned phrases were enforced

### Why Deployments Failed Before

**Past failure pattern:**
1. Edit `prompts.ts` locally ✅
2. Test with `npm run dev` ✅
3. See good results ✅
4. Think "it's deployed" ❌
5. Railway still using old code ❌

**What was missing:**
- No git commit
- No git push
- No verification step
- No way to tell if deployment actually worked

**This guide fixes all of that.**

---

## Success Metrics

You'll know this system works when:

- ✅ Zero "I thought I deployed that" moments
- ✅ Every prompt change reaches production
- ✅ Flat content disappears permanently
- ✅ Content quality stays high over time
- ✅ Deployments are boring (because they work)

---

## Support & Troubleshooting

If you hit issues not covered here:

1. Check Railway logs: `railway logs --tail`
2. Re-run verification: `node scripts/verify-deployment.js`
3. Check git status: `git status && git log origin/main..HEAD`
4. Review this guide for missed steps

Remember: **The scripts exist to prevent human error. Use them.**
