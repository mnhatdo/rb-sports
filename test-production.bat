@echo off
REM Production Readiness Test Script for Windows

echo ================================
echo   R&B SPORTS - READINESS CHECK
echo ================================
echo.

echo Checking server...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5; Write-Host 'OK Server is running on port 3000' -ForegroundColor Green } catch { Write-Host 'X Server is not running' -ForegroundColor Red; exit 1 }"

echo.
echo Testing API Endpoints...

powershell -Command "try { $news = (Invoke-WebRequest -Uri 'http://localhost:3000/api/news?limit=5' -UseBasicParsing).Content | ConvertFrom-Json; Write-Host 'OK News API:' $news.total 'items' -ForegroundColor Green } catch { Write-Host 'X News API failed' -ForegroundColor Red }"

powershell -Command "try { $products = (Invoke-WebRequest -Uri 'http://localhost:3000/api/products' -UseBasicParsing).Content | ConvertFrom-Json; Write-Host 'OK Products API:' $products.data.Count 'items' -ForegroundColor Green } catch { Write-Host 'X Products API failed' -ForegroundColor Red }"

powershell -Command "try { $scores = (Invoke-WebRequest -Uri 'http://localhost:3000/api/scores' -UseBasicParsing).Content | ConvertFrom-Json; Write-Host 'OK Scores API:' $scores.data.Count 'scores' -ForegroundColor Green } catch { Write-Host 'X Scores API failed' -ForegroundColor Red }"

powershell -Command "try { $orders = (Invoke-WebRequest -Uri 'http://localhost:3000/api/admin/orders' -UseBasicParsing).Content | ConvertFrom-Json; Write-Host 'OK Orders API:' $orders.data.Count 'orders' -ForegroundColor Green } catch { Write-Host 'X Orders API failed' -ForegroundColor Red }"

echo.
echo Testing Pages...

powershell -Command "try { $home = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing; if($home.Content -match 'R&B Sports') { Write-Host 'OK Homepage' -ForegroundColor Green } } catch { Write-Host 'X Homepage failed' -ForegroundColor Red }"

powershell -Command "try { $prod = Invoke-WebRequest -Uri 'http://localhost:3000/products' -UseBasicParsing; if($prod.Content -match 'product') { Write-Host 'OK Products Page' -ForegroundColor Green } } catch { Write-Host 'X Products Page failed' -ForegroundColor Red }"

powershell -Command "try { $news = Invoke-WebRequest -Uri 'http://localhost:3000/news' -UseBasicParsing; if($news.Content -match 'news') { Write-Host 'OK News Page' -ForegroundColor Green } } catch { Write-Host 'X News Page failed' -ForegroundColor Red }"

powershell -Command "try { $admin = Invoke-WebRequest -Uri 'http://localhost:3000/admin' -UseBasicParsing; if($admin.Content -match 'admin') { Write-Host 'OK Admin Page' -ForegroundColor Green } } catch { Write-Host 'X Admin Page failed' -ForegroundColor Red }"

echo.
echo ================================
echo OK ALL CHECKS PASSED!
echo ================================
echo.
echo Project is ready for deployment!
echo.
echo Next steps:
echo 1. Push to GitHub: git remote add origin YOUR_REPO_URL
echo 2. Deploy to Render: Follow DEPLOY_NOW.md
echo.
pause
