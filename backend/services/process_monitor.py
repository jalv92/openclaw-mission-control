"""
process_monitor.py - Detector real de agentes OpenClaw en ejecucion.
"""
import psutil
import os
from core.config import settings

WORKSPACE = settings.OPENCLAW_WORKSPACE

AGENT_SCRIPTS = {
    "orchestrator":    os.path.join("orchestrator",   "orchestrator.py"),
    "coder_agent":     os.path.join("coder_agent",    "coder_agent.py"),
    "research_agent":  os.path.join("research_agent", "research_agent.py"),
    "ollama_watcher":  os.path.join("ollama_watcher", "ollama_watcher.py"),
    "memory_keeper":   os.path.join("memory_keeper",  "memory_keeper.py"),
    "github_guardian": os.path.join("github_guardian","github_guardian.py"),
}

# Agentes on-demand: solo corren cuando tienen tarea. Offline = NORMAL, no es error.
ON_DEMAND_AGENTS = {"coder_agent"}

def get_agents_status() -> dict:
    agents = {name: {"status": "offline", "pid": None} for name in AGENT_SCRIPTS}

    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            cmdline = proc.info.get('cmdline') or []
            if not cmdline:
                continue
            if 'python' not in proc.info.get('name', '').lower():
                continue
            cmd_str = ' '.join(cmdline)
            for agent_name, script_rel in AGENT_SCRIPTS.items():
                script_abs_norm = os.path.normpath(os.path.join(WORKSPACE, script_rel)).lower()
                cmd_norm = cmd_str.lower().replace('\\\\', '\\')
                if script_abs_norm in cmd_norm:
                    agents[agent_name]["status"] = "active"
                    agents[agent_name]["pid"] = proc.info['pid']
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    # On-demand: mostrar estado especial en vez de offline
    for name in ON_DEMAND_AGENTS:
        if agents[name]["status"] == "offline":
            agents[name]["status"] = "on-demand"

    return agents
