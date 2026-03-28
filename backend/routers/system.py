import subprocess
import sys
import os
import json
import psutil
from fastapi import APIRouter, Depends
from core.deps import verify_token
from core.config import settings
from services.data_reader import get_health, get_masked_config

router = APIRouter()

WORKSPACE = settings.OPENCLAW_WORKSPACE
ORCHESTRATOR_SCRIPT = os.path.join(WORKSPACE, 'orchestrator', 'orchestrator.py')
WATCHER_SCRIPT = os.path.join(WORKSPACE, 'ollama_watcher', 'ollama_watcher.py')
PID_FILE = os.path.join(WORKSPACE, 'logs', 'orchestrator.pid')

def _get_orchestrator_pid():
    if os.path.exists(PID_FILE):
        try:
            with open(PID_FILE, 'r') as f:
                pid = int(f.read().strip())
            if psutil.pid_exists(pid):
                return pid
        except Exception:
            pass
    return None

@router.get("/health", dependencies=[Depends(verify_token)])
def system_health():
    health = get_health()
    orch_pid = _get_orchestrator_pid()
    return {
        "status": "ok",
        "ollama_health": health,
        "orchestrator": {
            "running": orch_pid is not None,
            "pid": orch_pid
        }
    }

@router.get("/config", dependencies=[Depends(verify_token)])
def system_config():
    config = get_masked_config()
    return {"config": config}

@router.post("/orchestrator/start", dependencies=[Depends(verify_token)])
def start_orchestrator():
    pid = _get_orchestrator_pid()
    if pid:
        return {"status": "already_running", "pid": pid}
    try:
        proc = subprocess.Popen(
            [sys.executable, ORCHESTRATOR_SCRIPT],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            cwd=os.path.dirname(ORCHESTRATOR_SCRIPT)
        )
        os.makedirs(os.path.dirname(PID_FILE), exist_ok=True)
        with open(PID_FILE, 'w') as f:
            f.write(str(proc.pid))
        return {"status": "started", "pid": proc.pid}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@router.post("/orchestrator/stop", dependencies=[Depends(verify_token)])
def stop_orchestrator():
    pid = _get_orchestrator_pid()
    if not pid:
        return {"status": "not_running"}
    try:
        p = psutil.Process(pid)
        p.terminate()
        if os.path.exists(PID_FILE):
            os.remove(PID_FILE)
        return {"status": "stopped", "pid": pid}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
