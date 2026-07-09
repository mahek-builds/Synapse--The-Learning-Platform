from app.core.database import supabase
from app.schemas.user import UserUpdate


class UserService:

    def get_profile(self, user_id: str):

        response = (
            supabase
            .table("app_users")
            .select("*")
            .eq("id", user_id)
            .single()
            .execute()
        )

        return response.data

    def update_profile(self, user_id: str, data: UserUpdate):

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

        user = (
            supabase
            .table("app_users")
            .select("xp,level,current_streak")
            .eq("id", user_id)
            .single()
            .execute()
        )

        quizzes = (
            supabase
            .table("user_quizzes")
            .select("score")
            .eq("user_id", user_id)
            .execute()
        )

        total = len(quizzes.data)

        average = (
            sum(q["score"] for q in quizzes.data) / total
            if total else 0
        )

        return {
            "total_quizzes": total,
            "average_score": average,
            "total_xp": user.data["xp"],
            "level": user.data["level"],
            "current_streak": user.data["current_streak"]
        }


user_service = UserService()