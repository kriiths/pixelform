# Deployment Guide

This guide explains how to deploy your Pixelverk Next.js site.

## ⚠️ Important Note About Your Project

Your project uses **Server Components** with file system operations (`'use server'` in loader.ts). This means:
- ✅ **Can deploy to**: Vercel, Node.js hosts, Docker
- ❌ **Cannot deploy to**: GitHub Pages (requires static export, which doesn't support server components)

## Recommended: Deploy to Vercel (FREE & EASIEST)

Vercel is made by the Next.js team and supports all features out of the box.

### Step-by-Step Vercel Deployment

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pixelverk.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

That's it! Your site will be live at `https://pixelverk.vercel.app`

### Benefits of Vercel:
- ✅ Free hosting
- ✅ Automatic deployments on every push
- ✅ Preview deployments for PRs
- ✅ Custom domains
- ✅ Built-in analytics
- ✅ Supports all Next.js features (Server Components, API routes, etc.)
- ✅ Global CDN
- ✅ Zero configuration needed

## Alternative: GitHub Pages (Requires Refactoring)

To deploy to GitHub Pages, you need to convert your project to use static data instead of server-side file operations.

### Required Changes for GitHub Pages:

#### 1. Convert product data to static JSON

#### Step 1: Build Your Site
```bash
npm run deploy
```

This creates an `out/` folder with your static site.

#### Step 2: Create GitHub Repository

If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/pixelverk.git
git push -u origin main
```

#### Step 3: Deploy to gh-pages Branch

```bash
# Build the site
npm run deploy

# Create a new orphan branch for deployment
git checkout --orphan gh-pages

# Remove all files from staging
git rm -rf .

# Copy the built files
Copy-Item -Recurse -Force out/* .

# Remove the out folder
Remove-Item -Recurse -Force out

# Add .nojekyll to bypass Jekyll processing
echo "" > .nojekyll

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Go back to main branch
git checkout main
```

#### Step 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/pixelverk/`

### Method 2: Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then in GitHub Settings → Pages:
- Source: **GitHub Actions**

## Repository Path Configuration

### If deploying to username.github.io (root domain):
Your current config is fine. No changes needed.

### If deploying to username.github.io/pixelverk (subpath):

Uncomment these lines in `next.config.ts`:
```typescript
basePath: '/pixelverk',
assetPrefix: '/pixelverk/',
```

## Testing Your Deployment

1. **Local testing**:
   ```bash
   npm run build
   npx serve out
   ```
   Visit `http://localhost:3000`

2. **After deployment**:
   - Visit your GitHub Pages URL
   - Check browser console for errors
   - Test navigation and cart functionality

## Important Notes

### ✅ What Works with Static Export:
- All static pages
- Client-side routing
- Dynamic routes (pre-rendered at build time)
- Client components (useState, useEffect, etc.)
- Cart functionality (localStorage)

### ⚠️ Limitations:
- No server-side features (API routes, server actions)
- Images must be unoptimized
- Dynamic routes must be generated at build time
- No ISR (Incremental Static Regeneration)

## Troubleshooting

### Issue: 404 errors on page refresh
**Solution**: GitHub Pages doesn't handle client-side routing by default. Add a `404.html` that redirects to `index.html`:

Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      sessionStorage.redirect = location.href;
      location.replace('/');
    </script>
  </head>
  <body></body>
</html>
```

### Issue: CSS/JS not loading
**Solution**: Make sure `basePath` is set correctly if deploying to a subpath.

### Issue: Images not showing
**Solution**: 
- Check that `images.unoptimized: true` is set
- Use relative paths for images
- Verify images are in the `public` folder

## Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test locally with `npx serve out`
- [ ] Commit and push to GitHub
- [ ] Create `gh-pages` branch and deploy
- [ ] Configure GitHub Pages settings
- [ ] Wait 1-2 minutes for deployment
- [ ] Visit your site and test functionality
- [ ] Check cart, navigation, and product pages

## Alternative: Deploy to Vercel (Recommended)

For the best experience with Next.js, consider Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Benefits:
- Automatic deployments on push
- Preview deployments for PRs
- Better performance
- No configuration needed
- Supports all Next.js features

## Resources

- [Next.js Static Export Docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vercel Deployment](https://vercel.com/docs)

---

**Current Status**: Your project is configured and ready to deploy! 🚀

Run `npm run deploy` and follow the manual deployment steps above.
