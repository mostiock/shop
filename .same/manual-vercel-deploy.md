# Manual Vercel Deployment Guide

Follow these steps to manually deploy your project to Vercel with a unique project name:

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Visit the Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com/) and sign in

2. **Import Your Repository**
   - Click "Add New" → "Project"
   - Select your GitHub account and find the "shop" repository
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: Enter a unique name like `boles-smart-shop-wallet` or `smart-shop-ecommerce`
   - **Framework Preset**: Select "Next.js"
   - **Root Directory**: Leave as `.` (default)

4. **Set Environment Variables** (if needed)
   - Add any required environment variables in the "Environment Variables" section

5. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment to complete

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI globally**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   - Follow the authentication flow in your browser

3. **Deploy with a unique name**
   ```bash
   cd boles-smart-shop
   vercel --name your-unique-project-name
   ```
   - Replace `your-unique-project-name` with a name that hasn't been used before

4. **Follow the prompts**
   - Confirm the settings when prompted
   - Wait for deployment to complete

## After Deployment

Once deployment is successful:

1. **Visit Your Live Site**
   - Click the deployment URL provided by Vercel

2. **Set Up Custom Domain** (Optional)
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add and configure your custom domain

3. **Monitor Performance**
   - Check Vercel Analytics for performance insights
   - Make sure wallet payment features are working correctly

## Troubleshooting

- **"Project name already exists" error**: Choose a different, unique project name
- **Build failures**: Check your build logs for specific errors
- **Environment variable issues**: Ensure all required variables are set correctly

Your project should now be successfully deployed with a unique name!
