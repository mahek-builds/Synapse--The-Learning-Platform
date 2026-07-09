from app.core.database import supabase


class ChatService:

    def create_session(self, data: dict):

        payload = {
            "id": data["id"],
            "user_id": data["user_id"],
            "title": data.get("title"),
            "topic": data.get("topic"),
            "created_at": data.get("created_at"),
            "updated_at": data.get("updated_at", data.get("created_at"))
        }

        response = (
            supabase
            .table("learning_sessions")
            .insert(payload)
            .execute()
        )

        return response.data

    def get_sessions(self, user_id: str):

        response = (
            supabase
            .table("learning_sessions")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        return response.data

    def get_session(self, session_id: str):

        response = (
            supabase
            .table("learning_sessions")
            .select("*")
            .eq("id", session_id)
            .single()
            .execute()
        )

        return response.data

    def delete_session(self, session_id: str):

        response = (
            supabase
            .table("learning_sessions")
            .delete()
            .eq("id", session_id)
            .execute()
        )

        return response.data

    def update_session(self, session_id: str, data: dict):

        response = (
            supabase
            .table("learning_sessions")
            .update(data)
            .eq("id", session_id)
            .execute()
        )

        return response.data

    def save_message(self, data: dict):

        response = (
            supabase
            .table("session_messages")
            .insert(data)
            .execute()
        )

        return response.data

    def get_messages(self, session_id: str):

        response = (
            supabase
            .table("session_messages")
            .select("*")
            .eq("session_id", session_id)
            .execute()
        )

        return response.data


chat_service = ChatService()