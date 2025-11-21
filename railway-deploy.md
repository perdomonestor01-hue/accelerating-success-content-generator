# 🚂 Railway Deployment Guide - Complete & Automated

## 🎯 Quick Overview

This guide will help you deploy your Accelerating Success content generator to Railway in **under 10 minutes**.

Your repository: `https://github.com/perdomonestor01-hue/accelerating-success-content-generator`

---

## ✅ Prerequisites

- ✅ Code pushed to GitHub (already done!)
- ✅ Railway CLI installed (already done!)
- ✅ Railway account with perdomonestor01@gmail.com

---

## 🚀 Deployment Steps

### Step 1: Create Railway Project (2 minutes)

1. **Open Railway Dashboard**: https://railway.app/new
   - Login with **perdomonestor01@gmail.com**

2. **Deploy from GitHub**:
   - Click **"Deploy from GitHub repo"**
   - Select: **`perdomonestor01-hue/accelerating-success-content-generator`**
   - Click **"Deploy Now"**

### Step 2: Add PostgreSQL (1 minute)

1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway auto-sets `DATABASE_URL` ✅

### Step 3: Set Environment Variables

**Use the automated script (recommended):**

```bash
cd /Users/fabienp/accelerating-success-content-generator
railway link  # Select your project
chmod +x railway-env-setup.sh
./railway-env-setup.sh
```

**OR manually add in Railway dashboard** under Variables tab.

### Step 4: Generate Domain (1 minute)

1. **Settings** → **Networking** → **Generate Domain**
2. Copy your URL (e.g., `https://yourapp.up.railway.app`)

### Step 5: Set NEXTAUTH_URL

```bash
railway variables set NEXTAUTH_URL="https://your-railway-url.up.railway.app"
```

### Step 6: Create Admin User (2 minutes)

```bash
railway run node create-admin-user.js
```

**Login with:**
- Email: `perdomonestor01@gmail.com`
- Password: `AcceleratingSuccess2025!`

---

## 🎉 You're Live!

Visit your Railway URL and start generating content! 🚀

**Useful commands:**
- `railway status` - Check deployment
- `railway logs` - View logs
- `railway open` - Open dashboard

