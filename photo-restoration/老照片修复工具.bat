@echo off
chcp 65001 >nul 2>&1
title 孝心帮 · 老照片修复

:: ── 拿到拖进来的文件路径 ──
set FILE=%1
set FILE=%FILE:"=%

:: ── 如果没拖文件，引导用户 ──
if "%FILE%"=="" goto usage

:: ── 检查文件存在 ──
if not exist "%FILE%" (
    echo [错误] 找不到这个文件：%FILE%
    echo.
    echo 直接把照片拖到本图标上！
    pause
    exit /b 1
)

:: ── 显示信息 ──
cls
echo ╔══════════════════════════════════════╗
echo ║     孝心帮 · 老照片AI修复 v2.0      ║
echo ╚══════════════════════════════════════╝
echo.
echo  照片：%FILE%

:: ── 设置输出路径 ──
set OUTFOLDER=%~dp0..\..\restored_photos
if not exist "%OUTFOLDER%" mkdir "%OUTFOLDER%"

for %%f in ("%FILE%") do set OUTNAME=%%~nf
set OUTFILE=%OUTFOLDER%\%OUTNAME%_已修复.jpg

echo  输出：%OUTFILE%
echo.

:: ── 找 Python ──
set VENV_DIR=%~dp0..\..\venv_photo
set PYTHON=%VENV_DIR%\Scripts\python.exe
set SCRIPT=%~dp0photo_restoration_agent.py

:: ── 首次安装 ──
if not exist "%PYTHON%" (
    echo [首次运行] 正在安装环境...
    cd /d %~dp0..\..
    python -m venv venv_photo
    call "%VENV_DIR%\Scripts\activate.bat"
    pip install --quiet torch torchvision --index-url https://download.pytorch.org/whl/cpu
    pip install --quiet opencv-python pillow numpy gfpgan realesrgan basicsr facexlib
)

:: ── 开始修复 ──
echo  正在修复中，请稍等...
echo  首次运行需要下载AI模型，约1-2分钟
echo.

"%PYTHON%" "%SCRIPT%" -i "%FILE%" -o "%OUTFILE%" -m auto

:: ── 检查结果 ──
if errorlevel 1 (
    echo.
    echo [出错] 修复失败了，图片可能有问题
    pause
    exit /b 1
)

:: ── 完成 ──
echo.
echo ╔══════════════════════════════════════╗
echo ║       修复完成！                     ║
echo ╚══════════════════════════════════════╝
echo.
echo  输出：%OUTFILE%
echo.
start "" "%OUTFOLDER%"
echo  已自动打开输出文件夹
echo.
pause
exit /b 0

:usage
cls
echo ╔══════════════════════════════════════╗
echo ║     孝心帮 · 老照片AI修复 v2.0      ║
echo ╚══════════════════════════════════════╝
echo.
echo  使用方法：
echo.
echo    把老照片直接拖到本文件图标上！
echo.
echo    或者打开终端运行：
echo    python photo_restoration_agent.py -i 照片路径 -o 输出路径
echo.
pause
