@echo off
cd /d %~dp0
set JWT_SECRET=dev-secret-change-me-0123456789
start /b cmd /c "node dist/system/server.js" > server.log 2>&1
echo SERVER_LAUNCHED
exit /b 0
