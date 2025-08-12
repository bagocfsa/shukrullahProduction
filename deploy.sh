#!/bin/bash

# Nutrinute Website Deployment Script
echo "🚀 Starting Nutrinute Website Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "📱 Your mobile-responsive Nutrinute website is now live!"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi
