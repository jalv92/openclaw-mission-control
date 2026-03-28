# autostart.ps1 - Arranca Mission Control en segundo plano al inicio de Windows
# No abre ventanas visibles. Todo corre silencioso.

$BACKEND_DIR  = "C:\Users\javlo\.openclaw\workspace\openclaw-mission-control\backend"
$FRONTEND_DIR = "C:\Users\javlo\.openclaw\workspace\openclaw-mission-control\frontend"
$LOG_DIR      = "C:\Users\javlo\.openclaw\workspace\logs"

# Crear directorio de logs si no existe
if (-not (Test-Path $LOG_DIR)) { New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null }

# Esperar a que la red este lista (importante en arranque)
Start-Sleep -Seconds 5

# ── Agentes OpenClaw ────────────────────────────────────────────────────────────
Write-Output "[$(Get-Date)] Lanzando agentes OpenClaw..." | Out-File "$LOG_DIR\autostart.log" -Append
Start-Process python -ArgumentList "C:\Users\javlo\.openclaw\workspace\start_agents.py" -WindowStyle Hidden
Start-Sleep -Seconds 8

# ── Backend (FastAPI / uvicorn) ────────────────────────────────────────────────
$backendRunning = $false
try {
    $r = Invoke-RestMethod "http://localhost:8000/" -TimeoutSec 3
    if ($r.status -eq "ok") { $backendRunning = $true }
} catch {}

if (-not $backendRunning) {
    $backendLog = "$LOG_DIR\mission_control_backend.log"
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "python"
    $psi.Arguments = "-m uvicorn main:app --host 0.0.0.0 --port 8000"
    $psi.WorkingDirectory = $BACKEND_DIR
    $psi.CreateNoWindow = $true
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $proc = [System.Diagnostics.Process]::Start($psi)
    # Guardar PID
    $proc.Id | Out-File "$LOG_DIR\backend.pid" -Encoding utf8
    "[$(Get-Date)] Backend arrancado PID=$($proc.Id)" | Out-File $backendLog -Append
} else {
    "[$(Get-Date)] Backend ya estaba corriendo" | Out-File "$LOG_DIR\mission_control_backend.log" -Append
}

# Esperar a que el backend responda
$tries = 0
do {
    Start-Sleep -Seconds 2
    $tries++
    try { $r = Invoke-RestMethod "http://localhost:8000/" -TimeoutSec 2; if ($r.status) { break } } catch {}
} while ($tries -lt 10)

# ── Frontend (Next.js) ─────────────────────────────────────────────────────────
$frontendRunning = $false
try {
    $r = Invoke-WebRequest "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing
    if ($r.StatusCode -eq 200) { $frontendRunning = $true }
} catch {}

if (-not $frontendRunning) {
    $frontendLog = "$LOG_DIR\mission_control_frontend.log"
    $psi2 = New-Object System.Diagnostics.ProcessStartInfo
    $psi2.FileName = "cmd.exe"
    $psi2.Arguments = "/c npm run dev > `"$frontendLog`" 2>&1"
    $psi2.WorkingDirectory = $FRONTEND_DIR
    $psi2.CreateNoWindow = $true
    $psi2.UseShellExecute = $false
    $proc2 = [System.Diagnostics.Process]::Start($psi2)
    $proc2.Id | Out-File "$LOG_DIR\frontend.pid" -Encoding utf8
    "[$(Get-Date)] Frontend arrancado PID=$($proc2.Id)" | Out-File $frontendLog -Append
} else {
    "[$(Get-Date)] Frontend ya estaba corriendo" | Out-File "$LOG_DIR\mission_control_frontend.log" -Append
}

"[$(Get-Date)] Mission Control autostart completado" | Out-File "$LOG_DIR\autostart.log" -Append
