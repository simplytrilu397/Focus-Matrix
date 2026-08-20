@echo off
echo ===================================================
echo   FocusMatrix - Google Cloud / Firebase Deployment
echo ===================================================
echo.

echo [1/3] Checking Firebase Authentication...
call npx -y firebase-tools@latest login
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Login was cancelled or failed. Please try again.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Linking Firebase Project...
call npx -y firebase-tools@latest use --add

echo.
echo [3/3] Deploying Hosting & Firestore Rules to Google Cloud...
call npx -y firebase-tools@latest deploy

echo.
echo ===================================================
echo   Deployment Complete! Your site is live on Cloud.
echo ===================================================
pause
