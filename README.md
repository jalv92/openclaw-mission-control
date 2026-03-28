# 🗓️ OpenClaw Mission Control

Dashboard web para monitorear y controlar el ecosistema de agentes autónomos OpenClaw en tiempo real.

## Stack
- **Backend:** FastAPI + WebSockets + Python
- **Frontend:** Next.js 16 + TypeScript + React

## Características
- 📊 Vista en tiempo real de todos los agentes (Orchestrator, Coder Agent, Research Agent, etc.)
- 📋 Gestión de cola de tareas (crear, monitorear, cancelar)
- 🧠 Visor de memoria diaria del sistema
- 📝 Logs en vivo de cada agente
- 🗂️ Explorador del workspace
- ⚙️ Configuración del backend (URL + token)
- 🔌 WebSocket para actualizaciones en tiempo real

## Inicio rápido

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:3000` y usa el token `openclaw-mc-token`.

## Variables de entorno

**Backend** — no requiere `.env`, configuración en `core/config.py`

**Frontend** — crear `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

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

## Acceso desde cualquier lugar

Para acceder desde fuera de tu red local, usa Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:8000
```
Copia la URL generada y configúrala en `/settings` del dashboard.
