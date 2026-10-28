@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-project.ps1"
if errorlevel 1 (
  echo Kindred could not start. See the message above.
  pause
  exit /b 1
)
endlocal
