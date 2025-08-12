@echo off
REM Ir a la carpeta donde esta este .bat
cd /d "%~dp0"

REM Ejecutar el script Python
python ngrok.py

pause


