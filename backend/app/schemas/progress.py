from pydantic import BaseModel
from typing import List
from datetime import datetime


class ProgressStats(BaseModel):
    total_quizzes: int
    average_score: float
    total_xp: int
    level: int
    current_streak: int
    topics_mastered: int


class SkillMastery(BaseModel):
    topic: str
    mastery_percentage: float
    quizzes_taken: int
    average_score: float


class AchievementResponse(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    unlocked_at: datetime