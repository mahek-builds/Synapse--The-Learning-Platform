import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.database import Base
from app.models.user import User

target_metadata = Base.metadata


# 1. Model change karo (user.py)
# 2. migration generate karo
#    alembic revision --autogenerate -m "msg"

# 3. DB update karo
#    alembic upgrade headesa ky kra  error resolve ho gya
