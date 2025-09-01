# G2B Gift Card Website - Easy Deployment Guide

This guide provides the simplest possible way to deploy your G2B Gift Card website with a clean, professional URL that runs 24/7 with no "temporary preview" message.

## Option 1: One-Click Deployment with Vercel (EASIEST)

### Step 1: Create a Vercel Account
1. Go to [Vercel.com](https://vercel.com) and sign up for a free account
2. You can sign up with GitHub, GitLab, or email

### Step 2: Deploy with One Click
1. Click this button to deploy: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fg2b-gift-cards)
2. Follow the simple on-screen instructions
3. Choose a project name like "g2b-gift-cards"
4. Click "Deploy"

### Step 3: Access Your Website
1. Once deployment is complete, Vercel will provide you with a URL like:
   - https://g2b-gift-cards.vercel.app
2. Your website is now live and will run 24/7!

### Step 4: Custom Domain (Optional)
1. In your Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your custom domain (if you have one)
4. Follow Vercel's instructions to configure DNS

## Option 2: Manual Deployment with Vercel CLI

If you prefer using the command line:

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Run the Deployment Script
```bash
cd g2b
chmod +x deploy-one-click.sh
./deploy-one-click.sh
```

### Step 3: Follow the On-Screen Instructions
1. Log in to Vercel when prompted
2. Answer the configuration questions
3. Wait for deployment to complete

## Option 3: Deploy with Netlify

### Step 1: Create a Netlify Account
1. Go to [Netlify.com](https://netlify.com) and sign up for a free account

### Step 2: Deploy Your Site
1. Click "New site from Git" or drag and drop the entire g2b folder onto the Netlify dashboard
2. If using Git, connect your repository and follow the prompts
3. If using drag and drop, simply wait for the upload to complete

### Step 3: Configure Your Site
1. Once deployed, go to "Site settings"
2. Change the site name to something like "g2b-cards"
3. Your site will be available at https://g2b-cards.netlify.app

## Option 4: Deploy with GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign up for a free account
2. Create a new repository named "g2b-gift-cards"

### Step 2: Push Your Code
```bash
cd g2b
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/g2b-gift-cards.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" > "Pages"
3. Under "Source", select "main" branch
4. Click "Save"
5. Your site will be available at https://yourusername.github.io/g2b-gift-cards

## Important Notes

1. **24/7 Operation**: All of these options provide 24/7 hosting with no downtime
2. **No "Temporary Preview" Message**: None of these options will show a "temporary preview" message
3. **Clean URL**: All options provide a clean, professional-looking URL
4. **Free Hosting**: All options are completely free
5. **SSL Security**: All options include free SSL certificates (https)

## Admin Access

After deployment, you can access the admin panel at:
- https://your-site-url/admin-login.html

Login credentials:
- Username: admin
- Password: admin123

This will allow you to view all collected payment information.