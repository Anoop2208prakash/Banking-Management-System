@echo off
title Anoop Industry Bank - System Orchestrator
color 0b

echo ---------------------------------------------------------
echo   🏦 ANOOP INDUSTRY BANK: SYSTEM INITIALIZATION
echo ---------------------------------------------------------

:: 1. Auto-activate the virtual environment
echo 🔍 Verifying Virtual Environment...
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    echo ✅ Environment Active.
) else (
    echo ❌ Error: Virtual environment not found.
)

:: 2. Launch the Python Orchestrator
echo 🚀 Launching FastAPI Backend and Vite Frontend...
python start_project.py

pause