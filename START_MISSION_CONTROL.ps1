# ============================================================
# START_MISSION_CONTROL.ps1
# Arranca el Mission Control completo: Backend + Frontend
# Uso: Click derecho -> Run with PowerShell
# ============================================================

$BACKEND_DIR = "$PSScriptRoot\backend"
$FRONTEND_DIR = "$PSScriptRoot\frontend"
$BACKEND_PORT = 8000
$FRONTEND_PORT = 3000

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OpenClaw Mission Control - INICIO     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar si el puerto 8000 ya esta ocupado
$existing = Get-NetTCPConnection -LocalPort $BACKEND_PORT -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "✅ Backend ya corriendo en puerto $BACKEND_PORT" -ForegroundColor Green
} else {
    Write-Host "🚀 Arrancando Backend (FastAPI)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BACKEND_DIR'; python -m uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload" -WindowStyle Normal
    Start-Sleep -Seconds 3
    Write-Host "✅ Backend arrancado en http://localhost:$BACKEND_PORT" -ForegroundColor Green
}

# 2. Verificar si el puerto 3000 ya esta ocupado
$existingFE = Get-NetTCPConnection -LocalPort $FRONTEND_PORT -ErrorAction SilentlyContinue
if ($existingFE) {
    Write-Host "✅ Frontend ya corriendo en puerto $FRONTEND_PORT" -ForegroundColor Green
} else {
    Write-Host "🚀 Arrancando Frontend (Next.js)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FRONTEND_DIR'; npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 5
    Write-Host "✅ Frontend arrancado en http://localhost:$FRONTEND_PORT" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MISSION CONTROL LISTO                 " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🌐 Dashboard:  http://localhost:3000" -ForegroundColor White
Write-Host "  🔧 Backend:    http://localhost:8000" -ForegroundColor White
Write-Host "  📖 API Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "  🔑 Token de acceso: openclaw-mc-token" -ForegroundColor Yellow
Write-Host ""
Write-Host "Abre tu navegador en http://localhost:3000" -ForegroundColor Cyan
Write-Host "Pulsa cualquier tecla para cerrar esta ventana..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
