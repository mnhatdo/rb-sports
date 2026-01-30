@echo off
REM Quick GitHub Push Script for Windows

echo ========================================
echo    R&B SPORTS - QUICK DEPLOY TO GITHUB
echo ========================================
echo.
echo Ban can lam 2 buoc:
echo.
echo 1. Tao repo moi tren GitHub:
echo    -^> Truy cap: https://github.com/new
echo    -^> Ten goi y: rb-sports hoac redbull-sports
echo    -^> Chon Public hoac Private
echo    -^> KHONG tao README (da co san)
echo.
set /p REPO_URL="2. Nhap URL repo GitHub (vi du: https://github.com/username/rb-sports.git): "
echo.

if "%REPO_URL%"=="" (
    echo X Loi: URL khong duoc de trong!
    pause
    exit /b 1
)

echo Dang push code len GitHub...
git remote add origin "%REPO_URL%" 2>nul || git remote set-url origin "%REPO_URL%"
git branch -M main
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    OK PUSH THANH CONG!
    echo ========================================
    echo.
    echo Buoc tiep theo:
    echo 1. Truy cap: https://render.com
    echo 2. Dang ky/Login bang GitHub
    echo 3. New Web Service -^> Chon repo vua push
    echo 4. Config:
    echo    - Build: npm install
    echo    - Start: npm start
    echo    - Instance: Free
    echo 5. Click Deploy!
    echo.
    echo Chi tiet xem file DEPLOY_NOW.md
    echo.
) else (
    echo.
    echo ========================================
    echo    X LOI KHI PUSH
    echo ========================================
    echo.
    echo Kiem tra:
    echo - URL repo co dung khong?
    echo - Ban da dang nhap Git chua?
    echo - Chay: git config --global user.name "Your Name"
    echo - Chay: git config --global user.email "your@email.com"
    echo.
)

pause
