@echo off
echo Starting RAG Chatbot Application...

REM Start the backend API
start cmd /k "python api.py"

REM Wait a moment for the backend to initialize
timeout /t 3

REM Navigate to React app directory and start it
cd react-chatbot
start cmd /k "npm start"

echo Both backend and frontend have been started!
echo Backend API: http://localhost:8000
echo Frontend UI: http://localhost:3000 