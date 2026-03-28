import os
from fastapi import APIRouter, Depends, HTTPException
from core.config import settings
from core.deps import verify_token

router = APIRouter()

def get_tree(path):
    tree = []
    try:
        if not os.path.exists(path):
            return tree
        for entry in os.scandir(path):
            if entry.name.startswith('.') or entry.name == '__pycache__':
                continue
            is_dir = entry.is_dir()
            node = {
                "name": entry.name,
                "path": entry.path.replace(settings.OPENCLAW_WORKSPACE, '').replace('\\', '/').lstrip('/'),
                "is_dir": is_dir
            }
            if is_dir:
                node["children"] = get_tree(entry.path)
            tree.append(node)
    except PermissionError:
        pass
    # Sort: folders first, then files
    return sorted(tree, key=lambda x: (not x['is_dir'], x['name']))

@router.get("/tree", dependencies=[Depends(verify_token)])
def workspace_tree():
    return {"tree": get_tree(settings.OPENCLAW_WORKSPACE)}

@router.get("/file", dependencies=[Depends(verify_token)])
def read_workspace_file(file_path: str):
    full_path = os.path.join(settings.OPENCLAW_WORKSPACE, file_path)
    # Ensure no path traversal
    if not os.path.abspath(full_path).startswith(os.path.abspath(settings.OPENCLAW_WORKSPACE)):
        raise HTTPException(status_code=400, detail="Invalid path")
    
    if not os.path.exists(full_path) or not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        return {"content": content, "path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
