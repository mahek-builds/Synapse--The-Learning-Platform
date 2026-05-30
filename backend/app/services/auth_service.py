from app.models.user import User
from app.db.database import SessionLocal
from passlib.hash import bcrypt
from app.core.security import create_access_token


def register_user(email: str, password: str):
    db = SessionLocal()

    hashed_password = bcrypt.hash(password)

    user = User(email=email, password=hashed_password)

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully"}


def login_user(email: str, password: str):
    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error": "User not found"}

    if not bcrypt.verify(password, user.password):
        return {"error": "Invalid password"}

    token = create_access_token({"sub": user.email})

    return {"access_token": token}