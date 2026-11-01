pushd "%~dp0"
if errorlevel 1 exit /b 1

node src\server.js
set "exitCode=%ERRORLEVEL%"

popd
exit /b %exitCode%