from fastapi import APIRouter
from app.schemas.user import UserUpdate
from app.services.user_service import user_service

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/{user_id}")
def get_profile(user_id: str):

    return user_service.get_profile(user_id)


@router.put("/{user_id}")
def update_profile(
    user_id: str,
    data: UserUpdate
):

    return user_service.update_profile(user_id, data)


@router.get("/{user_id}/stats")
def get_stats(user_id: str):

    return user_service.get_stats(user_id)