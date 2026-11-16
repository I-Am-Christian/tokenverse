@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo Node.js is required. Install Node.js 20+ from https://nodejs.org/
 pause
 exit /b 1
)
echo Starting TOKENVERSE multiplayer at http://localhost:3000
start "TOKENVERSE" "http://localhost:3000"
node server.js
pause