#!/bin/bash

echo "🚀 R&B Sports - Deployment Script"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - R&B Sports"
else
    echo "✓ Git already initialized"
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo ""
    echo "⚠️  No Git remote found"
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/rb-sports.git"
    echo "git push -u origin main"
else
    echo "✓ Git remote configured"
    echo ""
    echo "📤 Pushing to GitHub..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
    git push origin main || git push origin master
fi

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Render will auto-detect settings from render.yaml"
echo "5. Click 'Create Web Service'"
echo ""
echo "⏱️  Deployment will take ~3-5 minutes"
echo "🌐 Your site will be live at: https://YOUR-APP-NAME.onrender.com"
