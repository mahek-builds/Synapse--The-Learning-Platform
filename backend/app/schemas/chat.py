from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class ChatSessionCreate(BaseModel):
    title: Optional[str] = None
    topic: Optional[str] = None


class ChatSessionResponse(BaseModel):
    id: str
    title: str
    topic: str
    created_at: datetime
    updated_at: datetime


class MessageResponse(BaseModel):
    id: str
    session_id: str
    sender: str
    content: str
    metadata: Dict = {}
    created_at: datetime


class ChatSessionWithMessages(BaseModel):
    session: ChatSessionResponse
    messages: List[MessageResponse]


class WebSocketMessage(BaseModel):
    type: str
    data: Dict


# ----------------------------
# AI Chat Request
# ----------------------------

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: str
    message: str


# ----------------------------
# AI Chat Response
# ----------------------------

class ChatResponse(BaseModel):
    session_id: str
    response: str
    topic: str
    intent: str