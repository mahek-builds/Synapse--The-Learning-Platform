from fastapi import APIRouter
router=APIRouter(prefix="/chat",tags=["Chat"])
@router.get("/sessions")
@router.get("/sessions")
def get_sessions():
    return {"message": "All Sessions"}

@router.post("/sessions")
def create_session():
    return {"message": "Session Created"}

@router.get("/sessions/{session_id}")
def get_session(session_id: str):
    return {"message": session_id}

@router.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    return {"message": "Session Deleted"}
