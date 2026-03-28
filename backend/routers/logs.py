import os
from fastapi import APIRouter, Depends, HTTPException
from core.config import settings
from core.deps import verify_token
from services.data_reader import get_log_tail

router = APIRouter()

@router.get("/", dependencies=[Depends(verify_token)])
def list_logs():
    logs_dir = os.path.join(settings.OPENCLAW_WORKSPACE, 'logs')
    if not os.path.exists(logs_dir):
        return {"files": []}
    files = [f for f in os.listdir(logs_dir) if f.endswith('.log')]
    return {"files": sorted(files)}

@router.get("/{filename}", dependencies=[Depends(verify_token)])
def get_log(filename: str, lines: int = 200):
    content = get_log_tail(filename, lines=lines)
    return {"content": content}
