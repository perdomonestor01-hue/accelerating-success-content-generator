# 🚀 Deploy Accelerating Success to Railway - QUICK START

## ✅ Your Code is Ready!

All your share button fixes have been committed and are ready to deploy:
- ✅ Fixed Tumblr direct posting
- ✅ Fixed Blogger direct posting
- ✅ Removed Instagram
- ✅ All platforms auto-copy to clipboard
- ✅ Visual feedback on share buttons

## 🎯 DEPLOY NOW - 3 Options

### Option 1: Deploy Directly from Railway (FASTEST - 5 minutes)

1. **Go to Railway**: https://railway.app/new
2. **Click "Empty Project"**
3. **Add PostgreSQL Database**:
   - Click "+ New" → "Database" → "Add PostgreSQL"

4. **Add GitHub Repo** (or skip to Option 2):
   - Click "+ New" → "GitHub Repo"
   - Select this repo (you'll need to push to GitHub first)

### Option 2: Create GitHub Repo First (RECOMMENDED)

1. **Create New GitHub Repo**: https://github.com/new
   - Name: `accelerating-success-content-generator`
   - Description: "AI-powered multiposting platform for educational content"
   - Make it Private or Public (your choice)
   - Click "Create repository"

2. **Push Your Code** (run these commands):
   ```bash
   cd /Users/fabienp/accelerating-success-content-generator
   git remote remove origin
   git remote add origin https://github.com/perdomonestor01-hue/accelerating-success-content-generator.git
   git push -u origin main
   ```

3. **Deploy to Railway**:
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select `accelerating-success-content-generator`
   - Railway auto-detects Next.js ✅

4. **Add PostgreSQL**:
   - In Railway dashboard, click "+ New" → "Database" → "Add PostgreSQL"
   - `DATABASE_URL` is automatically created ✅

5. **Set Environment Variables**:
   Click on your service → "Variables" → Add these:

   ```
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   GROQ_API_KEY=your-groq-api-key-here
   DEEPSEEK_API_KEY=your-deepseek-api-key-here
   DEFAULT_AI_PROVIDER=claude
   NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   NEXTAUTH_SECRET=production-secret-CHANGE-THIS-TO-RANDOM-STRING
   SUBSCRIPTION_URL=https://accelerating-success.com/subscriptions/
   BRAND_NAME=Accelerating Success
   BRAND_HANDLE=@AccSuccess
   TESTIMONIAL_VIDEO_1=https://youtube.com/shorts/FC_5CXTUl9o?si=QV-bYUf9TAuACg-j
   TESTIMONIAL_VIDEO_2=https://youtube.com/shorts/fcXj7ms7oqQ?si=RzMZDMs2x5ZykB4y
   TESTIMONIAL_VIDEO_3=https://youtube.com/shorts/3wWcl8OHDXs?si=QpmmQTqC3g77AlYH
   ```

6. **Generate Secure NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and replace `NEXTAUTH_SECRET` value in Railway

7. **Deploy!**
   - Railway will automatically build and deploy
   - Wait for deployment to complete (~2-3 minutes)

8. **Initialize Database**:
   - Click on your service → "Settings" → "Environment"
   - Find your deployment URL
   - The database schema will be auto-created on first deployment

### Option 3: Manual Railway CLI (if interactive terminal available)

```bash
# Navigate to project
cd /Users/fabienp/accelerating-success-content-generator

# Initialize Railway
railway login
railway init
railway link

# Add PostgreSQL
railway add --database postgres

# Set variables (one by one or use Railway dashboard - get keys from your .env file)
railway variables set ANTHROPIC_API_KEY="your-api-key-here"
railway variables set GROQ_API_KEY="your-api-key-here"
railway variables set DEEPSEEK_API_KEY="your-api-key-here"
# ... (continue for all variables listed above)

# Deploy
railway up
```

## 📋 After Deployment Checklist

1. **Find Your URL**:
   - In Railway dashboard, click on your service
   - Copy the public URL (something like `https://yourapp.up.railway.app`)

2. **Initialize Database** (automatically happens on first deploy):
   - Railway runs `npm run build` which includes `prisma generate`
   - Schema is pushed automatically

3. **Create Admin User**:

   Create a file locally `create-admin.js`:
   ```javascript
   const { PrismaClient } = require('@prisma/client');
   const bcrypt = require('bcryptjs');

   const prisma = new PrismaClient();

   async function main() {
     const hashedPassword = await bcrypt.hashSync('YourPasswordHere123!', 10);

     await prisma.user.create({
       data: {
         email: 'perdomonestor01@gmail.com',
         password: hashedPassword,
         name: 'Nestor Perdomo',
         role: 'ADMIN',
       },
     });

     console.log('✅ Admin user created!');
   }

   main()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```

   Then run it with your production DATABASE_URL:
   ```bash
   DATABASE_URL="your-railway-postgres-url" node create-admin.js
   ```

4. **Test Your Deployment**:
   - Visit your Railway URL
   - Login with `perdomonestor01@gmail.com` and your password
   - Generate test content
   - Test share buttons

## 🎉 You're Live!

Once deployed, you can:
- ✅ Generate content for 7 platforms
- ✅ Share directly to Twitter (auto-filled)
- ✅ Share directly to Reddit (auto-filled)
- ✅ Share to LinkedIn, Facebook, Pinterest, Tumblr, Blogger (clipboard)
- ✅ Access from anywhere via your Railway URL

## 🔄 Continuous Deployment

Every time you push to your GitHub repo, Railway will automatically redeploy! 🚀

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check Railway logs in dashboard for any errors

---

**Your code is committed and ready! Choose one of the options above to deploy.** 🎯
