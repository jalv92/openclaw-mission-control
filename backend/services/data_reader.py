import os
import json
from pathlib import Path
from core.config import settings

def _read_json_file(file_path: str, default=None):
    if not default:
        default = {}
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return default

def get_tasks():
    t_path = os.path.join(settings.OPENCLAW_WORKSPACE, 'task_queue.json')
    return _read_json_file(t_path, [])

def write_tasks(tasks_list):
    t_path = os.path.join(settings.OPENCLAW_WORKSPACE, 'task_queue.json')
    try:
        with open(t_path, 'w', encoding='utf-8') as f:
            json.dump(tasks_list, f, indent=2)
        return True
    except Exception as e:
        print(f"Error writing to task_queue.json: {e}")
        return False

def get_health():
    h_path = os.path.join(settings.OPENCLAW_WORKSPACE, 'logs', 'ollama_health.json')
    return _read_json_file(h_path, {})

def get_log_tail(filename: str, lines: int = 50):
    l_path = os.path.join(settings.OPENCLAW_WORKSPACE, 'logs', filename)
    if not os.path.exists(l_path):
        return []
    try:
        with open(l_path, 'r', encoding='utf-8', errors='replace') as f:
            all_lines = f.readlines()
            return [line.strip() for line in all_lines[-lines:]]
    except Exception:
        return []

def get_memory_files():
    mem_dir = os.path.join(settings.OPENCLAW_WORKSPACE, 'memory')
    if not os.path.exists(mem_dir):
        return []
    files = []
    for f in os.listdir(mem_dir):
        if f.endswith('.md'):
            files.append(f)
    # Sort files chronologically descending
    return sorted(files, reverse=True)

def get_memory_content(date_str: str):
    file_path = os.path.join(settings.OPENCLAW_WORKSPACE, 'memory', f"{date_str}.md")
    if not os.path.exists(file_path):
        return ""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()
    except Exception:
        return ""

def get_masked_config():
    c_path = os.path.join(settings.OPENCLAW_WORKSPACE, 'config.json')
    config = _read_json_file(c_path, {})
    masked = {}
    for k, v in config.items():
        if isinstance(v, str) and len(v) > 8:
            masked[k] = f"{v[:4]}...{v[-4:]}"
        else:
            masked[k] = "***"
    return masked
