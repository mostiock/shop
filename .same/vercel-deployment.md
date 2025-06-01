# Deploying to Vercel

This guide provides instructions for deploying the BOLES Smart Shop e-commerce platform (with wallet payment integration) to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/signup) (for easiest deployment)

## Deployment Steps

### Option 1: Direct from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   cd boles-smart-shop
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Vercel will automatically detect Next.js configuration

3. **Configure Environment Variables**
   - In the "Environment Variables" section, add the following:
     ```
     # Authentication (Required)
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
     CLERK_SECRET_KEY=sk_test_your_key_here

     # App Configuration
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd boles-smart-shop
   vercel
   ```

3. **Follow the prompts to configure your project**
   - Link to existing project or create a new one
   - Set up environment variables
   - Choose deployment options

## Post-Deployment

After deployment, verify the following:

1. **Test Authentication**
   - Sign in and sign up functionality
   - User profile access

2. **Test Wallet Functionality**
   - Wallet balance display in header
   - Top-up functionality
   - Using wallet for payment

3. **Test Order Flow**
   - Adding products to cart
   - Checkout process
   - Order confirmation

## Custom Domain

To set up a custom domain:

1. Go to the Vercel Dashboard > Your Project
2. Click on "Settings" > "Domains"
3. Add your custom domain and follow the verification instructions

## Troubleshooting

If you encounter issues during deployment:

1. **Build Errors**
   - Check Vercel build logs for specific errors
   - Ensure all environment variables are set correctly

2. **Authentication Issues**
   - Verify Clerk API keys are correct
   - Check the Clerk dashboard for configuration issues

3. **Wallet Payment Issues**
   - Verify localStorage persistence is working correctly
   - Test wallet balance updates

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Clerk Authentication Documentation](https://clerk.com/docs)
