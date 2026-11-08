@echo off
title AI Resource Hub - One-Click Cloud Sync
echo ========================================================
echo   AI Resource Hub - Auto Build and Cloud Sync
echo ========================================================
echo.

echo [1/3] Compiling and bundling latest code into index.html...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed. Please check build errors above.
    pause
    exit /b 1
)

echo.
echo [2/3] Committing changes to local Git...
cd /d "%~dp0"
git add .
git commit -m "Update AI Resource Hub: %DATE% %TIME%"

echo.
echo [3/3] Pushing to GitHub (git push -u origin main)...
git push -u origin main
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================================
    echo [ERROR] Git push did not succeed.
    echo Common reasons:
    echo 1. Network timeout connecting to GitHub (try again or check proxy)
    echo 2. GitHub authorization dialog needs approval
    echo ========================================================
    pause
    exit /b 1
)

echo.
echo ========================================================
echo [SUCCESS] Pushed to GitHub successfully!
echo Cloud hosting (Vercel / GitHub Pages) will update in 20s.
echo ========================================================
echo.
pause
