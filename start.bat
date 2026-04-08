@echo off
 title PortfolioPilot Dashboard
cd /d "%~dp0"
echo Starting PortfolioPilot...
start "" http://localhost:8000
.\venv\Scripts\python.exe main.py
