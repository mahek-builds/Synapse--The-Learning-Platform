from fastapi import APIRouter
from app.services.progress_service import progress_service

router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)


@router.get("/{user_id}")
def get_progress(user_id: str):

    return progress_service.get_progress(user_id)