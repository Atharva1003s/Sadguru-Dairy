@echo off
title Sadguru Dairy Operator App (सद्गुरू दुग्धालय)
echo ============================================================
echo   सद्गुरू दुग्धालय - दैनिक दूध रतीब व्यवस्थापन ॲप
echo   SADGURU DAIRY OPERATOR / OWNER DASHBOARD
echo ============================================================
echo.
echo Starting Backend Server on http://localhost:5000 ...
start "Sadguru Dairy Backend" cmd /k "cd server && npm start"

echo Starting Frontend Web App on http://localhost:5173 ...
start "Sadguru Dairy Frontend" cmd /k "cd client && npx vite --host"

echo.
echo ============================================================
echo   Application is launching!
echo   Dairy Operator Web Portal: http://localhost:5173
echo   Operator Login: Username = admin   Password = admin
echo ============================================================
echo.
pause
