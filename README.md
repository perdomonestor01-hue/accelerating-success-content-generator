# Accelerating Success - AI Content Generator

Automated social media content generation for Accelerating Success educational platform.

## 🚀 What's Built So Far

### ✅ Core Infrastructure (Complete)
- **Next.js 14** with TypeScript and TailwindCSS
- **Prisma ORM** with PostgreSQL database schema
- **AI Provider Layer** supporting Claude, Groq, and DeepSeek with automatic fallback
- **API Endpoints** for content generation and management

### 📊 Database Schema
- **Content Library** - Stores all generated social media posts
- **Testimonials** - 3 YouTube Shorts videos
- **Schedule Config** - Daily auto-generation settings

### 🤖 AI Integration
The system intelligently uses available AI providers:
1. **Primary**: Claude (Anthropic) - Best for educational content
2. **Fallback**: Groq - Fast generation
3. **Fallback**: DeepSeek - Cost-effective

### 🔌 API Endpoints

#### POST /api/generate
Generate content manually:
```json
{
  "topic": "EARTH_SCIENCE",
  "concept": "weather & water cycle",
  "gradeLevel": "4th-5th",
  "contentAngle": "TIME_SAVER"
}
```

#### GET /api/cron
Auto-generate daily content (called by Railway cron job)

#### GET /api/content
List all generated content with filters:
- `?status=DRAFT` - Filter by status
- `?topic=EARTH_SCIENCE` - Filter by topic
- `?limit=50` - Limit results

#### PATCH /api/content
Update content (approve, schedule, edit):
```json
{
  "id": "content-id",
  "status": "APPROVED",
  "scheduledFor": "2025-11-04T10:00:00Z"
}
```

## 🛠️ Setup Instructions

### 1. Railway Database Setup

1. Go to your Railway dashboard
2. Create a new PostgreSQL database (or use existing)
3. Copy the `DATABASE_URL` from Railway

### 2. Environment Variables

Update `.env` with your credentials:

```bash
# Railway PostgreSQL URL
DATABASE_URL="postgresql://user:password@host:port/database"

# Add at least ONE AI API key
ANTHROPIC_API_KEY="sk-ant-..."  # Recommended
GROQ_API_KEY="gsk_..."
DEEPSEEK_API_KEY="sk-..."

# Choose your primary AI provider
DEFAULT_AI_PROVIDER="claude"  # or "groq" or "deepseek"
```

### 3. Initialize Database

```bash
# Push the schema to Railway PostgreSQL
npm run db:push

# Seed with testimonial videos
npm run db:seed
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
accelerating-success-content-generator/
├── app/
│   ├── api/
│   │   ├── generate/route.ts      # Manual content generation
│   │   ├── content/route.ts       # Content CRUD operations
│   │   └── cron/route.ts          # Daily auto-generation
│   ├── page.tsx                   # Homepage (UI coming next)
│   └── layout.tsx                 # Root layout
├── lib/
│   ├── db.ts                      # Prisma client
│   └── ai/
│       ├── claude.ts              # Claude AI provider
│       ├── groq.ts                # Groq AI provider
│       ├── deepseek.ts            # DeepSeek AI provider
│       ├── provider.ts            # AI provider manager
│       ├── prompts.ts             # Prompt templates
│       └── types.ts               # TypeScript types
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed testimonials
└── package.json
```

## 🎯 Features Implemented

### Content Generation
- ✅ AI-powered content creation for 4 platforms (LinkedIn, Reddit, Facebook, Twitter)
- ✅ Embedded links (no raw URLs)
- ✅ Testimonial video rotation
- ✅ Topic and angle customization
- ✅ Automatic fallback between AI providers

### Database
- ✅ Content library with full metadata
- ✅ Testimonial video tracking
- ✅ Schedule configuration
- ✅ Content recycling support (schema ready)

### API
- ✅ Manual generation endpoint
- ✅ Daily cron endpoint
- ✅ Content list/update/delete operations

## 🚧 Coming Next

### UI Components (In Progress)
- Content generator form
- Multi-platform preview
- Approval dashboard
- Content library with search
- Calendar scheduling view

### Features (Planned)
- Content recycling with AI variations
- Railway cron job configuration
- Performance analytics
- Bulk operations

## 🧪 Testing the API

### Test Content Generation

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "EARTH_SCIENCE",
    "concept": "weather & water cycle",
    "gradeLevel": "4th-5th",
    "contentAngle": "TIME_SAVER"
  }'
```

### Test Cron Job

```bash
curl http://localhost:3000/api/cron
```

### List Generated Content

```bash
curl http://localhost:3000/api/content
```

## 📝 Notes

- **Database**: Must be connected to Railway PostgreSQL before running
- **AI Keys**: At least one AI provider key is required
- **Testimonials**: Seed script includes your 3 YouTube Shorts
- **Cron Job**: Will be configured in Railway dashboard later

## 🎨 Content Example

When you call `/api/generate`, it creates posts like:

**Idea**: "The Sunday Prep Struggle"
- **LinkedIn**: Professional tone, embedded links, testimonial video
- **Reddit**: Conversational, community-focused, asking for input
- **Facebook**: Friendly, shareable, tag-a-friend style
- **Twitter**: Concise, punchy, under 280 characters

All with:
- ✅ Embedded subscription links
- ✅ Testimonial video
- ✅ Platform-appropriate hashtags
- ✅ 7-day trial CTA

---

**Status**: Backend complete ✅ | UI in progress 🚧 | Ready for Railway deployment 🚀
