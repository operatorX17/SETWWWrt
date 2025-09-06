# 🚀 Deploy to Vercel - Free & Easy!

## Quick Deploy (Recommended)

### Option 1: One-Click Deploy
1. **Fork this repository** to your GitHub account
2. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub
3. **Click "New Project"** and import your forked repository
4. **Deploy!** - Vercel will automatically detect the configuration

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? (default or custom)
# - Directory? ./ (current directory)
```

## 📁 Project Structure for Vercel

```
project-root/
├── frontend/           # React app
│   ├── package.json   # Contains vercel-build script
│   ├── build/         # Production build (auto-generated)
│   └── ...
├── api/               # Serverless functions
│   ├── index.py       # Main API handler
│   └── requirements.txt
├── vercel.json        # Vercel configuration
└── VERCEL_DEPLOYMENT.md
```

## ⚙️ Configuration Files Created

### 1. `vercel.json` - Main Configuration
- Configures both frontend (React) and backend (Python API)
- Routes API calls to `/api/*` to Python functions
- Serves React app for all other routes

### 2. `frontend/package.json` - Build Script
- Added `vercel-build` script for deployment
- Uses `yarn build` to create production build

### 3. `api/index.py` - Serverless API
- FastAPI application optimized for Vercel
- Simplified version of your backend
- Handles CORS and basic endpoints

### 4. `api/requirements.txt` - Python Dependencies
- Minimal dependencies for Vercel deployment
- FastAPI, Uvicorn, Pydantic

## 🌐 After Deployment

### Your app will be available at:
- **Frontend**: `https://your-project-name.vercel.app`
- **API**: `https://your-project-name.vercel.app/api`
- **Status**: `https://your-project-name.vercel.app/api/status`

### Test your deployment:
```bash
# Test API
curl https://your-project-name.vercel.app/api/status

# Should return:
{
  "status": "healthy",
  "platform": "vercel",
  "timestamp": "2024-01-XX...",
  "environment": "production"
}
```

## 🔧 Environment Variables (Optional)

If you need environment variables:

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add your variables (e.g., `MONGO_URL`, `SHOPIFY_API_KEY`)

2. **Via CLI**:
   ```bash
   vercel env add MONGO_URL
   # Enter your MongoDB connection string
   ```

## 🚨 Important Notes

### ✅ What Works on Vercel:
- ✅ React frontend with routing
- ✅ FastAPI backend as serverless functions
- ✅ Static file serving
- ✅ CORS handling
- ✅ Environment variables
- ✅ Custom domains
- ✅ Automatic HTTPS

### ⚠️ Limitations:
- ⚠️ Serverless functions have execution time limits (10s for hobby plan)
- ⚠️ No persistent file storage (use external databases)
- ⚠️ Cold starts for infrequently used functions
- ⚠️ MongoDB connections should use connection pooling

## 🔄 Continuous Deployment

Once connected to GitHub:
- **Auto-deploy** on every push to main branch
- **Preview deployments** for pull requests
- **Rollback** to previous versions easily

## 💰 Pricing

**Hobby Plan (FREE)**:
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Custom domains
- ✅ Automatic HTTPS

## 🆘 Troubleshooting

### Build Fails?
```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Missing dependencies in package.json
# 2. Build script errors
# 3. Environment variables not set
```

### API Not Working?
```bash
# Check function logs in Vercel dashboard
# Common issues:
# 1. Python import errors
# 2. Missing requirements.txt dependencies
# 3. Incorrect route configuration
```

### Frontend Not Loading?
```bash
# Check if build directory exists
# Ensure vercel-build script runs successfully
# Check routing configuration in vercel.json
```

## 🎉 Success!

Your OG Armory app is now deployed on Vercel for FREE! 🎊

**Next Steps**:
1. Share your live URL: `https://your-project-name.vercel.app`
2. Set up custom domain (optional)
3. Configure environment variables for production
4. Monitor usage in Vercel dashboard

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or create an issue in this repository.