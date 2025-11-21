# 🚀 SIMPLE DEPLOYMENT - Choose Your Method

Your code is ready on GitHub: https://github.com/perdomonestor01-hue/accelerating-success-content-generator

## ⚡ EASIEST: Deploy to Vercel (5 minutes)

Vercel is easier than Railway and works great with Next.js.

### **Step 1: Go to Vercel**
1. Open: https://vercel.com/new
2. Login with GitHub (use perdomonestor01@gmail.com)

### **Step 2: Import Your Repository**
1. Click **"Import Git Repository"**
2. Find and select: `perdomonestor01-hue/accelerating-success-content-generator`
3. Click **"Import"**

### **Step 3: Add PostgreSQL**
1. After import, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Click **"Continue"**
5. Vercel creates `DATABASE_URL` automatically ✅

### **Step 4: Add Environment Variables**
Click **"Environment Variables"** and add:

```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
GROQ_API_KEY=your-groq-api-key-here
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEFAULT_AI_PROVIDER=claude
NEXTAUTH_SECRET=generate-secure-random-string-here
SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/
BRAND_NAME=Accelerating Success
BRAND_HANDLE=@AccSuccess
TESTIMONIAL_VIDEO_1=https://youtube.com/shorts/FC_5CXTUl9o?si=QV-bYUf9TAuACg-j
TESTIMONIAL_VIDEO_2=https://youtube.com/shorts/fcXj7ms7oqQ?si=RzMZDMs2x5ZykB4y
TESTIMONIAL_VIDEO_3=https://youtube.com/shorts/3wWcl8OHDXs?si=QpmmQTqC3g77AlYH
```

**Note:** Get your actual API keys from your .env file locally when deploying.

**Note:** NEXTAUTH_URL is automatically set by Vercel ✅

### **Step 5: Deploy**
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is LIVE! 🎉

### **Step 6: Get Your URL**
Vercel gives you a URL like: `https://accelerating-success-content-generator.vercel.app`

---

## 🚂 ALTERNATIVE: Railway via CLI (Manual)

If you prefer Railway, follow these manual steps:

### **Step 1: Open Terminal and Run:**

```bash
cd /Users/fabienp/accelerating-success-content-generator

# Login to Railway (opens browser)
railway login

# Create new project
railway init

# Add PostgreSQL
railway add --database postgres

# Deploy
railway up
```

### **Step 2: Set Environment Variables**

Go to Railway dashboard in browser and add all the variables listed above.

---

## 📦 ALTERNATIVE: Netlify (Also Easy)

1. Go to https://app.netlify.com/start
2. Connect GitHub
3. Select your repo
4. Add environment variables
5. Deploy

---

## 🎯 Which One Should You Use?

| Platform | Ease | Speed | Cost |
|----------|------|-------|------|
| **Vercel** | ⭐⭐⭐⭐⭐ Easiest | ⚡ Fast | 💰 Free tier |
| **Railway** | ⭐⭐⭐ Moderate | ⚡ Fast | 💰 $5/month trial |
| **Netlify** | ⭐⭐⭐⭐ Easy | ⚡ Fast | 💰 Free tier |

**Recommendation: Start with Vercel** - It's the easiest and works perfectly with Next.js!

---

## ✅ After Deployment Checklist

1. ✅ Get your deployment URL
2. ✅ Database automatically initializes
3. ✅ Create admin user (see below)
4. ✅ Login and test

## 👤 Create Admin User

After deployment, you need to create an admin user.

**Option 1: Using your local computer**

```bash
cd /Users/fabienp/accelerating-success-content-generator

# Set your production database URL (get from Vercel/Railway dashboard)
export DATABASE_URL="your-production-database-url-here"

# Run the create user script
npx tsx prisma/create-user.ts
```

**Option 2: Create the user via your platform's console**

Most platforms let you run commands directly. Use this command:
```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('YourPassword123!', 10);
  await prisma.user.create({
    data: {
      email: 'perdomonestor01@gmail.com',
      password: hashedPassword,
      name: 'Nestor Perdomo',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created!');
}

main().catch(console.error).finally(() => prisma.\$disconnect());
"
```

---

## 🆘 Need Help?

Tell me which platform you want to use and I'll guide you step-by-step!

- **Vercel**: I'll walk you through it
- **Railway**: I'll help with the CLI
- **Netlify**: I'll show you how

---

**Your code is ready to deploy! Choose Vercel for the easiest experience.** 🚀
