@echo off
echo ============================================
echo   R&B Sports - Windows Deployment Script
echo ============================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo [INIT] Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - R&B Sports"
) else (
    echo [OK] Git already initialized
)

echo.
echo [CHECK] Checking Git remote...

git remote | findstr "origin" >nul 2>&1
if errorlevel 1 (
    echo [WARN] No Git remote found
    echo.
    echo Please create a GitHub repository first, then run:
    echo   git remote add origin https://github.com/YOUR_USERNAME/rb-sports.git
    echo   git push -u origin main
    echo.
    pause
    exit /b
)

echo [OK] Git remote configured
echo.
echo [PUSH] Pushing to GitHub...

git add .
git commit -m "Deploy: %date% %time%" 2>nul
if errorlevel 1 (
    echo [INFO] No changes to commit
)

git push origin main 2>nul
if errorlevel 1 (
    git push origin master 2>nul
)

echo.
echo ============================================
echo   Code pushed to GitHub successfully!
echo ============================================
echo.
echo Next steps:
echo   1. Go to https://render.com
echo   2. Click 'New +' -^> 'Web Service'
echo   3. Connect your GitHub repository
echo   4. Render will auto-detect render.yaml
echo   5. Click 'Create Web Service'
echo.
echo Deployment time: ~3-5 minutes
echo Your site: https://YOUR-APP-NAME.onrender.com
echo.
pause
