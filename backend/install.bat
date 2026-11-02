@echo off
setlocal

for %%S in (content-db service auth-service gateway) do (
    pushd "%~dp0%%S"
    if errorlevel 1 exit /b 1
    call npm install
    if errorlevel 1 (
        popd
        exit /b 1
    )
    popd
)

exit /b 0
