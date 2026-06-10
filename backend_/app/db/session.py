from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    pool_size=20,
    max_overflow=0
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
