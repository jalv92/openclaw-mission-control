from fastapi import APIRouter, Depends, HTTPException
import uuid
from typing import List
import time

from core.deps import verify_token
from services.data_reader import get_tasks, write_tasks
from models.schemas import TaskItem, TaskCreate

router = APIRouter()

@router.get("/", response_model=List[dict], dependencies=[Depends(verify_token)])
def list_tasks():
    return get_tasks()

@router.post("/", dependencies=[Depends(verify_token)])
def create_task(task: TaskCreate):
    tasks = get_tasks()
    new_task = {
        "id": str(uuid.uuid4()),
        "desc": task.desc,
        "status": task.status,
        "level": task.level,
        "task_type": task.task_type,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "agent": "MissionControl"
    }
    tasks.append(new_task)
    success = write_tasks(tasks)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to write task")
    return new_task

@router.put("/{task_id}", dependencies=[Depends(verify_token)])
def update_task(task_id: str, updates: dict):
    tasks = get_tasks()
    updated = False
    for t in tasks:
        if t.get("id") == task_id:
            t.update(updates)
            t["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            updated = True
            break
            
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
        
    write_tasks(tasks)
    return {"status": "success"}

@router.delete("/{task_id}", dependencies=[Depends(verify_token)])
def delete_task(task_id: str):
    tasks = get_tasks()
    filtered = [t for t in tasks if t.get("id") != task_id]
    if len(tasks) == len(filtered):
        raise HTTPException(status_code=404, detail="Task not found")
        
    write_tasks(filtered)
    return {"status": "deleted"}
