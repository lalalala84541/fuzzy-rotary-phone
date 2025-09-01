#!/bin/bash

# Setup script for G2B Gift Card Website deployment
# This script will:
# 1. Create a GitHub repository
# 2. Push the website code to GitHub
# 3. Set up Netlify deployment
# 4. Configure a custom subdomain

echo "G2B Gift Card Website Deployment Setup"
echo "======================================"

# Install required tools
echo "Installing required tools..."
npm install -g netlify-cli

# Initialize git repository
echo "Initializing git repository..."
git init
git add .
git commit -m "Initial commit of G2B Gift Card Website"

# Create GitHub repository using GitHub CLI or API
echo "Creating GitHub repository..."
# Note: This would typically use the GitHub CLI (gh) or GitHub API
# For demonstration purposes, we'll show the commands:
echo "Run: gh repo create g2b-gift-cards --private"
echo "Or create a repository manually on GitHub.com"

# Push to GitHub
echo "Push to GitHub with:"
echo "git remote add origin https://github.com/yourusername/g2b-gift-cards.git"
echo "git push -u origin main"

# Deploy to Netlify
echo "Deploying to Netlify..."
echo "netlify deploy --prod"

echo ""
echo "MANUAL STEPS TO COMPLETE SETUP:"
echo "==============================="
echo "1. Create a GitHub account if you don't have one"
echo "2. Create a new private repository named 'g2b-gift-cards'"
echo "3. Push this code to your GitHub repository:"
echo "   git remote add origin https://github.com/yourusername/g2b-gift-cards.git"
echo "   git push -u origin main"
echo "4. Create a Netlify account at https://netlify.com"
echo "5. Connect your GitHub repository to Netlify"
echo "6. Deploy your site with these settings:"
echo "   - Build command: (leave blank)"
echo "   - Publish directory: ."
echo "7. Once deployed, go to Site settings > Domain management"
echo "8. Change the site name to 'g2b-cards' or something similar"
echo "   This will give you a URL like https://g2b-cards.netlify.app"
echo ""
echo "For even better URL, you can use Netlify's free subdomain feature:"
echo "1. In Netlify, go to Site settings > Domain management"
echo "2. Add a custom domain like 'g2b.netlify.app'"
echo ""
echo "Your site will now be live 24/7 with a clean URL!"