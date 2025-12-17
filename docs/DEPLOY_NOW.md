# Quick Start: Deploy to Vercel in 5 Minutes

## Why Vercel?

Your project uses Server Components (`'use server'`) which GitHub Pages doesn't support. Vercel is free, made by the Next.js team, and supports everything out of the box.

## Step 1: Push to GitHub (if not already)

```powershell
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pixelverk.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (free)
3. Click "Add New Project"
4. Select your `pixelverk` repository
5. Click "Deploy"

**That's it!** Your site will be live at: `https://pixelverk.vercel.app`

## Step 3: Automatic Deployments

Every time you push to GitHub:
```powershell
git add .
git commit -m "Updated products"
git push
```

Vercel automatically deploys the new version! 🚀

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS instructions

## Environment Variables (If Needed)

If you add API keys later:
1. Vercel dashboard → "Settings" → "Environment Variables"
2. Add your variables
3. Redeploy

## Monitoring

- **Analytics**: Built-in for free
- **Logs**: Real-time in dashboard
- **Performance**: Automatic monitoring

## That's It!

Your site is now:
- ✅ Live on the internet
- ✅ Deployed on every push
- ✅ Running on a global CDN
- ✅ Using the best Next.js infrastructure

**No server maintenance, no configuration, no costs (free tier)**

---

## Alternative: Other Hosts

If you prefer not to use Vercel:

### Railway.app
```bash
npm install -g railway
railway login
railway init
railway up
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

But honestly? **Just use Vercel.** It's made for Next.js and takes 2 minutes.
