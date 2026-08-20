Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  FocusMatrix - Google Cloud / Firebase Deployment" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Authenticating with Firebase..." -ForegroundColor Yellow
cmd.exe /c npx -y firebase-tools@latest login

Write-Host ""
Write-Host "[2/3] Linking Firebase Project..." -ForegroundColor Yellow
cmd.exe /c npx -y firebase-tools@latest use --add

Write-Host ""
Write-Host "[3/3] Deploying to Google Cloud / Firebase Hosting..." -ForegroundColor Yellow
cmd.exe /c npx -y firebase-tools@latest deploy

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "  Deployment Complete! Your site is live on Cloud." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
