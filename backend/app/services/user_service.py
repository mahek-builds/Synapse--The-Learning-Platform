import uuid
from app.core.database import supabase
from app.schemas.user import UserUpdate


def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False


class UserService:

    def get_profile(self, user_id: str):

        if not is_valid_uuid(user_id):
            return None

        try:
            response = (
                supabase
                .table("app_users")
                .select("*")
                .eq("id", user_id)
                .single()
                .execute()
            )
            return response.data
        except Exception:
            return None

    def update_profile(self, user_id: str, data: UserUpdate):

        if not is_valid_uuid(user_id):
            return None

        update_payload = data.dict(exclude_none=True)

        response = (
            supabase
            .table("app_users")
            .update(update_payload)
            .eq("id", user_id)
            .execute()
        )

        return response.data

    def get_stats(self, user_id: str):

        if not is_valid_uuid(user_id):
            return {
                "total_quizzes": 0,
                "average_score": 0,
                "total_xp": 0,
                "level": 1,
                "current_streak": 0
            }

        try:
            user = (
                supabase
                .table("app_users")
                .select("xp,level,current_streak")
                .eq("id", user_id)
                .single()
                .execute()
            )
            user_data = user.data
        except Exception:
            user_data = None

        try:
            quizzes = (
                supabase
                .table("user_quizzes")
                .select("score")
                .eq("user_id", user_id)
                .execute()
            )
            quizzes_data = quizzes.data
        except Exception:
            quizzes_data = []

        total = len(quizzes_data)

        average = (
            sum(q["score"] for q in quizzes_data) / total
            if total else 0
        )

        return {
            "total_quizzes": total,
            "average_score": average,
            "total_xp": user_data["xp"] if user_data else 0,
            "level": user_data["level"] if user_data else 1,
            "current_streak": user_data["current_streak"] if user_data else 0
        }


user_service = UserService()