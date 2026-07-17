from datetime import datetime
import uuid
import asyncio
import json as json_lib

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_service
from app.services.langgraph_service import Langgraph
from app.agents.state import LearningState


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):

    session_id = request.session_id or str(uuid.uuid4())
    initial_title = (request.message[:50] + "...") if len(request.message) > 50 else request.message

    if request.session_id:
        session = chat_service.get_session(request.session_id)
        if session is None:
            await asyncio.to_thread(chat_service.create_session, {
                "id": session_id,
                "user_id": request.user_id,
                "title": initial_title,
                "topic": None,
                "created_at": datetime.utcnow().isoformat()
            })
    else:
        await asyncio.to_thread(chat_service.create_session, {
            "id": session_id,
            "user_id": request.user_id,
            "title": initial_title,
            "topic": None,
            "created_at": datetime.utcnow().isoformat()
        })

    asyncio.create_task(asyncio.to_thread(chat_service.save_message, {
        "session_id": session_id,
        "sender": "user",
        "content": request.message,
        "metadata": {},
        "created_at": datetime.utcnow().isoformat()
    }))

    state = LearningState(
        user_message=request.message,
        user_id=request.user_id,
        skill_level="beginner",
        topic="",
        learning_history=[],
        intent="",
        suggested_difficulty=0,
        explanation="",
        code_examples="",
        diagram="",
        questions=[],
        resources=[],
        feedback="",
        xp_earned=0,
        suggested_path=[],
        response_chunks=[]
    )

    import traceback

    try:
        ai_response = await Langgraph().invoke(state)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    import json
    response_text = ""
    topic = ""
    intent = ""
    explanation = ""
    code_examples = ""
    diagram = ""
    questions = ""
    resources = ""
    feedback = ""
    suggested_path = ""

    if isinstance(ai_response, dict):
        response_text = (
            ai_response.get("response")
            or ai_response.get("explanation")
            or ai_response.get("feedback")
            or str(ai_response)
        )
        topic = ai_response.get("topic") or ""
        intent = ai_response.get("intent") or ""
        explanation = ai_response.get("explanation") or ""
        code_examples = ai_response.get("code_examples") or ""
        diagram = ai_response.get("diagram") or ""
        
        q_val = ai_response.get("questions") or ""
        questions = json.dumps(q_val) if isinstance(q_val, (list, dict)) else str(q_val)
        
        r_val = ai_response.get("resources") or ""
        resources = json.dumps(r_val) if isinstance(r_val, (list, dict)) else str(r_val)
        
        feedback = ai_response.get("feedback") or ""
        
        p_val = ai_response.get("suggested_path") or ""
        suggested_path = json.dumps(p_val) if isinstance(p_val, (list, dict)) else str(p_val)
    else:
        response_text = str(ai_response)

    if topic:
        update_data = {
            "topic": topic,
            "title": topic,
            "updated_at": datetime.utcnow().isoformat()
        }
        await asyncio.to_thread(chat_service.update_session, session_id, update_data)

    asyncio.create_task(asyncio.to_thread(chat_service.save_message, {
        "session_id": session_id,
        "sender": "ai",
        "content": response_text,
        "metadata": {
            "intent": intent,
            "topic": topic,
            "explanation": explanation,
            "code_examples": code_examples,
            "diagram": diagram,
            "questions": questions,
            "resources": resources,
            "feedback": feedback,
            "suggested_path": suggested_path,
        },
        "created_at": datetime.utcnow().isoformat()
    }))

    return {
        "session_id": session_id,
        "response": response_text,
        "topic": topic,
        "intent": intent,
        "explanation": explanation,
        "code_examples": code_examples,
        "diagram": diagram,
        "questions": questions,
        "resources": resources,
        "feedback": feedback,
        "suggested_path": suggested_path
    }


@router.get("/sessions/{user_id}")
def get_sessions(user_id: str):

    return chat_service.get_sessions(user_id)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SSE STREAMING ENDPOINT
