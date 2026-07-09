from fastapi import APIRouter
from app.services.quiz_service import quiz_service

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


@router.get("/{user_id}")
def get_quizzes(user_id: str):

    return quiz_service.get_quizzes(user_id)