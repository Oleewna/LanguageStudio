@echo off
setlocal EnableExtensions
title LanguageStudio ngrok Tunnel
cd /d "%~dp0"

rem 1. Read NGROK_DOMAIN from environment if set
if not "%NGROK_DOMAIN%"=="" goto :clean_domain

rem 2. Read NGROK_DOMAIN from backend\.env
if exist "%~dp0backend\.env" (
    for /f "usebackq tokens=1,* delims==" %%A in ("%~dp0backend\.env") do (
        if /i "%%A"=="NGROK_DOMAIN" set "NGROK_DOMAIN=%%B"
    )
)

if not "%NGROK_DOMAIN%"=="" goto :clean_domain

rem 3. Read NGROK_DOMAIN from backend\service\.env
if exist "%~dp0backend\service\.env" (
    for /f "usebackq tokens=1,* delims==" %%A in ("%~dp0backend\service\.env") do (
        if /i "%%A"=="NGROK_DOMAIN" set "NGROK_DOMAIN=%%B"
    )
)

:clean_domain
if not "%NGROK_DOMAIN%"=="" (
    set "NGROK_DOMAIN=%NGROK_DOMAIN:"=%"
    set "NGROK_DOMAIN=%NGROK_DOMAIN: =%"
)

if not "%NGROK_DOMAIN%"=="" goto :run_ngrok

rem 4. Prompt interactively if missing
echo ========================================================
echo   LanguageStudio ngrok Tunnel
echo ========================================================
echo.
echo NGROK_DOMAIN is not set in backend\.env or in your environment.
echo.
set /p "INPUT_DOMAIN=Enter your ngrok domain (e.g. my-subdomain.ngrok-free.app): "

if defined INPUT_DOMAIN (
    set "INPUT_DOMAIN=%INPUT_DOMAIN:"=%"
    set "INPUT_DOMAIN=%INPUT_DOMAIN: =%"
)

if not "%INPUT_DOMAIN%"=="" (
    set "NGROK_DOMAIN=%INPUT_DOMAIN%"
    echo.
    echo Saving NGROK_DOMAIN and PUBLIC_URL to backend\.env...
    if not exist "%~dp0backend\.env" type nul > "%~dp0backend\.env"
    echo NGROK_DOMAIN=%INPUT_DOMAIN%>> "%~dp0backend\.env"
    echo PUBLIC_URL=https://%INPUT_DOMAIN%>> "%~dp0backend\.env"
    echo Saved to backend\.env.
    echo.
    goto :run_ngrok
)

echo.
echo ========================================================
echo   [ERROR] NGROK_DOMAIN is not set.
echo ========================================================
echo To use the ngrok tunnel, please define your ngrok domain
echo in backend\.env or set it as an environment variable.
echo.
echo Example line for backend\.env:
echo   NGROK_DOMAIN=my-subdomain.ngrok-free.app
echo.
pause
exit /b 1

:run_ngrok
where ngrok >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] 'ngrok' was not found on your system PATH.
    echo Please install ngrok or add it to PATH.
    echo Download: https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

echo Starting ngrok tunnel for %NGROK_DOMAIN% on port 3005...
echo Target: http://localhost:3005
echo Press Ctrl+C in this window to stop the tunnel.
echo.
ngrok http --url=%NGROK_DOMAIN% 3005

if errorlevel 1 (
    echo.
    echo [ERROR] ngrok exited with an error. Check output above.
    pause
)
