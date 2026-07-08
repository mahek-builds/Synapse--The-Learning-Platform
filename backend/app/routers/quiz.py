from fastapi import APIRouter
router=APIRouter(prefix="/quiz",tags=["Quiz"])
@router.get("/topics")
@router.get("/topics")
def topics():
    return {"message": "Topics"}

@router.get("/questions")
def questions():
    return {"message": "Questions"}

@router.post("/submit")
def submit():
    return {"message": "Quiz Submitted"}

@router.get("/history")
def history():
    return {"message": "Quiz History"}