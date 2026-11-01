@echo off

pushd "%~dp0"
if errorlevel 1 exit /b 1

call npm install
set "exitCode=%ERRORLEVEL%"

popd
exit /b %exitCode%