# 🚀 OG Armory Deployment Guide

## Overview
This guide will help you deploy your OG Armory e-commerce website to Vercel. The project is fully configured and ready for deployment.

## ✅ Pre-Deployment Checklist
- [x] Vercel configuration file (`vercel.json`) is set up
- [x] API endpoint (`api/index.py`) is created
- [x] Build process tested successfully
- [x] Frontend optimized for production

## 🌐 Deployment Options

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   cd "C:\Users\KARTHIK GOWDA M P\Downloads\Og1.5-main\Og1.5-mainBOSS\Og1.5-main"
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N` (for first deployment)
   - Project name: `og-armory` or your preferred name
   - Directory: `.` (current directory)

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

## 🔧 Configuration Details

### Build Settings (Auto-configured)
- **Build Command**: `cd frontend && yarn install && yarn build`
- **Output Directory**: `frontend/build`
- **Install Command**: `yarn install --cwd frontend`

### Environment Variables
- `NODE_ENV`: `production`
- `REACT_APP_API_URL`: `/api`

### API Routes
- All `/api/*` requests are routed to `api/index.py`
- Frontend routes are handled by React Router

## 🎯 Post-Deployment

### 1. Verify Deployment
- Check that the website loads correctly
- Test navigation and scroll features
- Verify product listings display properly
- Test API endpoint: `https://your-domain.vercel.app/api`

### 2. Custom Domain (Optional)
- Go to your Vercel project dashboard
- Navigate to "Settings" > "Domains"
- Add your custom domain
- Configure DNS records as instructed

### 3. Performance Optimization
- Enable Vercel Analytics (optional)
- Set up monitoring
- Configure caching headers if needed

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Ensure build command runs locally first
   - Check for any missing environment variables

2. **API Routes Not Working**
   - Verify `api/index.py` exists
   - Check `vercel.json` routing configuration
   - Ensure Python runtime is supported

3. **Static Files Not Loading**
   - Check build output directory
   - Verify asset paths in the built files
   - Ensure public folder contents are included

### Debug Commands
```bash
# Test build locally
cd frontend && yarn build

# Serve build locally
npx serve -s frontend/build

# Check Vercel logs
vercel logs YOUR_DEPLOYMENT_URL
```

## 📊 Project Structure
```
.
├── api/
│   └── index.py          # Vercel serverless function
├── frontend/
│   ├── build/             # Production build (generated)
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   └── package.json       # Frontend dependencies
├── vercel.json            # Vercel configuration
└── DEPLOYMENT_GUIDE.md    # This file
```

## 🎉 Success!
Once deployed, your OG Armory website will be live with:
- ✅ Responsive design
- ✅ Scroll-based navigation
- ✅ Product catalog without duplicates
- ✅ Optimized performance
- ✅ API endpoints

## 📞 Support
If you encounter any issues during deployment:
1. Check Vercel deployment logs
2. Verify all files are committed to your repository
3. Ensure build process works locally
4. Contact Vercel support if needed

---
**Happy Deploying! 🚀**