from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from types import SimpleNamespace
from app.core.config import settings

security = HTTPBearer(auto_error=False)

async def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials:
        token = credentials.credentials
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            user_id = payload.get("sub")
            if user_id:
                return SimpleNamespace(id=user_id, email=payload.get("email"), payload=payload, is_mock=False)
        except Exception as e:
            if not settings.DEVELOPMENT_MODE:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid or expired token: {str(e)}",
                    headers={"WWW-Authenticate": "Bearer"},
                )

    if settings.DEVELOPMENT_MODE:
        # Extract user_id dynamically from path, query, or json body
        user_id = request.path_params.get("user_id")
        if not user_id:
            user_id = request.query_params.get("user_id")
        if not user_id:
            try:
                body = await request.json()
                if isinstance(body, dict):
                    user_id = body.get("user_id")
            except Exception:
                pass
        if not user_id:
            user_id = "ff208e09-5521-449c-a274-01896e1767f8"
            
        return SimpleNamespace(id=user_id, email="mock@synapse.local", payload={}, is_mock=True)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated (token is missing or invalid)",
        headers={"WWW-Authenticate": "Bearer"},
    )


