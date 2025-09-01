#!/bin/bash

# G2B Gift Card Website One-Click Deployment Script
# This script deploys the website to Vercel with a clean URL

echo "G2B Gift Card Website One-Click Deployment"
echo "=========================================="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is required but not installed. Please install Node.js and npm first."
    exit 1
fi

# Install Vercel CLI
echo "Installing Vercel CLI..."
npm install -g vercel

# Deploy to Vercel
echo "Deploying to Vercel..."
echo "This will create a clean URL like https://g2b.vercel.app"

# Create a production deployment
vercel --prod

echo ""
echo "DEPLOYMENT COMPLETE!"
echo "===================="
echo "Your G2B Gift Card website is now:"
echo "1. Running 24/7 with no 'temporary preview' message"
echo "2. Using a clean, professional URL (https://g2b.vercel.app or your custom domain)"
echo "3. Automatically secured with SSL (https)"
echo ""
echo "To view your site, check the URL provided in the Vercel deployment output above."
echo ""
echo "To use a custom domain:"
echo "1. Go to your Vercel dashboard"
echo "2. Select your G2B project"
echo "3. Go to Settings > Domains"
echo "4. Add your custom domain"
echo ""
echo "Your website is now permanently deployed and will run 24/7!"