from fastapi import APIRouter

from app.agents.state import LearningState
from app.schemas.chat import ChatRequest
from app.services.langgraph_service import LangGraphService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

langgraph_service = LangGraphService()


@router.get("/sessions")
def get_sessions():
    return {"message": "All Sessions"}


@router.post("/")
async def chat(request: ChatRequest):

    state: LearningState = {
        "user_message": request.message,
        "user_id": request.user_id,
        "skill_level": 1,
        "topic": "",
        "learning_history": [],
        "intent": "",
        "suggested_difficulty": 1,
        "explanation": "",
        "code_examples": "",
        "diagram": "",
        "questions": [],
        "resources": [],
        "feedback": "",
        "xp_earned": 0,
        "suggested_path": [],
        "response_chunks": [],
    }

    response = await langgraph_service.invoke(state)

    return response


@router.post("/sessions")
def create_session():
    return {"message": "Session Created"}


@router.get("/sessions/{session_id}")
def get_session(session_id: str):
    return {"message": session_id}


@router.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    return {"message": "Session Deleted"}