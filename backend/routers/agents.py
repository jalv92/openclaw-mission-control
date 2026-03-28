from fastapi import APIRouter, Depends
from core.deps import verify_token
from services.process_monitor import get_agents_status
from services.data_reader import get_log_tail

router = APIRouter()

@router.get("/", dependencies=[Depends(verify_token)])
def get_agents():
    return get_agents_status()

@router.get("/{agent_id}/log", dependencies=[Depends(verify_token)])
def get_agent_log(agent_id: str, lines: int = 50):
    filename = f"{agent_id}.log"
    content = get_log_tail(filename, lines=lines)
    return {"log": content}
