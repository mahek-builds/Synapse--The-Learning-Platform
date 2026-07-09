from app.core.database import supabase


class ProgressService:

    def save_progress(self, data: dict):

        payload = {
            "user_id": data.get("user_id"),
            "topic": data.get("topic"),
            "status": data.get("status"),
            "xp": data.get("xp", 0),
            "updated_at": data.get("updated_at")
        }

        response = (
            supabase
            .table("user_progress")
            .insert(payload)
            .execute()
        )

        return response.data

    def get_progress(self, user_id: str):

        response = (
            supabase
            .table("user_progress")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        return response.data

    def update_progress(self, progress_id: str, data: dict):

        response = (
            supabase
            .table("user_progress")
            .update(data)
            .eq("id", progress_id)
            .execute()
        )

        return response.data


progress_service = ProgressService()