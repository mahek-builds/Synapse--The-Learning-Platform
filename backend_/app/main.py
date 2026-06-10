from fastapi import FastAPI
app=FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
@app.get("/")
async def root():
    return {"message": "Synapse AI Backend", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}



