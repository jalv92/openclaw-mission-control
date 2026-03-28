from pydantic import BaseModel
from typing import Optional, List, Any

class TaskItem(BaseModel):
    id: str
    desc: str
    status: str
    level: Optional[int] = None
    task_type: Optional[str] = None
    plan: Optional[str] = None
    agent: Optional[str] = None
    # Flexible extra fields
    last_execution_error: Optional[str] = None
    escalation_history: Optional[List[Any]] = None
    updated_at: Optional[str] = None

class TaskCreate(BaseModel):
    desc: str
    status: str = "pending"
    level: int = 1
    task_type: str = "single_script"
