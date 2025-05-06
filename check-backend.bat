@echo off
echo Checking backend status...

REM Check if backend container is running
docker ps | findstr "backend"
if %ERRORLEVEL% NEQ 0 (
    echo Error: Backend container is not running!
    echo Starting backend container...
    docker-compose up -d backend
    timeout /t 10
)

REM Check backend logs for errors
echo.
echo Backend logs (last 20 lines):
echo -------------------------------
docker-compose logs --tail=20 backend

REM Check database connection
echo.
echo Testing database connection from backend...
echo -----------------------------------------
docker-compose exec backend php artisan db:monitor

REM Check if migrations were run successfully
echo.
echo Checking migrations status...
echo -------------------------------
docker-compose exec backend php artisan migrate:status

echo.
echo If you see any errors above, try restarting all services with:
echo docker-compose down
echo docker-compose up -d

pause 