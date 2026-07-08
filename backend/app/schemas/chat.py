from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime


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