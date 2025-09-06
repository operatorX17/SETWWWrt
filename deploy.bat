@echo off
setlocal enabledelayedexpansion

echo.
echo 🔥 OG MERCH STORE - DEPLOYMENT SCRIPT 🔥
echo ===========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not available. Please ensure Docker Desktop is running.
    pause
    exit /b 1
)

echo [INFO] Docker and Docker Compose are available
echo.

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "backend\logs" mkdir "backend\logs"
if not exist "frontend\build" mkdir "frontend\build"

REM Check if .env file exists for backend
if not exist "backend\.env" (
    echo [WARNING] Backend .env file not found. Copying from template...
    copy "backend\.env.production" "backend\.env"
    echo [WARNING] Please edit backend\.env with your actual configuration values
    echo.
)

REM Stop any existing containers
echo [INFO] Stopping existing containers...
docker-compose down --remove-orphans

REM Build and start services
echo [INFO] Building and starting services...
docker-compose build --no-cache
if errorlevel 1 (
    echo [ERROR] Failed to build containers. Check the output above.
    pause
    exit /b 1
)

docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start containers. Check the output above.
    pause
    exit /b 1
)

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 15 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    echo [ERROR] Some services failed to start. Check logs with: docker-compose logs
    pause
    exit /b 1
)

echo.
echo 🎉 DEPLOYMENT SUCCESSFUL! 🎉
echo =========================
echo Frontend: http://localhost
echo Backend API: http://localhost:8000
echo Backend Health: http://localhost:8000/health
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.

REM Show running containers
echo [INFO] Running containers:
docker-compose ps

echo.
echo [INFO] Deployment completed successfully! 🚀
echo.
pause