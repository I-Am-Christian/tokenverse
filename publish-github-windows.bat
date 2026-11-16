@echo off
setlocal
cd /d "%~dp0"
set "REPO=I-Am-Christian/Tokenverse"
where git >nul 2>nul
if errorlevel 1 (
    echo Git is required. Install it from https://git-scm.com/downloads
    pause
    exit /b 1
)
where gh >nul 2>nul
if errorlevel 1 (
    echo GitHub CLI is required. Install it from https://cli.github.com/
    pause
    exit /b 1
)
gh auth status >nul 2>nul
if errorlevel 1 (
    echo Log in to GitHub in the browser when prompted.
    gh auth login
    if errorlevel 1 exit /b 1
)
if not exist ".git" (
    git init -b main
    if errorlevel 1 exit /b 1
)
git add -A
if errorlevel 1 exit /b 1
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "Initial Tokenverse multiplayer game source"
    if errorlevel 1 (
        echo Git commit failed. Configure your name and email using git config and retry.
        pause
        exit /b 1
    )
)
gh repo view "%REPO%" >nul 2>nul
if errorlevel 1 (
    echo Creating a new private GitHub repository: %REPO%
    gh repo create "%REPO%" --private --source . --remote origin --push
    if errorlevel 1 (
        echo Repository creation or upload failed. Check account permissions and retry.
        pause
        exit /b 1
    )
) else (
    echo Repository already exists. Configuring remote and pushing project.
    git remote get-url origin >nul 2>nul
    if errorlevel 1 git remote add origin "https://github.com/%REPO%.git"
    git branch -M main
    git push -u origin main
    if errorlevel 1 (
        echo Push failed. Check the existing repository and your permissions.
        pause
        exit /b 1
    )
)
echo.
echo Published to https://github.com/%REPO%
pause