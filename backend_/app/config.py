from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GOOGLE_CLIENT_ID: str
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    FRONTEND_URL: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"

settings = Settings() 