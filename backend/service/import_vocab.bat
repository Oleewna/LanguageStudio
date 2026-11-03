@echo off
setlocal
cd /d "%~dp0"
node ..\..\scripts\import-vocab.mjs %*
