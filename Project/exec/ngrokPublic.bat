@echo off
REM Ir a la carpeta donde esta este .bat
cd /d "%~dp0"

REM Ejecutar el script Python
python start_ngrok.py

pause


