from fastapi import APIRouter

router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)

@router.get("/stats")
def stats():
    return {"message": "Progress"}

@router.get("/skills")
def skills():
    return {"message": "Skills"}

@router.get("/achievements")
def achievements():
    return {"message": "Achievements"}