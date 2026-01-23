# accelerating-success-content-generator - Local Project Instructions

This file extends the global CLAUDE.md with project-specific instructions.

## Global Resources (Reference)

These resources are available from the global configuration:

| Resource | Location |
|----------|----------|
| Agents | `~/.claude/agents/` |
| SOPs | `~/.claude/knowledge/project-sops.md` |
| Lessons Learned | `~/.claude/knowledge/lessons-learned.md` |
| Security Scanner | `~/agents/security-lib/scan_secrets.py` |
| Security Hooks | `~/agents/hooks/` |

## Quick Commands

```bash
# Scan for secrets before committing
python3 ~/agents/security-lib/scan_secrets.py .

# Verify security hooks are installed
ls -la .git/hooks/pre-commit .git/hooks/pre-push

# Run health check
bash ~/agents/scripts/health-check.sh
```

## Project-Specific Instructions

<!-- Add project-specific instructions below -->

