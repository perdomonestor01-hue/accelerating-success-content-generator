#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# PRE-DEPLOYMENT CHECKLIST
# Accelerating Success Content Generator
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script MUST pass before deploying to Railway
# Run: bash scripts/pre-deploy-checklist.sh
#
# What it checks:
# 1. All changes are committed
# 2. All commits are pushed to GitHub
# 3. Build succeeds locally
# 4. Anti-slop rules are present in prompts
# 5. No secrets exposed in code
# 6. User preferences are committed
#
# Exit codes:
# 0 = All checks passed, safe to deploy
# 1 = Critical failure, DO NOT DEPLOY
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
print_header() {
  echo ""
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_check() {
  echo -e "${BLUE}[CHECK]${NC} $1"
}

pass() {
  echo -e "${GREEN}✓ PASS:${NC} $1"
  ((PASSED++))
}

fail() {
  echo -e "${RED}✗ FAIL:${NC} $1"
  ((FAILED++))
}

warn() {
  echo -e "${YELLOW}⚠ WARN:${NC} $1"
  ((WARNINGS++))
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 1: Git Status - Uncommitted Changes
# ═══════════════════════════════════════════════════════════════════════════════
check_git_status() {
  print_check "1. Checking for uncommitted changes..."

  if [[ -z $(git status --porcelain) ]]; then
    pass "No uncommitted changes"
  else
    fail "Uncommitted changes detected:"
    git status --short
    echo ""
    echo "Run: git add . && git commit -m 'your message'"
    return 1
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 2: Remote Sync - Pushed to GitHub
# ═══════════════════════════════════════════════════════════════════════════════
check_remote_sync() {
  print_check "2. Checking if changes are pushed to GitHub..."

  git fetch origin >/dev/null 2>&1

  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse origin/main)

  if [[ "$LOCAL" == "$REMOTE" ]]; then
    pass "Local and remote are in sync (commit: ${LOCAL:0:7})"
  else
    fail "Local is ahead of remote"
    echo "   Local:  ${LOCAL:0:7}"
    echo "   Remote: ${REMOTE:0:7}"
    echo ""
    echo "Commits not pushed:"
    git log origin/main..HEAD --oneline
    echo ""
    echo "Run: git push origin main"
    return 1
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 3: Build Success
# ═══════════════════════════════════════════════════════════════════════════════
check_build() {
  print_check "3. Running production build..."

  if npm run build >/dev/null 2>&1; then
    pass "Build succeeded"
  else
    fail "Build failed - Railway deployment will fail"
    echo ""
    echo "Run: npm run build"
    echo "Fix all build errors before deploying"
    return 1
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 4: Anti-Slop Rules Present
# ═══════════════════════════════════════════════════════════════════════════════
check_anti_slop() {
  print_check "4. Verifying anti-slop rules in prompts..."

  PROMPTS_FILE="lib/ai/prompts.ts"

  if [[ ! -f "$PROMPTS_FILE" ]]; then
    fail "Prompts file not found: $PROMPTS_FILE"
    return 1
  fi

  # Check for critical patterns
  MISSING=()

  if ! grep -q "ANTI-SLOP RULES" "$PROMPTS_FILE"; then
    MISSING+=("ANTI-SLOP RULES section")
  fi

  if ! grep -q "BANNED_PHRASES" "$PROMPTS_FILE"; then
    MISSING+=("BANNED_PHRASES array")
  fi

  if ! grep -q "Sunday Prep Struggle" "$PROMPTS_FILE"; then
    MISSING+=("'Sunday Prep Struggle' banned phrase")
  fi

  if ! grep -q "game-changer" "$PROMPTS_FILE"; then
    MISSING+=("'game-changer' banned phrase")
  fi

  if ! grep -q "What if the key to" "$PROMPTS_FILE"; then
    MISSING+=("'What if the key to' banned pattern")
  fi

  if [[ ${#MISSING[@]} -eq 0 ]]; then
    pass "Anti-slop rules verified (5 critical patterns found)"
  else
    fail "Missing anti-slop patterns:"
    for pattern in "${MISSING[@]}"; do
      echo "   - $pattern"
    done
    return 1
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 5: Secrets Scan
# ═══════════════════════════════════════════════════════════════════════════════
check_secrets() {
  print_check "5. Scanning for exposed secrets..."

  # Check if security scanner exists
  SCANNER="$HOME/agents/security-lib/scan_secrets.py"

  if [[ ! -f "$SCANNER" ]]; then
    warn "Secret scanner not found - skipping"
    return 0
  fi

  # Run scanner
  if python3 "$SCANNER" . >/dev/null 2>&1; then
    pass "No exposed secrets detected"
  else
    fail "Secrets detected in code!"
    python3 "$SCANNER" .
    echo ""
    echo "CRITICAL: Remove all secrets before deploying"
    return 1
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 6: User Preferences Committed
# ═══════════════════════════════════════════════════════════════════════════════
check_preferences() {
  print_check "6. Checking user preferences are committed..."

  PREFS_DIR=".user-preferences"

  if [[ ! -d "$PREFS_DIR" ]]; then
    warn "User preferences directory not found - skipping"
    return 0
  fi

  # Check if preference files are committed
  if git ls-files "$PREFS_DIR" | grep -q .; then
    pass "User preferences are committed"
  else
    fail "User preferences exist but are NOT committed"
    echo "   Directory: $PREFS_DIR"
    echo ""
    echo "Run: git add $PREFS_DIR && git commit -m 'Save user preferences'"
    return 1
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 7: Environment Variables Documented
# ═══════════════════════════════════════════════════════════════════════════════
check_env_docs() {
  print_check "7. Checking environment variables are documented..."

  if [[ ! -f ".env.example" ]]; then
    warn ".env.example not found - consider creating it"
    return 0
  fi

  # Count variables in .env.example
  ENV_COUNT=$(grep -c "=" .env.example || true)

  if [[ $ENV_COUNT -gt 0 ]]; then
    pass "Environment variables documented ($ENV_COUNT variables)"
  else
    warn ".env.example is empty"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# RUN ALL CHECKS
# ═══════════════════════════════════════════════════════════════════════════════

print_header "PRE-DEPLOYMENT CHECKLIST - Accelerating Success"

echo "Running 7 safety checks before deployment..."
echo ""

# Run checks (continue even if some fail to see all results)
check_git_status || true
echo ""
check_remote_sync || true
echo ""
check_build || true
echo ""
check_anti_slop || true
echo ""
check_secrets || true
echo ""
check_preferences || true
echo ""
check_env_docs || true
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════════════════

print_header "SUMMARY"

echo -e "Passed:   ${GREEN}$PASSED${NC}"
echo -e "Failed:   ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [[ $FAILED -eq 0 ]]; then
  echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                    ✓ ALL CHECKS PASSED                                   ║${NC}"
  echo -e "${GREEN}║                 Safe to deploy to Railway                                ║${NC}"
  echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Run: git push origin main (if not already pushed)"
  echo "2. Railway will auto-deploy from GitHub"
  echo "3. Monitor: railway logs"
  echo "4. Verify: bash scripts/verify-deployment.js"
  echo ""
  exit 0
else
  echo -e "${RED}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║                  ✗ DEPLOYMENT BLOCKED                                    ║${NC}"
  echo -e "${RED}║              Fix $FAILED critical issue(s) first                               ║${NC}"
  echo -e "${RED}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "DO NOT DEPLOY until all checks pass."
  echo "Re-run: bash scripts/pre-deploy-checklist.sh"
  echo ""
  exit 1
fi
