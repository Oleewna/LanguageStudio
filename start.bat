@echo off
setlocal EnableExtensions
cd /d "%~dp0"

rem Remove stale duplicate launchers so this is the single root start entry point.
if exist "%~dp0backend\install.bat" del /f /q "%~dp0backend\install.bat"
if exist "%~dp0backend\start.bat" del /f /q "%~dp0backend\start.bat"
if exist "%~dp0backend\service\install.bat" del /f /q "%~dp0backend\service\install.bat"
if exist "%~dp0backend\service\start_server.bat" del /f /q "%~dp0backend\service\start_server.bat"

echo Starting LanguageStudio services...
start "LanguageStudio content service" cmd /k "cd /d ""%~dp0backend\service"" && npm start"
start "LanguageStudio auth service" cmd /k "cd /d ""%~dp0backend\auth-service"" && npm start"
start "LanguageStudio gateway" cmd /k "cd /d ""%~dp0backend\gateway"" && npm start"

echo.
echo All services are starting.
echo Open: http://localhost:3005/
exit /b 0
