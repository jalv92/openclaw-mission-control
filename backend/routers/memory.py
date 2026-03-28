from fastapi import APIRouter, Depends, HTTPException
from core.deps import verify_token
from services.data_reader import get_memory_files, get_memory_content

router = APIRouter()

@router.get("/", dependencies=[Depends(verify_token)])
def list_memory():
    return {"files": get_memory_files()}

@router.get("/{date_str}", dependencies=[Depends(verify_token)])
def get_memory(date_str: str):
    content = get_memory_content(date_str)
    if not content:
        raise HTTPException(status_code=404, detail="Memory file not found")
    return {"content": content}
