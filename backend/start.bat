@echo off
setlocal

start "LanguageStudio content service" cmd /k "cd /d ""%~dp0service"" && npm start"
start "LanguageStudio auth service" cmd /k "cd /d ""%~dp0auth-service"" && npm start"
start "LanguageStudio gateway" cmd /k "cd /d ""%~dp0gateway"" && npm start"

echo LanguageStudio services started. Open http://localhost:3005/
