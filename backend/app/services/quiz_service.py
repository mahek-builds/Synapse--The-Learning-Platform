from app.core.database import supabase


class QuizService:

    def save_quiz(self, data: dict):

        payload = {
            "user_id": data.get("user_id"),
            "topic": data.get("topic"),
            "score": data.get("score"),
            "answers": data.get("answers"),
            "created_at": data.get("created_at")
        }

        response = (
            supabase
            .table("user_quizzes")
            .insert(payload)
            .execute()
        )

        return response.data

    def get_quizzes(self, user_id: str):

        response = (
            supabase
            .table("user_quizzes")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        return response.data

    def get_quiz(self, quiz_id: str):

        response = (
            supabase
            .table("user_quizzes")
            .select("*")
            .eq("id", quiz_id)
            .single()
            .execute()
        )

        return response.data


quiz_service = QuizService()