from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserUpdate
from app.services.user_service import user_service
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/{user_id}")
def get_profile(user_id: str, current_user: any = Depends(get_current_user)):
    user_id_from_token = getattr(current_user, "id", None)
    if not user_id_from_token or user_id_from_token != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return user_service.get_profile(user_id)


@router.put("/{user_id}")
def update_profile(
    user_id: str,
      data: UserUpdate,
    current_user: any = Depends(get_current_user)
):
    user_id_from_token = getattr(current_user, "id", None)
    if not user_id_from_token or user_id_from_token != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return user_service.update_profile(user_id, data)


@router.get("/{user_id}/stats")
def get_stats(user_id: str, current_user: any = Depends(get_current_user)):
    user_id_from_token = getattr(current_user, "id", None)
    if not user_id_from_token or user_id_from_token != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return user_service.get_stats(user_id)
