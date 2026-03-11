
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()

# Security scheme to read Bearer token
security = HTTPBearer()

# Simple in-memory blacklist for logged out tokens
blacklisted_tokens = set()

@router.post("/api/auth/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Logout endpoint.
    Reads the JWT token from the Authorization header and adds it to a blacklist.
    """
    token = credentials.credentials

    # Add token to blacklist
    blacklisted_tokens.add(token)

    return {
        "message": "Logout successful"
    }
