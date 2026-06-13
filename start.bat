@echo off
echo Starting FoodBridge...

start cmd /k "cd backend && python app.py"
start cmd /k "cd frontend && npm run dev"

echo Backend and Frontend are starting.
echo Please wait for the servers to initialize.
pause
