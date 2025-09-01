#!/bin/bash

# G2B Gift Card Website One-Click Deployment Script
# This script provides multiple deployment options for 24/7 hosting with a clean URL

echo "G2B Gift Card Website - One-Click Deployment"
echo "==========================================="
echo ""
echo "This script will help you deploy your G2B Gift Card website with a clean URL"
echo "that runs 24/7 with no 'temporary preview' message."
echo ""
echo "Choose a deployment option:"
echo "1) Deploy to Heroku (recommended for backend functionality)"
echo "2) Deploy to Vercel (fastest deployment)"
echo "3) Deploy to Netlify (simple static hosting)"
echo "4) Deploy to Render (good balance of features)"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "Deploying to Heroku..."
        echo "======================="
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo "Heroku CLI not found. Installing..."
            npm install -g heroku
        fi
        
        # Login to Heroku
        echo "Please log in to Heroku:"
        heroku login
        
        # Create a new Heroku app
        echo ""
        echo "Creating a new Heroku app..."
        read -p "Enter a name for your app (e.g., g2b-gift-cards): " app_name
        heroku create $app_name
        
        # Initialize git if not already done
        if [ ! -d ".git" ]; then
            git init
            git add .
            git commit -m "Initial commit"
        fi
        
        # Deploy to Heroku
        echo ""
        echo "Deploying to Heroku..."
        git push heroku main
        
        # Open the app
        echo ""
        echo "Deployment complete!"
        echo "Your website is now available at: https://$app_name.herokuapp.com"
        echo "This URL will work 24/7 with no 'temporary preview' message."
        heroku open
        ;;
        
    2)
        echo ""
        echo "Deploying to Vercel..."
        echo "======================"
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        # Deploy to Vercel
        echo ""
        echo "Starting Vercel deployment..."
        echo "Please follow the prompts to complete deployment."
        echo "When asked for a project name, enter something like 'g2b-gift-cards'."
        vercel --prod
        
        echo ""
        echo "Deployment complete!"
        echo "Your website is now available at the URL shown above."
        echo "This URL will work 24/7 with no 'temporary preview' message."
        ;;
        
    3)
        echo ""
        echo "Deploying to Netlify..."
        echo "======================="
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "Netlify CLI not found. Installing..."
            npm install -g netlify-cli
        fi
        
        # Deploy to Netlify
        echo ""
        echo "Starting Netlify deployment..."
        echo "Please follow the prompts to complete deployment."
        netlify deploy --prod
        
        echo ""
        echo "Deployment complete!"
        echo "Your website is now available at the URL shown above."
        echo "This URL will work 24/7 with no 'temporary preview' message."
        ;;
        
    4)
        echo ""
        echo "Deploying to Render..."
        echo "======================"
        
        echo "To deploy to Render:"
        echo "1. Go to https://render.com and create a free account"
        echo "2. Click 'New' and select 'Static Site'"
        echo "3. Connect your GitHub repository or upload the files directly"
        echo "4. Configure the settings:"
        echo "   - Name: g2b-gift-cards"
        echo "   - Build Command: (leave blank)"
        echo "   - Publish Directory: ."
        echo "5. Click 'Create Static Site'"
        
        echo ""
        echo "Once deployed, your website will be available at a URL like:"
        echo "https://g2b-gift-cards.onrender.com"
        echo "This URL will work 24/7 with no 'temporary preview' message."
        
        read -p "Would you like to open the Render website now? (y/n): " open_render
        if [ "$open_render" = "y" ]; then
            if command -v xdg-open &> /dev/null; then
                xdg-open https://render.com
            elif command -v open &> /dev/null; then
                open https://render.com
            else
                echo "Please visit https://render.com to complete deployment."
            fi
        fi
        ;;
        
    5)
        echo "Exiting deployment script."
        exit 0
        ;;
        
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "IMPORTANT: After deployment, you can access the admin panel at:"
echo "https://your-site-url/admin-login.html"
echo ""
echo "Login credentials:"
echo "- Username: admin"
echo "- Password: admin123"
echo ""
echo "This will allow you to view all collected payment information."