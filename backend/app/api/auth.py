from fastapi import APIRouter
from app.services.auth_service import register_user,login_user
router=APIRouter()
@router.post("/register")
def register(email:str,password:str):
    return register_user(email,password)
@router.post("/login")
def login(email:str,password:str):
    return login_user(email,password)


