@echo off
setlocal EnableExtensions
cd /d "%~dp0"

rem Remove stale duplicate launchers so this is the single root install entry point.
if exist "%~dp0backend\install.bat" del /f /q "%~dp0backend\install.bat"
if exist "%~dp0backend\start.bat" del /f /q "%~dp0backend\start.bat"
if exist "%~dp0backend\service\install.bat" del /f /q "%~dp0backend\service\install.bat"
if exist "%~dp0backend\service\start_server.bat" del /f /q "%~dp0backend\service\start_server.bat"

for %%D in (
  "%~dp0backend\content-db"
  "%~dp0backend\service"
  "%~dp0backend\auth-service"
  "%~dp0backend\gateway"
) do (
  echo.
  echo Installing in %%~D
  pushd "%%~D"
  call npm install
  if errorlevel 1 (
    echo Failed to install dependencies in %%~D
    popd
    exit /b 1
  )
  popd
)

echo.
echo Initializing the content database...
pushd "%~dp0backend\content-db"
call npm run db:setup
if errorlevel 1 (
  echo Database setup failed.
  popd
  exit /b 1
)
popd

echo.
echo Dependencies installed and database initialized.
exit /b 0
