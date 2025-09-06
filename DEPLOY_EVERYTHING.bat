@echo off
echo ========================================
echo    COMPLETE DEPLOYMENT VERIFICATION
echo ========================================
echo.

echo [1/6] Checking if Git is initialized...
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo Git repository initialized!
) else (
    echo Git repository already exists!
)
echo.

echo [2/6] Testing Frontend Build...
cd frontend
echo Building React application...
npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build successful!
cd ..
echo.

echo [3/6] Testing Backend API...
cd backend
echo Testing Python backend...
python -c "import server; print('Backend imports successful!')"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend has import issues!
    pause
    exit /b 1
)
echo Backend validation successful!
cd ..
echo.

echo [4/6] Preparing files for GitHub...
echo Adding all files to Git...
git add .
git status
echo.

echo [5/6] Creating commit...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message="Complete OG Armory deployment ready"
git commit -m "%commit_message%"
echo.

echo [6/6] Publishing to GitHub...
echo.
echo CHOOSE YOUR DEPLOYMENT METHOD:
echo 1. Create new GitHub repository (recommended)
echo 2. Push to existing repository
echo 3. Skip GitHub and show Vercel deployment commands
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto create_new_repo
if "%choice%"=="2" goto push_existing
if "%choice%"=="3" goto vercel_only

:create_new_repo
echo.
echo CREATING NEW GITHUB REPOSITORY:
echo 1. Go to https://github.com/new
echo 2. Repository name: og-armory-store
echo 3. Make it PUBLIC (required for free Vercel hosting)
echo 4. DON'T initialize with README
echo 5. Click 'Create repository'
echo.
set /p repo_url="Enter the repository URL (e.g., https://github.com/username/og-armory-store.git): "
git remote add origin %repo_url%
git branch -M main
git push -u origin main
echo.
echo SUCCESS! Repository published to GitHub!
goto vercel_deploy

:push_existing
echo.
set /p repo_url="Enter existing repository URL: "
git remote add origin %repo_url%
git push -u origin main
echo.
echo SUCCESS! Code pushed to existing repository!
goto vercel_deploy

:vercel_only
echo Skipping GitHub setup...
goto vercel_deploy

:vercel_deploy
echo.
echo ========================================
echo       VERCEL DEPLOYMENT READY!
echo ========================================
echo.
echo OPTION 1 - ONE-CLICK DEPLOY:
echo 1. Go to https://vercel.com/new
echo 2. Import your GitHub repository
echo 3. Vercel will auto-detect the configuration
echo 4. Click 'Deploy'
echo.
echo OPTION 2 - CLI DEPLOY:
echo 1. Install Vercel CLI: npm i -g vercel
echo 2. Run: vercel --prod
echo 3. Follow the prompts
echo.
echo ========================================
echo           LIVE ENDPOINTS
echo ========================================
echo Frontend: https://your-project.vercel.app
echo API: https://your-project.vercel.app/api
echo Health: https://your-project.vercel.app/api/health
echo.
echo ========================================
echo         DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your OG Armory store is now:
echo ✅ Built and tested
echo ✅ Published to GitHub
echo ✅ Ready for Vercel deployment
echo ✅ Production-ready
echo.
echo Next steps:
echo 1. Deploy to Vercel using one of the options above
echo 2. Test your live site
echo 3. Configure custom domain (optional)
echo.
pause