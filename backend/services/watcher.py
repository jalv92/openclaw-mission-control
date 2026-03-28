import os
import asyncio
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from core.config import settings
from services.websocket_manager import manager

class DataFileHandler(FileSystemEventHandler):
    def __init__(self, loop):
        super().__init__()
        self.loop = loop

    def on_modified(self, event):
        if event.is_directory:
            return
        
        filename = os.path.basename(event.src_path)
        
        # Determine what kind of file was modified and broadcast event
        if filename == 'task_queue.json':
            asyncio.run_coroutine_threadsafe(
                manager.broadcast_json({"type": "task_queue_updated"}),
                self.loop
            )
        elif filename == 'ollama_health.json':
            asyncio.run_coroutine_threadsafe(
                manager.broadcast_json({"type": "health_updated"}),
                self.loop
            )
        elif filename.endswith('.log'):
            asyncio.run_coroutine_threadsafe(
                manager.broadcast_json({"type": "log_updated", "file": filename}),
                self.loop
            )
        elif filename.endswith('.md') and 'memory' in event.src_path:
            asyncio.run_coroutine_threadsafe(
                manager.broadcast_json({"type": "memory_updated", "file": filename}),
                self.loop
            )

async def start_watchdog():
    # Only run watchdog when the main loop is running
    loop = asyncio.get_running_loop()
    
    event_handler = DataFileHandler(loop)
    observer = Observer()
    
    # Watch main workspace
    observer.schedule(event_handler, path=settings.OPENCLAW_WORKSPACE, recursive=False)
    
    # Watch logs dir
    logs_dir = os.path.join(settings.OPENCLAW_WORKSPACE, 'logs')
    if os.path.exists(logs_dir):
        observer.schedule(event_handler, path=logs_dir, recursive=False)
        
    # Watch memory dir
    mem_dir = os.path.join(settings.OPENCLAW_WORKSPACE, 'memory')
    if os.path.exists(mem_dir):
        observer.schedule(event_handler, path=mem_dir, recursive=False)

    observer.start()
    
    try:
        while True:
            await asyncio.sleep(1)
    finally:
        observer.stop()
        observer.join()