# Instead of waiting for ALL nodes to finish, this sends results
# to the frontend as EACH node completes.
#
# Flow:
#   1. Client sends POST /chat/stream with same body as /chat/
#   2. Server starts the LangGraph pipeline
#   3. As each node finishes, server sends its output as SSE chunk
#   4. Client receives chunks progressively and updates the UI
#   5. When all nodes are done, server sends [DONE]
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    SSE streaming version of /chat/.
    Returns results node-by-node instead of waiting for everything.
    """

    session_id = request.session_id or str(uuid.uuid4())
    initial_title = (request.message[:50] + "...") if len(request.message) > 50 else request.message

    # ── Create session — await so it exists before messages are saved ──
    if request.session_id:
        session = chat_service.get_session(request.session_id)
        if session is None:
            await asyncio.to_thread(chat_service.create_session, {
                "id": session_id,
                "user_id": request.user_id,
                "title": initial_title, "topic": None,
                "created_at": datetime.utcnow().isoformat()
            })
    else:
        await asyncio.to_thread(chat_service.create_session, {
            "id": session_id,
            "user_id": request.user_id,
            "title": initial_title, "topic": None,
            "created_at": datetime.utcnow().isoformat()
        })

    # ── Save user message (fire-and-forget) ──────────────────────
    asyncio.create_task(asyncio.to_thread(chat_service.save_message, {
        "session_id": session_id,
        "sender": "user",
        "content": request.message,
        "metadata": {},
        "created_at": datetime.utcnow().isoformat()
    }))

    # ── Build initial state (same as /chat/) ─────────────────────
    state = LearningState(
        user_message=request.message,
        user_id=request.user_id,
        skill_level="beginner", topic="",
        learning_history=[], intent="",
        suggested_difficulty=0, explanation="",
        code_examples="", diagram="",
        questions=[], resources=[],
        feedback="", xp_earned=0,
        suggested_path=[], response_chunks=[]
    )

    # ── This is the magic: async generator that yields SSE chunks ─
    async def event_generator():
        """
        graph.astream() yields {node_name: state_dict} as each node completes.
        We convert each to JSON and send it as an SSE event.

        SSE format = "data: <json>\n\n"
        The double newline tells the browser: "this event is complete"
        """
        accumulated = {}  # Collect all outputs to save to DB at the end

        try:
            # astream() is like ainvoke() but yields results NODE BY NODE
            async for event in Langgraph().stream(state):
                # event looks like: {"planner": {"intent": "learn", "topic": "..."}}
                for node_name, node_output in event.items():

                    # Build a chunk with just the useful data from this node
                    chunk = {"node": node_name, "session_id": session_id}

                    if node_name == "planner":
                        chunk["intent"] = node_output.get("intent", "")
                        chunk["topic"] = node_output.get("topic", "")
                    elif node_name == "teacher":
                        chunk["explanation"] = node_output.get("explanation", "")
                    elif node_name == "research":
                        chunk["resources"] = node_output.get("resources", "")
                    elif node_name == "quiz":
                        chunk["questions"] = node_output.get("questions", "")
                    elif node_name == "evaluator":
                        chunk["feedback"] = node_output.get("feedback", "")
                    elif node_name == "roadmap":
                        chunk["suggested_path"] = node_output.get("suggested_path", "")
                    elif node_name == "chat":
                        chunk["response"] = node_output.get("response", "")
                        chunk["explanation"] = node_output.get("explanation", "")

                    # Save this node's output for the DB save later
                    accumulated.update(node_output)

                    # Send this chunk to the frontend NOW
                    yield f"data: {json_lib.dumps(chunk)}\n\n"

            # All nodes done — tell the frontend to stop listening
            yield "data: [DONE]\n\n"

        except Exception as e:
            # If something goes wrong, send the error to the frontend
            yield f"data: {json_lib.dumps({'error': str(e)})}\n\n"

        # ── Save AI response to DB after stream is done ──────────
        response_text = (
            accumulated.get("response")
            or accumulated.get("explanation")
            or accumulated.get("feedback")
            or ""
        )

        # Convert lists/dicts to strings for DB storage
        def to_str(val):
            if isinstance(val, (list, dict)):
                return json_lib.dumps(val)
            return str(val) if val else ""

        # Save AI message (fire-and-forget is fine here)
        asyncio.create_task(asyncio.to_thread(chat_service.save_message, {
            "session_id": session_id,
            "sender": "ai",
            "content": response_text,
            "metadata": {
                "intent": accumulated.get("intent", ""),
                "topic": accumulated.get("topic", ""),
                "explanation": accumulated.get("explanation", ""),
                "code_examples": accumulated.get("code_examples", ""),
                "diagram": accumulated.get("diagram", ""),
                "questions": to_str(accumulated.get("questions", "")),
                "resources": to_str(accumulated.get("resources", "")),
                "feedback": accumulated.get("feedback", ""),
                "suggested_path": to_str(accumulated.get("suggested_path", "")),
            },
            "created_at": datetime.utcnow().isoformat()
        }))

        # Update session topic AND title — await so it's saved
        # before the frontend fetches the sessions list
        topic = accumulated.get("topic", "")
        if topic:
            await asyncio.to_thread(
                chat_service.update_session, session_id,
                {"topic": topic, "title": topic, "updated_at": datetime.utcnow().isoformat()}
            )

    # ── Return StreamingResponse ─────────────────────────────────
    # This tells FastAPI: "don't wait for event_generator to finish,
    # send each yielded chunk to the client immediately"
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",  # tells browser: "this is SSE"
        headers={
            "Cache-Control": "no-cache",       # don't cache the stream
            "Connection": "keep-alive",         # keep connection open
            "X-Accel-Buffering": "no",          # tell nginx: don't buffer
        }
    )


@router.get("/messages/{session_id}")
def get_messages(session_id: str):

    return chat_service.get_messages(session_id)