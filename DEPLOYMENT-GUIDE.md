# G2B Gift Card Marketplace - Complete Deployment Guide

This guide provides multiple options for deploying your G2B Gift Card website with a clean, professional URL that runs 24/7 with no "temporary preview" message.

## Table of Contents
1. [One-Click Deployment Options](#one-click-deployment-options)
2. [Heroku Deployment](#heroku-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Render Deployment](#render-deployment)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Accessing Admin Panel](#accessing-admin-panel)

## One-Click Deployment Options

### Deploy to Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. Click the button above
2. Create a free Heroku account if you don't have one
3. Give your app a name (e.g., g2b-gift-cards)
4. Click "Deploy App"
5. Once deployed, click "View" to see your live site
6. Your site will be available at https://your-app-name.herokuapp.com

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fg2b-gift-cards)

1. Click the button above
2. Create a free Vercel account if you don't have one
3. Give your project a name (e.g., g2b-gift-cards)
4. Click "Deploy"
5. Once deployed, you'll get a URL like https://g2b-gift-cards.vercel.app

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/g2b-gift-cards)

1. Click the button above
2. Create a free Netlify account if you don't have one
3. Give your site a name (e.g., g2b-gift-cards)
4. Click "Deploy site"
5. Once deployed, you'll get a URL like https://g2b-gift-cards.netlify.app

### Deploy to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/g2b-gift-cards)

1. Click the button above
2. Create a free Render account if you don't have one
3. Give your service a name (e.g., g2b-gift-cards)
4. Click "Apply"
5. Once deployed, you'll get a URL like https://g2b-gift-cards.onrender.com

## Heroku Deployment

For a more manual approach with Heroku:

1. Install the Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create g2b-gift-cards
   ```

4. Deploy the code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

5. Open your app:
   ```bash
   heroku open
   ```

## Vercel Deployment

For a more manual approach with Vercel:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the site:
   ```bash
   cd g2b
   vercel
   ```

3. Follow the prompts to complete deployment

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Netlify Deployment

For a more manual approach with Netlify:

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy the site:
   ```bash
   cd g2b
   netlify deploy
   ```

3. Follow the prompts to complete deployment

4. For production deployment:
   ```bash
   netlify deploy --prod
   ```

## Render Deployment

For a more manual approach with Render:

1. Create a new Static Site on the Render dashboard
2. Connect your GitHub repository or upload the files directly
3. Configure the settings:
   - Build Command: (leave blank)
   - Publish Directory: .
4. Click "Create Static Site"

## Custom Domain Setup

### Heroku Custom Domain
1. Purchase a domain from a registrar like Namecheap or GoDaddy
2. In your Heroku dashboard, go to your app's settings
3. Click "Add domain"
4. Enter your domain name
5. Follow the instructions to update your DNS settings

### Vercel Custom Domain
1. In your Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow the instructions to update your DNS settings

### Netlify Custom Domain
1. In your Netlify dashboard, go to your site
2. Click "Site settings" > "Domain management"
3. Click "Add custom domain"
4. Enter your domain name
5. Follow the instructions to update your DNS settings

### Render Custom Domain
1. In your Render dashboard, go to your service
2. Click "Settings" > "Custom Domains"
3. Add your custom domain
4. Follow the instructions to update your DNS settings

## Accessing Admin Panel

After deployment, you can access the admin panel at:
- https://your-site-url/admin-login.html

Login credentials:
- Username: admin
- Password: admin123

This will allow you to view all collected payment information.

## Important Notes

1. **24/7 Operation**: All of these options provide 24/7 hosting with no downtime
2. **No "Temporary Preview" Message**: None of these options will show a "temporary preview" message
3. **Clean URL**: All options provide a clean, professional-looking URL
4. **Free Hosting**: All options offer free tiers that are sufficient for this website
5. **SSL Security**: All options include free SSL certificates (https)

## Troubleshooting

If you encounter any issues during deployment:

1. **Heroku Deployment Issues**:
   - Check your Heroku logs: `heroku logs --tail`
   - Ensure your Procfile is correctly set up

2. **Vercel/Netlify Deployment Issues**:
   - Check the deployment logs in your dashboard
   - Ensure all files are properly included in your deployment

3. **Custom Domain Issues**:
   - DNS changes can take up to 48 hours to propagate
   - Verify your DNS settings with your domain registrar

4. **Admin Panel Access Issues**:
   - Clear your browser cache
   - Try using incognito/private browsing mode