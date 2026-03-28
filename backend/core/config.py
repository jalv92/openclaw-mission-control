import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Default token simple for dashboard authentication
    MC_TOKEN: str = os.getenv("MC_TOKEN") or "openclaw-mc-token"
    
    # Absolute path to the OpenClaw workspace directory
    OPENCLAW_WORKSPACE: str = os.environ.get("OPENCLAW_WORKSPACE", r"C:\Users\javlo\.openclaw\workspace")
    
    # Path to openclaw config (if needed)
    OPENCLAW_CONFIG_PATH: str = os.environ.get("OPENCLAW_CONFIG_PATH", r"C:\Users\javlo\.openclaw\openclaw.json")

    class Config:
        case_sensitive = True

settings = Settings()
