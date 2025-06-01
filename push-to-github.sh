#!/bin/bash

echo "🚀 Pushing BOLES Smart Home Platform to GitHub..."
echo ""

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Code pushed to GitHub!"
    echo ""
    echo "📍 Repository URL:"
    echo "   https://github.com/mostiock/boles-smart-home-platform-v2"
    echo ""
    echo "🏷️ Don't forget to add these topics to your repository:"
    echo "   nextjs, typescript, ecommerce, smart-home, admin-dashboard"
    echo "   clerk-auth, supabase, tailwindcss, shadcn-ui, email-notifications"
    echo ""
    echo "🎯 Your repository includes:"
    echo "   ✅ Complete Next.js 15 application"
    echo "   ✅ Clerk authentication system"
    echo "   ✅ Admin panel with access control"
    echo "   ✅ Email notification system"
    echo "   ✅ Supabase database integration"
    echo "   ✅ 37+ smart home products"
    echo "   ✅ Comprehensive documentation"
    echo ""
else
    echo ""
    echo "❌ Push failed. Make sure you:"
    echo "1. Created the repository on GitHub"
    echo "2. Repository name is: boles-smart-home-platform-v2"
    echo "3. You have access to push to the repository"
fi
