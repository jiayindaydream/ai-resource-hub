@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title AI Resource Hub - 一键自动打包与云端同步
echo ========================================================
echo   AI Resource Hub · 一键更新与自动部署同步工具
echo ========================================================
echo.

echo [1/3] 正在自动重新编译最新代码到 index.html...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
if %ERRORLEVEL% neq 0 (
    echo [错误] 编译失败，请检查报错信息。
    pause
    exit /b 1
)

echo.
echo [2/3] 正在检测本地修改并提交到 Git...
cd /d "%~dp0"
git add .

git diff --cached --quiet
if %ERRORLEVEL% equ 0 (
    echo [提示] 本地代码暂无新增变动。
) else (
    set "COMMIT_MSG="
    set /p "COMMIT_MSG=请输入更新说明（直接按回车将使用默认记录）: "
    if "!COMMIT_MSG!"=="" (
        set "COMMIT_MSG=Update AI Resource Hub: %date% %time%"
    )
    git commit -m "!COMMIT_MSG!"
)

echo.
echo [3/3] 正在推送到云端仓库 (git push)...
git push
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================================
    echo [提示] 推送未成功或尚未关联远程仓库！
    echo 如果您是第一次使用，请先在终端关联您的 GitHub 仓库：
    echo   git remote add origin https://github.com/您的用户名/仓库名.git
    echo   git push -u origin main
    echo ========================================================
    pause
    exit /b 1
)

echo.
echo ========================================================
echo [成功] 代码已成功推送到云端！
echo 托管平台 (Vercel / GitHub Pages) 将在 15~30 秒内自动完成部署。
echo 任何人刷新链接即可看到您刚才修改的最新内容！
echo ========================================================
echo.
pause
