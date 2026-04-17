@echo off
REM Clear Python cache to ensure fresh import
echo Clearing Python cache...

REM Find and remove __pycache__ directories
for /d /r . %%d in (__pycache__) do @if exist "%%d" rmdir /s /q "%%d"

echo Clearing .pyc files...
for /r . %%f in (*.pyc) do @if exist "%%f" del /q "%%f"

echo Done! Cache cleared.
echo.
echo NEXT STEPS:
echo 1. Verify environment variables:
echo    set | findstr GEMINI
echo.
echo 2. Start FastAPI server:
echo    python -m uvicorn app:app --reload
echo.
echo 3. Check logs for:
echo    ^> GEMINI CONFIG: model=gemini-1.5-flash
echo    ^> GEMINI URL: https://...gemini-1.5-flash:generateContent
