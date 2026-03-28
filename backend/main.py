import os
import uvicorn
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from core.config import settings
from routers import tasks, agents, memory, system, workspace, logs
from services.watcher import start_watchdog
from services.websocket_manager import manager

app = FastAPI(title="OpenClaw Mission Control Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(memory.router, prefix="/api/memory", tags=["memory"])
app.include_router(system.router, prefix="/api/system", tags=["system"])
app.include_router(workspace.router, prefix="/api/workspace", tags=["workspace"])
app.include_router(logs.router, prefix="/api/logs", tags=["logs"])

@app.on_event("startup")
async def startup_event():
    # Start the filesystem watchdog
    asyncio.create_task(start_watchdog())

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    # Verify token
    if token != settings.MC_TOKEN:
        await websocket.close(code=1008, reason="Unauthorized")
        return

    await manager.connect(websocket)
    try:
        while True:
            # We don't really expect to receive much from the client via WS right now,
            # but we keep the connection open to send data.
            data = await websocket.receive_text()
            # Handle incoming WS commands if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {"status": "ok", "message": "Mission Control API server running"}

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
