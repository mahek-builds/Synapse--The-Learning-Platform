from fastapi import APIRouter, Depends, HTTPException, status
from app.services.progress_service import progress_service
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)


@router.get("/{user_id}")
def get_progress(user_id: str, current_user: any = Depends(get_current_user)):
    user_id_from_token = getattr(current_user, "id", None)
    if not user_id_from_token or user_id_from_token != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return progress_service.get_progress(user_id)