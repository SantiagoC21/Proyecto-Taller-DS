@echo off
cd /d "%~dp0"
cd client
call npm install
start cmd /k "npm run dev"