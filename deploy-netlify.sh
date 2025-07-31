#!/bin/bash

# CyberForget Frontend - Netlify Deployment Script
echo "🚀 Creating new Netlify project for CyberForget Frontend..."

# Create the new site with manual input
expect -c "
spawn netlify init
expect \"What would you like to do?\"
send \"\r\"
expect \"Create & configure a new project\"
send \"\033\[B\r\"
expect \"Team:\"
send \"\r\"
expect \"Site name\"
send \"cyberforget-frontend\r\"
expect \"Authorize\"
send \"Y\r\"
interact
" || {
    echo "Interactive setup failed, trying alternative deployment..."
    
    # Alternative: Direct drag-and-drop style deployment
    echo "🔄 Attempting direct deployment..."
    netlify deploy --dir=build --prod
}

echo "✅ Deployment complete!"
echo "🌐 Your CyberForget frontend is now live on Netlify!"