@echo off
:: 🌐 Enable UTF-8 for Emoji Support
chcp 65001 > nul
title Anoop Industry Bank - System Orchestrator
color 0b

echo ---------------------------------------------------------
echo   🏛️ [LuBank] ANOOP INDUSTRY BANK: SYSTEM INITIALIZATION
echo ---------------------------------------------------------

:: 1. Auto-activate the virtual environment
echo 🛡️ [LuShieldCheck] Verifying Virtual Environment...
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    echo ✅ [LuCheckCircle] Environment Active.
) else (
    echo ⚠️ [LuAlertTriangle] Error: Virtual environment not found.
)

:: 2. Launch the Python Orchestrator and KEEP window open
echo 🚀 [LuTerminal] Launching FastAPI Backend and Vite Frontend...
:: --- 🏦 Anoop Industry Bank: System Launch Sequence ---

:: 🎯 Use 'cmd /k' to ensure the window doesn't close on Ctrl+C
python start_project.py || cmd /k