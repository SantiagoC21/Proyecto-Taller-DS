@echo off
cd /d "%~dp0.."
cd server
call proyecto-c\Scripts\activate
echo Ejecutando servidor Flask...
python app.py
echo.
echo El servidor ha finalizado o ocurrió un error.
pause