from fastapi import APIRouter
from pydantic import  BaseModel
from app.graph.workflow import app_graph

router = APIRouter()

class Request(BaseModel):
    message: str

@router.post("/learn")
def learn(req: Request):

    result = app_graph.invoke({
        "user_query": req.message,
        "explanation": "",
        "quiz": [],
        "final_response": "",
        "weak_topics": []
    })

    return {"response": result["final_response"]}