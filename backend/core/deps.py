from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from core.config import settings

# A simplified auth mechanism for the dashboard
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def verify_token(token: str = Depends(oauth2_scheme)):
    if not token or token != settings.MC_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token
