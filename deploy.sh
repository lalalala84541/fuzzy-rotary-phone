#!/bin/bash
# Deployment script for G2B Gift Card Website

echo "G2B Gift Card Website Deployment Script"
echo "======================================="

# Check if domain name is provided
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh yourdomain.com"
  exit 1
fi

DOMAIN=$1
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
DEPLOY_DIR="g2b_deploy_$TIMESTAMP"

echo "Preparing deployment for domain: $DOMAIN"

# Create deployment directory
mkdir -p $DEPLOY_DIR

# Copy all website files
echo "Copying website files..."
cp -r css js images *.html $DEPLOY_DIR/

# Create .htaccess file for Apache servers
echo "Creating .htaccess file..."
cat > $DEPLOY_DIR/.htaccess << EOL
# Enable URL rewriting
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Remove www prefix
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Set security headers
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Content-Security-Policy "upgrade-insecure-requests"

# Enable caching
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js)$">
    Header set Cache-Control "max-age=2592000, public"
</FilesMatch>
EOL

# Create robots.txt
echo "Creating robots.txt..."
cat > $DEPLOY_DIR/robots.txt << EOL
User-agent: *
Disallow: /admin-login.html
Disallow: /admin-dashboard.html
Allow: /
EOL

# Create sitemap.xml
echo "Creating sitemap.xml..."
cat > $DEPLOY_DIR/sitemap.xml << EOL
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://$DOMAIN/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://$DOMAIN/login.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://$DOMAIN/register.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://$DOMAIN/paypal-25.html</loc>
    <priority>0.9</priority>
  </url>
</urlset>
EOL

# Create a zip file for easy download
echo "Creating deployment zip file..."
zip -r "${DEPLOY_DIR}.zip" $DEPLOY_DIR

echo "Deployment package created: ${DEPLOY_DIR}.zip"
echo ""
echo "DEPLOYMENT INSTRUCTIONS:"
echo "========================"
echo "1. Purchase the domain: $DOMAIN"
echo "2. Sign up for web hosting (AWS, DigitalOcean, Netlify, etc.)"
echo "3. Upload the contents of the ${DEPLOY_DIR}.zip file to your web hosting"
echo "4. Set up SSL certificate for your domain"
echo "5. Point your domain's DNS records to your hosting provider"
echo ""
echo "For 24/7 operation, choose a reliable hosting provider with high uptime guarantees."
echo "Most hosting providers offer 99.9% uptime SLAs for their services."
echo ""
echo "For additional security and data persistence, consider:"
echo "- Setting up a MySQL database to store user data instead of localStorage"
echo "- Implementing server-side processing with PHP, Node.js, or Python"
echo "- Adding HTTPS encryption (most hosting providers offer free SSL certificates)"
echo ""
echo "Deployment package ready for hosting setup!"