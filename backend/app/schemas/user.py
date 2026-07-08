from pydantic import BaseModel
from typing import Optional


class GoogleAuthRequest(BaseModel):
    token: str


class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    profile_image: Optional[str] = None
    plan: str = "Free"
    level: int = 1
    xp: int = 0


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: UserProfile


class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_image: Optional[str] = None


class UserStats(BaseModel):
    total_quizzes: int
    average_score: float
    total_xp: int
    level: int
    achievements_count: int
    current_streak: int