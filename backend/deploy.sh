#!/bin/bash

# Deployment script for Jymo Backend
# Run this script on your Oracle Cloud VM

set -e

echo "🚀 Starting deployment..."

# Navigate to backend directory
cd /home/ubuntu/JYMO

echo "📦 Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "📥 Installing dependencies..."
npm ci --production

echo "🔄 Restarting application with PM2..."
pm2 restart jymo || pm2 start index.js --name jymo

echo "⏳ Waiting for app to start..."
sleep 5

echo "✅ Deployment complete!"
echo ""
echo "📊 PM2 status:"
pm2 status

echo ""
echo "🔍 Testing endpoint..."
if curl -s http://localhost:3003 | grep -q "Hello, World!"; then
    echo "✅ Application is healthy!"
else
    echo "⚠️  Health check failed. Check logs with: pm2 logs jymo"
fi

echo ""
echo "🎉 Done! Your backend has been deployed successfully."

