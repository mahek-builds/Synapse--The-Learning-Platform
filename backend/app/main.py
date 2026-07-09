from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.chat import router as chat_router
from app.routers.quiz import router as quiz_router
from app.routers.progress import router as progress_router


app = FastAPI(
    title="Synapse AI Backend",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(chat_router)
app.include_router(quiz_router)
app.include_router(progress_router)


@app.get("/")
def root():
    return {
        "message": "Synapse AI Backend is Running"
    }