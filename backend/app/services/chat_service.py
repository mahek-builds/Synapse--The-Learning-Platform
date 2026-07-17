import uuid
from datetime import datetime
import logging
from app.core.database import supabase

logger = logging.getLogger(__name__)


def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False


class ChatService:

    def __init__(self):
        # In-memory storage fallback
        self._sessions = {}      # session_id -> session_dict
        self._messages = []      # list of message_dict

    def _ensure_user_exists(self, user_id: str):
        """Create a minimal app_users row if this user_id doesn't exist yet.
        This prevents foreign-key violations on learning_sessions."""
        if not is_valid_uuid(user_id):
            return
        try:
            existing = (
                supabase
                .table("app_users")
                .select("id")
                .eq("id", user_id)
                .execute()
            )
            if existing.data:
                return  # already exists
            supabase.table("app_users").insert({
                "id": user_id,
                "email": f"{user_id[:8]}@synapse.local",
                "name": "Synapse User",
            }).execute()
        except Exception as e:
            logger.warning(f"Could not ensure user exists: {e}")

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

        if not is_valid_uuid(payload["id"]) or not is_valid_uuid(payload["user_id"]):
            logger.warning("Invalid UUID format for session or user; using in-memory fallback.")
            return [payload]

        try:
            # Ensure user exists in app_users before inserting session
            self._ensure_user_exists(payload["user_id"])
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

        if not is_valid_uuid(user_id):
            return [s for s in self._sessions.values() if s["user_id"] == user_id]

        try:
            response = (
                supabase
                .table("learning_sessions")
                .select("*")
                .eq("user_id", user_id)
                .order("updated_at", desc=True)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.warning(f"Failed to get sessions from Supabase, using in-memory fallback: {e}")
            return [s for s in self._sessions.values() if s["user_id"] == user_id]

    def get_session(self, session_id: str):

        if not is_valid_uuid(session_id):
            return self._sessions.get(session_id)

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

        if not is_valid_uuid(session_id):
            return []

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

        if not is_valid_uuid(session_id):
            return [self._sessions.get(session_id)] if session_id in self._sessions else []

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

        if not is_valid_uuid(payload["session_id"]):
            return [payload]

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

        if not is_valid_uuid(session_id):
            return [m for m in self._messages if m["session_id"] == session_id]

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