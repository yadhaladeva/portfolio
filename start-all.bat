@echo off
title Deva Yadhala Portfolio Launcher
echo ===================================================
echo   Starting Deva Yadhala Portfolio Application
echo ===================================================
echo.

echo [1/2] Launching Spring Boot Backend on http://localhost:8080 ...
start "Portfolio Backend (Spring Boot)" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo [2/2] Launching Vite Frontend on http://localhost:5173 ...
start "Portfolio Frontend (React Vite)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo ===================================================
echo  Both services launched in separate windows!
echo  - Frontend: http://localhost:5173
echo  - Backend / Swagger: http://localhost:8080/swagger-ui.html
echo ===================================================
pause
