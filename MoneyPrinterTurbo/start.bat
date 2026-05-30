@echo off
chcp 65001 >nul
cd /d "C:\Users\su'fa'ce\MoneyPrinterTurbo"
set BROWSER=none
echo ============================================
echo   MoneyPrinterTurbo WebUI 启动中...
echo ============================================
echo.
call venv\Scripts\streamlit run webui\Main.py --server.port 8501
pause
