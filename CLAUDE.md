# Accelerating Success Content Generator

Social media content generator for Texas teachers - bilingual Science resources.

## Project Type
- AI-powered content generation (Claude, Groq APIs)
- Multi-platform posting (LinkedIn, Reddit, Facebook, Twitter, Blogger, Tumblr)
- Bilingual support (English/Spanish)

## AI Integration - CRITICAL
This project uses AI APIs. Apply anti-hallucination rules:

### URL Whitelist (ONLY these URLs allowed in generated content)
```
https://accelerating-success.com/subscriptions/
https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/
https://accelerating-success.com/free-8th-grade-conservation-of-mass-periodic-table-online-modules-canva-slide/
```

### Banned Phrases (NEVER use in generated content)
- "Sunday Prep Struggle"
- "game-changer" / "Game changer"
- "I've been there"
- "But what if I told you"
- "email list" / "newsletter" / "mailing list"

### Validation Library
Use: `/Users/fabienp/agents/ai-safety-lib/ai-validator.ts`

## Key Files
| File | Purpose |
|------|---------|
| `lib/ai/claude.ts` | Claude API integration |
| `lib/ai/groq.ts` | Groq API integration |
| `lib/ai/prompts.ts` | Content generation prompts |
| `lib/ai/types.ts` | TypeScript interfaces |
| `app/api/generate/route.ts` | Generation API endpoint |
| `app/api/cron/route.ts` | Scheduled posting |

## Deployment
- **Platform:** Railway
- **Command:** `/deploy-complete accelerating-success`
- **Database:** SQLite (prisma/dev.db)

## Testing
Before deploying AI changes:
1. Test with `/ai-integration accelerating-success`
2. Verify JSON extraction works
3. Verify only whitelisted URLs appear
4. Verify no banned phrases in output
