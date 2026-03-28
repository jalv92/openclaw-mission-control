"""
process_monitor.py - Detector real de agentes OpenClaw en ejecucion.
Busca procesos Python cuyo cmdline contenga la ruta EXACTA del script del agente,
evitando falsos positivos por comandos de inspeccion.
"""
import psutil
import os
from core.config import settings

WORKSPACE = settings.OPENCLAW_WORKSPACE

# Mapa agente -> ruta parcial UNICA de su script
AGENT_SCRIPTS = {
    "orchestrator":   os.path.join("orchestrator", "orchestrator.py"),
    "coder_agent":    os.path.join("coder_agent",  "coder_agent.py"),
    "research_agent": os.path.join("research_agent", "research_agent.py"),
    "ollama_watcher": os.path.join("ollama_watcher", "ollama_watcher.py"),
    "memory_keeper":  os.path.join("memory_keeper", "memory_keeper.py"),
    "github_guardian":os.path.join("github_guardian", "github_guardian.py"),
}

def get_agents_status() -> dict:
    """
    Detecta agentes activos buscando la ruta exacta del script en el cmdline.
    Evita falsos positivos comparando contra rutas absolutas del workspace.
    """
    agents = {name: {"status": "offline", "pid": None} for name in AGENT_SCRIPTS}

    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            cmdline = proc.info.get('cmdline') or []
            if not cmdline:
                continue

            # Solo considerar procesos Python
            proc_name = proc.info.get('name', '').lower()
            if 'python' not in proc_name:
                continue

            # Reconstruir el comando completo como string
            cmd_str = ' '.join(cmdline)

            for agent_name, script_rel in AGENT_SCRIPTS.items():
                # Comparar contra la ruta absoluta esperada
                script_abs = os.path.join(WORKSPACE, script_rel)
                # Normalizar separadores
                script_abs_norm = os.path.normpath(script_abs).lower()
                cmd_norm = cmd_str.lower().replace('\\\\', '\\')

                if script_abs_norm in cmd_norm:
                    agents[agent_name]["status"] = "active"
                    agents[agent_name]["pid"] = proc.info['pid']

        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    return agents
