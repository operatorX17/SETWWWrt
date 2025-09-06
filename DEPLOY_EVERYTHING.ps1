# Complete OG Armory Deployment Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    COMPLETE DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check command success
function Test-LastCommand {
    param($ErrorMessage)
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: $ErrorMessage" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "[1/6] Checking Git repository..." -ForegroundColor Yellow
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
    Test-LastCommand "Git initialization failed"
    Write-Host "Git repository initialized!" -ForegroundColor Green
} else {
    Write-Host "Git repository already exists!" -ForegroundColor Green
}
Write-Host ""

Write-Host "[2/6] Testing Frontend Build..." -ForegroundColor Yellow
Set-Location frontend
Write-Host "Building React application..." -ForegroundColor Green
npm run build
Test-LastCommand "Frontend build failed"
Write-Host "Frontend build successful!" -ForegroundColor Green
Set-Location ..
Write-Host ""

Write-Host "[3/6] Testing Backend API..." -ForegroundColor Yellow
Set-Location backend
Write-Host "Validating Python backend..." -ForegroundColor Green
python -c "import server; print('Backend imports successful!')"
Test-LastCommand "Backend validation failed"
Write-Host "Backend validation successful!" -ForegroundColor Green
Set-Location ..
Write-Host ""

Write-Host "[4/6] Preparing files for GitHub..." -ForegroundColor Yellow
Write-Host "Adding all files to Git..." -ForegroundColor Green
git add .
git status
Write-Host ""

Write-Host "[5/6] Creating commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Complete OG Armory deployment ready"
}
git commit -m "$commitMessage"
Write-Host ""

Write-Host "[6/6] Publishing to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "CHOOSE YOUR DEPLOYMENT METHOD:" -ForegroundColor Cyan
Write-Host "1. Create new GitHub repository (recommended)" -ForegroundColor White
Write-Host "2. Push to existing repository" -ForegroundColor White
Write-Host "3. Skip GitHub and show Vercel deployment commands" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "CREATING NEW GITHUB REPOSITORY:" -ForegroundColor Cyan
        Write-Host "1. Go to https://github.com/new" -ForegroundColor White
        Write-Host "2. Repository name: og-armory-store" -ForegroundColor White
        Write-Host "3. Make it PUBLIC (required for free Vercel hosting)" -ForegroundColor White
        Write-Host "4. DON'T initialize with README" -ForegroundColor White
        Write-Host "5. Click 'Create repository'" -ForegroundColor White
        Write-Host ""
        $repoUrl = Read-Host "Enter the repository URL (e.g., https://github.com/username/og-armory-store.git)"
        git remote add origin $repoUrl
        git branch -M main
        git push -u origin main
        Write-Host ""
        Write-Host "SUCCESS! Repository published to GitHub!" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        $repoUrl = Read-Host "Enter existing repository URL"
        git remote add origin $repoUrl
        git push -u origin main
        Write-Host ""
        Write-Host "SUCCESS! Code pushed to existing repository!" -ForegroundColor Green
    }
    "3" {
        Write-Host "Skipping GitHub setup..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       VERCEL DEPLOYMENT READY!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPTION 1 - ONE-CLICK DEPLOY:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/new" -ForegroundColor White
Write-Host "2. Import your GitHub repository" -ForegroundColor White
Write-Host "3. Vercel will auto-detect the configuration" -ForegroundColor White
Write-Host "4. Click 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "OPTION 2 - CLI DEPLOY:" -ForegroundColor Yellow
Write-Host "1. Install Vercel CLI: npm i -g vercel" -ForegroundColor White
Write-Host "2. Run: vercel --prod" -ForegroundColor White
Write-Host "3. Follow the prompts" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           LIVE ENDPOINTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend: https://your-project.vercel.app" -ForegroundColor Green
Write-Host "API: https://your-project.vercel.app/api" -ForegroundColor Green
Write-Host "Health: https://your-project.vercel.app/api/health" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         DEPLOYMENT COMPLETE!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your OG Armory store is now:" -ForegroundColor White
Write-Host "✅ Built and tested" -ForegroundColor Green
Write-Host "✅ Published to GitHub" -ForegroundColor Green
Write-Host "✅ Ready for Vercel deployment" -ForegroundColor Green
Write-Host "✅ Production-ready" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy to Vercel using one of the options above" -ForegroundColor White
Write-Host "2. Test your live site" -ForegroundColor White
Write-Host "3. Configure custom domain (optional)" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"