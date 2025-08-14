@echo off
title Ejecutor Maestro (paralelo en PowerShell)
setlocal

rem Carpeta del maestro (con barra final)
set "ROOT=%~dp0"
cd /d "%ROOT%"

echo ==========================================
echo  Lanzando scripts en ventanas separadas...
echo  (cada uno quedara abierto al terminar)
echo ==========================================
echo.

rem -- Backend --
start "Backend" powershell -NoLogo -NoExit -Command "cmd /k \"\"\"%ROOT%exec\backend.bat\"\"\""
timeout /t 3 /nobreak >nul

rem -- Ngrok --
start "Ngrok" powershell -NoLogo -NoExit -Command "cmd /k \"\"\"%ROOT%exec\ngrokPublic.bat\"\"\""
timeout /t 3 /nobreak >nul

rem -- Frontend --
start "Frontend" powershell -NoLogo -NoExit -Command "cmd /k \"\"\"%ROOT%exec\frontend.bat\"\"\""

echo.
echo Todos los scripts fueron lanzados. El maestro no esperara a que finalicen.
exit /b
