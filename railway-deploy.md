# Railway Deployment Guide for Accelerating Success

## 🚀 Quick Deploy to Railway

### Step 1: Create New Railway Project

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Or click **"Empty Project"** to create manually

### Step 2: If Using GitHub (Recommended)

1. Push this code to GitHub first:
```bash
# Create new repo on GitHub at: https://github.com/new
# Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/accelerating-success.git
git push -u origin main
```

2. In Railway, select your GitHub repo
3. Railway will auto-detect Next.js and configure build settings

### Step 3: If Using Railway CLI (Alternative)

Run these commands in your terminal (they need interactive input):

```bash
# Initialize Railway project
railway init

# Link to project
railway link

# Deploy
railway up
```

### Step 4: Add PostgreSQL Database

1. In your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create `DATABASE_URL` variable

### Step 5: Set Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```bash
# AI Provider APIs (get these from your .env file)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
GROQ_API_KEY=your-groq-api-key-here
DEEPSEEK_API_KEY=your-deepseek-api-key-here

# AI Provider Selection
DEFAULT_AI_PROVIDER=claude

# NextAuth (IMPORTANT: Generate new secret for production)
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXTAUTH_SECRET=YOUR_PRODUCTION_SECRET_HERE_CHANGE_THIS

# Brand Info
SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/
BRAND_NAME=Accelerating Success
BRAND_HANDLE=@AccSuccess

# Testimonial Videos
TESTIMONIAL_VIDEO_1=https://youtube.com/shorts/FC_5CXTUl9o?si=QV-bYUf9TAuACg-j
TESTIMONIAL_VIDEO_2=https://youtube.com/shorts/fcXj7ms7oqQ?si=RzMZDMs2x5ZykB4y
TESTIMONIAL_VIDEO_3=https://youtube.com/shorts/3wWcl8OHDXs?si=QpmmQTqC3g77AlYH

# DATABASE_URL will be auto-created when you add PostgreSQL
```

**IMPORTANT**: Generate a new `NEXTAUTH_SECRET` for production:
```bash
# Run this command to generate a secure secret:
openssl rand -base64 32
```

### Step 6: Initial Database Setup

After deployment, run these commands to set up the database:

1. In Railway dashboard, click on your service
2. Go to **"Settings"** → **"Deploy"**
3. Add these to the build command or run manually via Railway's terminal:

```bash
# Push database schema
npx prisma db push

# Seed testimonials
npx prisma db seed
```

### Step 7: Create Admin User

You'll need to create an admin user to access the platform.

Create a file `create-admin.ts` and run it once:

```typescript
// Save this command to run after deployment
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('YOUR_PASSWORD_HERE', 10);

  await prisma.user.create({
    data: {
      email: 'perdomonestor01@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created!');
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Step 8: Deploy!

Railway will automatically deploy when you:
- Push to GitHub (if connected)
- Or run `railway up` (if using CLI)

### Step 9: Access Your App

1. Find your URL in Railway dashboard (something like `https://yourapp.up.railway.app`)
2. Go to the URL
3. Login with the admin credentials you created

## 📋 Deployment Checklist

- [ ] Create Railway project
- [ ] Add PostgreSQL database
- [ ] Set all environment variables
- [ ] Generate and set NEXTAUTH_SECRET
- [ ] Deploy code
- [ ] Run `prisma db push`
- [ ] Run `prisma db seed`
- [ ] Create admin user
- [ ] Test login
- [ ] Test content generation

## 🔧 Common Issues

### Issue: Build fails with Prisma errors
**Solution**: Make sure DATABASE_URL is set before building

### Issue: Can't login
**Solution**: Make sure you've created an admin user and NEXTAUTH_SECRET is set

### Issue: Content generation fails
**Solution**: Check that AI API keys are correctly set in Railway variables

## 🎯 Post-Deployment

After successful deployment:
1. Login to your app
2. Generate test content
3. Test all share buttons
4. Set up cron job (optional) in Railway for daily content generation

---

**Your app is committed and ready to deploy!** 🚀
