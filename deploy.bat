@echo off
echo 🚀 Starting Nutrinute Website Deployment...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Build the project
echo 🔨 Building the project...
npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    REM Deploy to Vercel
    echo 🌐 Deploying to Vercel...
    vercel --prod
    
    echo 🎉 Deployment complete!
    echo 📱 Your mobile-responsive Nutrinute website is now live!
) else (
    echo ❌ Build failed. Please fix the errors and try again.
    pause
    exit /b 1
)

pause
