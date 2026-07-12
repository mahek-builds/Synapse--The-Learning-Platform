from datetime import datetime
import uuid

from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_service
from app.services.langgraph_service import Langgraph
from app.agents.state import LearningState


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):

    session_id = request.session_id or str(uuid.uuid4())

    if request.session_id:
        session = chat_service.get_session(request.session_id)
        if session is None:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        chat_service.create_session({
            "id": session_id,
            "user_id": request.user_id,
            "title": None,
            "topic": None,
            "created_at": datetime.utcnow().isoformat()
        })

    chat_service.save_message({
        "session_id": session_id,
        "sender": "user",
        "content": request.message,
        "metadata": {},
        "created_at": datetime.utcnow().isoformat()
    })

    state = LearningState(
        user_message=request.message,
        user_id=request.user_id,
        skill_level="beginner",
        topic="",
        learning_history=[],
        intent="",
        suggested_difficulty=0,
        explanation="",
        code_examples="",
        diagram="",
        questions=[],
        resources=[],
        feedback="",
        xp_earned=0,
        suggested_path=[],
        response_chunks=[]
    )

    import traceback

    try:
        ai_response = await Langgraph().invoke(state)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    response_text = ""
    topic = ""
    intent = ""

    if isinstance(ai_response, dict):
        response_text = (
            ai_response.get("response")
            or ai_response.get("explanation")
            or ai_response.get("feedback")
            or str(ai_response)
        )
        topic = ai_response.get("topic") or ""
        intent = ai_response.get("intent") or ""
    else:
        response_text = str(ai_response)

    if topic:
        chat_service.update_session(session_id, {
            "topic": topic,
            "updated_at": datetime.utcnow().isoformat()
        })

    chat_service.save_message({
        "session_id": session_id,
        "sender": "ai",
        "content": response_text,
        "metadata": {
            "intent": intent,
            "topic": topic,
        },
        "created_at": datetime.utcnow().isoformat()
    })

    return {
        "session_id": session_id,
        "response": response_text,
        "topic": topic,
        "intent": intent
    }


@router.get("/sessions/{user_id}")
def get_sessions(user_id: str):

    return chat_service.get_sessions(user_id)


@router.get("/messages/{session_id}")
def get_messages(session_id: str):

    return chat_service.get_messages(session_id)