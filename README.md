# 🗓️ OpenClaw Mission Control

Dashboard web para monitorear y controlar el ecosistema de agentes autónomos OpenClaw en tiempo real.

## Stack
- **Backend:** FastAPI + WebSockets + Python
- **Frontend:** Next.js 16 + TypeScript + React

## Características
- 📊 Vista en tiempo real de todos los agentes
- 📋 Gestión de cola de tareas (crear, monitorear, cancelar)
- 🧠 Visor de memoria diaria del sistema
- 📝 Logs en vivo de cada agente
- 🗂️ Explorador del workspace
- ⚙️ Configuración del backend
- 🔌 WebSocket para actualizaciones en tiempo real

## Inicio rápido

### Opción A — Script automático
```powershell
.\START_MISSION_CONTROL.ps1
```
Abre el navegador en `http://localhost:3000` → token: `openclaw-mc-token`

### Opción B — Manual

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

Crear `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Acceso remoto (opcional)

Si quieres acceder desde tu móvil u otra red, usa Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:3000
```
Te genera una URL pública temporal. Para el backend también:
```bash
cloudflared tunnel --url http://localhost:8000
```
Luego configura esa URL en `/settings` del dashboard.

## Arquitectura

```
frontend/          # Next.js App Router
├── src/app/       # Páginas: /, /agents, /tasks, /memory, /logs, /workspace, /settings
├── src/components # Sidebar, AuthProvider, StatusBadge
├── src/hooks/     # useApi, useWebSocket
└── src/lib/       # api.ts, types.ts

backend/
├── main.py        # FastAPI app + WebSocket endpoint
├── core/          # config, deps (auth)
├── routers/       # tasks, agents, memory, system, workspace, logs
└── services/      # data_reader, process_monitor, watcher, websocket_manager
```
