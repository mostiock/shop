#!/bin/bash

# BOLES Smart Home Platform - Fresh GitHub Repository Setup
echo "🚀 BOLES Smart Home Platform - GitHub Repository Creation"
echo "========================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Display project info
echo "📋 PROJECT INFORMATION:"
echo "Name: BOLES Smart Home Platform"
echo "Description: Complete e-commerce platform for smart home devices with admin panel"
echo "Tech Stack: Next.js 15, TypeScript, Tailwind CSS, Clerk Auth, Supabase"
echo "Features: Authentication, Admin Panel, Email System, Product Management"
echo ""

echo "🔧 REPOSITORY SETUP OPTIONS:"
echo "1. Create a new public repository (recommended)"
echo "2. Create a new private repository"
echo ""

read -p "Choose option (1 or 2): " repo_option

case $repo_option in
    1)
        repo_visibility="public"
        ;;
    2)
        repo_visibility="private"
        ;;
    *)
        echo "Invalid option. Using public repository."
        repo_visibility="public"
        ;;
esac

echo ""
echo "📝 STEP 1: Create Repository on GitHub"
echo "-------------------------------------"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: boles-smart-home-platform-v2"
echo "3. Description: Complete e-commerce platform for smart home devices with comprehensive admin dashboard, authentication, and email notifications"
echo "4. Set visibility: $repo_visibility"
echo "5. ❌ Do NOT initialize with README (we have our own)"
echo "6. ❌ Do NOT add .gitignore (we have our own)"
echo "7. ❌ Do NOT choose a license (we have MIT)"
echo "8. Click 'Create repository'"
echo ""

read -p "Press Enter after creating the repository on GitHub..."

echo ""
read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

repo_name="boles-smart-home-platform-v2"
repo_url="https://github.com/$github_username/$repo_name.git"

echo ""
echo "🔗 STEP 2: Configure Git Repository"
echo "-----------------------------------"

# Add remote origin
echo "Adding remote origin: $repo_url"
git remote add origin "$repo_url"

# Rename branch to main
echo "Renaming branch to main..."
git branch -M main

echo ""
echo "📤 STEP 3: Push to GitHub"
echo "------------------------"
echo "Pushing code to GitHub..."
echo "You may be prompted for your GitHub credentials..."
echo ""

# Push to GitHub
if git push -u origin main; then
    echo ""
    echo "🎉 SUCCESS! Repository created and code pushed!"
    echo ""
    echo "📍 Your repository is now available at:"
    echo "   https://github.com/$github_username/$repo_name"
    echo ""
    echo "🏷️ RECOMMENDED: Add repository topics"
    echo "Go to your repository settings and add these topics:"
    echo "nextjs, typescript, ecommerce, smart-home, admin-dashboard,"
    echo "clerk-auth, supabase, tailwindcss, shadcn-ui, email-notifications"
    echo ""
    echo "📁 Repository Contents:"
    echo "• Complete Next.js 15 application"
    echo "• Authentication system with Clerk"
    echo "• Admin panel with role-based access"
    echo "• Email notification system"
    echo "• Supabase database integration"
    echo "• 37+ smart home products"
    echo "• Comprehensive documentation"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Set up environment variables for deployment"
    echo "2. Configure Supabase and Clerk for production"
    echo "3. Deploy to Vercel or Netlify"
    echo "4. Test the complete application flow"
    echo ""
    echo "📚 Documentation locations:"
    echo "• README.md - Main documentation"
    echo "• .same/ folder - Detailed guides and setup instructions"
    echo "• DEPLOYMENT.md - Deployment instructions"
    echo "• FEATURES.md - Feature overview"
    echo ""
else
    echo ""
    echo "❌ Error occurred during push. Please check:"
    echo "1. Repository was created correctly on GitHub"
    echo "2. Repository name matches: $repo_name"
    echo "3. You have access to the repository"
    echo "4. Your GitHub credentials are correct"
    echo ""
    echo "Manual push command:"
    echo "git push -u origin main"
fi

echo ""
echo "🏆 BOLES Smart Home Platform is ready for the world!"
