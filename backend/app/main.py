from  app.api.auth import router
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.database import Base, engine
from app.models.user import User

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    yield
    # Shutdown
    pass

app = FastAPI(lifespan=lifespan)
app.include_router(router)