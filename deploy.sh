#!/bin/bash

echo "🚀 Starting deployment to Vercel..."
echo "📦 Committing latest changes..."

# Add and commit any changes
git add .
git commit -m "Updated Vercel configuration with unique project name" --allow-empty

# Push to GitHub
echo "📤 Pushing to GitHub repository..."
git push

# Deploy to Vercel with specific project name
echo "🌐 Deploying to Vercel with project name: boles-smart-shop-wallet"
npx vercel --name boles-smart-shop-wallet

echo "✅ Deployment script completed"
