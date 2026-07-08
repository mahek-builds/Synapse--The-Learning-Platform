from pydantic import BaseModel
from typing import List


class QuestionResponse(BaseModel):
    id: str
    topic: str
    difficulty: int
    question: str
    options: List[str]
    explanation: str


class Answer(BaseModel):
    question_id: str
    selected_answer: int


class QuizSubmitRequest(BaseModel):
    quiz_session_id: str
    answers: List[Answer]


class QuestionResult(BaseModel):
    question_id: str
    is_correct: bool
    correct_answer: int
    explanation: str


class QuizResultResponse(BaseModel):
    score: int
    total: int
    percentage: float
    xp_earned: int
    feedback: str
    details: List[QuestionResult]