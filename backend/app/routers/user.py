from fastapi import APIRouter
router=APIRouter()
@router.get("/profile")
def get_profile():
    return {"message": "Get Profile"}

@router.put("/profile")
def update_profile():
    return {"message": "Update Profile"}

@router.get("/stats")
def get_stats():
    return {"message": "User Stats"}