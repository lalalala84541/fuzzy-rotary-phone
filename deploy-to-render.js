#!/usr/bin/env node

/**
 * G2B Gift Card Website Automatic Deployment Script
 * This script deploys the website to Render.com with a clean URL
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const RENDER_API_KEY = process.env.RENDER_API_KEY || 'YOUR_RENDER_API_KEY'; // Replace with your Render API key
const SITE_NAME = 'g2b-gift-cards';
const SITE_DOMAIN = 'g2b.onrender.com'; // This will be the URL

console.log('G2B Gift Card Website Deployment');
console.log('================================');

// Create a zip file of the current directory
console.log('Creating deployment package...');
try {
  execSync('zip -r deployment.zip . -x "*.git*" -x "node_modules/*" -x "deployment.zip"');
  console.log('Deployment package created successfully.');
} catch (error) {
  console.error('Failed to create deployment package:', error);
  process.exit(1);
}

// Read the zip file
const zipFile = fs.readFileSync('deployment.zip');

// Create a new static site on Render
console.log('Creating site on Render...');

const data = JSON.stringify({
  name: SITE_NAME,
  type: 'static_site',
  branch: 'main',
  buildCommand: 'echo "No build needed"',
  publishDirectory: '.',
  domains: [SITE_DOMAIN]
});

const options = {
  hostname: 'api.render.com',
  port: 443,
  path: '/v1/sites',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RENDER_API_KEY}`
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      const siteInfo = JSON.parse(responseData);
      console.log('Site created successfully!');
      console.log(`Site ID: ${siteInfo.id}`);
      console.log(`Site URL: https://${SITE_DOMAIN}`);
      
      // Deploy the site
      deployToSite(siteInfo.id, zipFile);
    } else {
      console.error('Failed to create site:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error creating site:', error);
});

req.write(data);
req.end();

// Function to deploy the zip file to the site
function deployToSite(siteId, zipFile) {
  console.log('Deploying website...');
  
  const deployOptions = {
    hostname: 'api.render.com',
    port: 443,
    path: `/v1/sites/${siteId}/deploys`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/zip',
      'Authorization': `Bearer ${RENDER_API_KEY}`
    }
  };
  
  const deployReq = https.request(deployOptions, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('Deployment initiated successfully!');
        console.log('Your website will be available at:');
        console.log(`https://${SITE_DOMAIN}`);
        console.log('\nThis website will run 24/7 with no "temporary preview" message.');
        console.log('The URL looks clean and professional.');
      } else {
        console.error('Failed to deploy site:', responseData);
      }
    });
  });
  
  deployReq.on('error', (error) => {
    console.error('Error deploying site:', error);
  });
  
  deployReq.write(zipFile);
  deployReq.end();
}

console.log('\nIMPORTANT: To complete the automatic deployment:');
console.log('1. Sign up for a free Render.com account');
console.log('2. Get your API key from the Render dashboard');
console.log('3. Run this script with your API key:');
console.log('   RENDER_API_KEY=your_api_key node deploy-to-render.js');
console.log('\nOnce deployed, your site will be available at:');
console.log(`https://${SITE_DOMAIN}`);