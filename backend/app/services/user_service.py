from app.schemas.user import UserUpdate

class UserService:

    def get_profile(self):
        ...

    def update_profile(self, data: UserUpdate):
        return {
            "message": "Profile Updated",
            "name": data.name,
            "profile_image": data.profile_image
        }

    def get_stats(self):
        ...