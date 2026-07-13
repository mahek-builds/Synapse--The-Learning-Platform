import uuid
from app.core.database import supabase


def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False


class ProgressService:

    def save_progress(self, data: dict):

        payload = {
            "user_id": data.get("user_id"),
            "topic": data.get("topic"),
            "status": data.get("status"),
            "xp": data.get("xp", 0),
            "updated_at": data.get("updated_at")
        }

        if not is_valid_uuid(payload["user_id"]):
            return [payload]

        response = (
            supabase
            .table("user_progress")
            .insert(payload)
            .execute()
        )

        return response.data

    def get_progress(self, user_id: str):

        if not is_valid_uuid(user_id):
            return []

        response = (
            supabase
            .table("user_progress")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        return response.data

    def update_progress(self, progress_id: str, data: dict):

        if not is_valid_uuid(progress_id):
            return []

        response = (
            supabase
            .table("user_progress")
            .update(data)
            .eq("id", progress_id)
            .execute()
        )

        return response.data


progress_service = ProgressService()