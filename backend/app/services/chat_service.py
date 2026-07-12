from datetime import datetime
import logging
from app.core.database import supabase

logger = logging.getLogger(__name__)


class ChatService:

    def __init__(self):
        # In-memory storage fallback
        self._sessions = {}      # session_id -> session_dict
        self._messages = []      # list of message_dict

    def create_session(self, data: dict):

        payload = {
            "id": data["id"],
            "user_id": data["user_id"],
            "title": data.get("title"),
            "topic": data.get("topic"),
            "created_at": data.get("created_at") or datetime.utcnow().isoformat(),
            "updated_at": data.get("updated_at") or data.get("created_at") or datetime.utcnow().isoformat()
        }

        # Store in-memory first
        self._sessions[payload["id"]] = payload

        try:
            response = (
                supabase
                .table("learning_sessions")
                .insert(payload)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to create session in Supabase, using in-memory fallback: {e}")
            return [payload]

    def get_sessions(self, user_id: str):

        try:
            response = (
                supabase
                .table("learning_sessions")
                .select("*")
                .eq("user_id", user_id)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to get sessions from Supabase, using in-memory fallback: {e}")
            return [s for s in self._sessions.values() if s["user_id"] == user_id]

    def get_session(self, session_id: str):

        try:
            response = (
                supabase
                .table("learning_sessions")
                .select("*")
                .eq("id", session_id)
                .single()
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to get session from Supabase, using in-memory fallback: {e}")
            return self._sessions.get(session_id)

    def delete_session(self, session_id: str):

        self._sessions.pop(session_id, None)
        self._messages = [m for m in self._messages if m["session_id"] != session_id]

        try:
            response = (
                supabase
                .table("learning_sessions")
                .delete()
                .eq("id", session_id)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to delete session in Supabase, using in-memory fallback: {e}")
            return []

    def update_session(self, session_id: str, data: dict):

        if session_id in self._sessions:
            self._sessions[session_id].update(data)
            self._sessions[session_id]["updated_at"] = datetime.utcnow().isoformat()

        try:
            response = (
                supabase
                .table("learning_sessions")
                .update(data)
                .eq("id", session_id)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to update session in Supabase, using in-memory fallback: {e}")
            return [self._sessions.get(session_id)] if session_id in self._sessions else []

    def save_message(self, data: dict):

        payload = {
            "session_id": data["session_id"],
            "sender": data["sender"],
            "content": data["content"],
            "metadata": data.get("metadata", {}),
            "created_at": data.get("created_at") or datetime.utcnow().isoformat()
        }

        # Store in-memory first
        self._messages.append(payload)

        try:
            response = (
                supabase
                .table("session_messages")
                .insert(payload)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to save message in Supabase, using in-memory fallback: {e}")
            return [payload]

    def get_messages(self, session_id: str):

        try:
            response = (
                supabase
                .table("session_messages")
                .select("*")
                .eq("session_id", session_id)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to get messages from Supabase, using in-memory fallback: {e}")
            return [m for m in self._messages if m["session_id"] == session_id]


chat_service = ChatService()