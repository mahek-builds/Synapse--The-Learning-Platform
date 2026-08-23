from app.agents.state import LearningState
import json
from app.prompts.planner import PLANNER_PROMPT
from app.prompts.teacher import TEACHER_PROMPT
from app.prompts.research import RESEARCH_PROMPT
from app.prompts.quiz import QUIZ_PROMPT
from app.prompts.evaluator import EVALUATOR_PROMPT
from app.prompts.roadmap import ROADMAP_PROMPT
from app.prompts.chat import CHAT_PROMPT
import asyncio
from langchain_community.tools import DuckDuckGoSearchRun


from app.services.cohere_service import llm, llm_fast


async def planner_node(state: LearningState):

    context_str = state.get("questions", "")
    prompt = PLANNER_PROMPT.format(
        message=state["user_message"],
        context=f"Pending Quiz:\n{context_str}" if context_str else "No pending quiz."
    )

    response = await llm_fast.ainvoke(prompt)
    
    try:
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[len("```json"):]
        if content.startswith("```"):
            content = content[len("```"):]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        data = json.loads(content)
    except Exception:
        data = {
            "intent": "chat",
            "topic": "",
            "skill_level": "beginner",
            "suggested_difficulty": 0,
            "needs_research": False
        }

    return {
        "intent": data.get("intent", "chat"),
        "topic": data.get("topic", ""),
        "skill_level": data.get("skill_level", "beginner"),
        "suggested_difficulty": data.get("suggested_difficulty", 0),
        "needs_research": data.get("needs_research", False)
    }


async def teacher_node(state: LearningState):

    resources = state.get("resources", "")
    search_context = json.dumps(resources) if isinstance(resources, (list, dict)) else str(resources)

    prompt = TEACHER_PROMPT.format(
        topic=state["topic"],
        skill_level=state["skill_level"],
        search_context=search_context
    )

    response = await llm.ainvoke(prompt)

    return {"explanation": response.content}


async def research_node(state: LearningState):
    # We search for the topic along with "tutorials resources" to get helpful links
    query = f"Learn {state['topic']} tutorials and resources"
    
    try:
        # 1. Initialize the free DuckDuckGo search tool
        search = DuckDuckGoSearchRun()
        # 2. Run the search in a separate thread so it doesn't block FastAPI
        results = await asyncio.to_thread(search.run, query)
        resources = results
    except Exception as e:
        # Fallback if search fails (e.g. rate limits or network issues)
        resources = f"Here are some resources on {state['topic']}. (Search failed: {str(e)})"
    return {"resources": resources}


async def quiz_node(state: LearningState):

    prompt = QUIZ_PROMPT.format(
        topic=state["topic"],
        difficulty=state["suggested_difficulty"]
    )

    response = await llm.ainvoke(prompt)

    return {"questions": response.content}


async def evaluator_node(state: LearningState):

    prompt = EVALUATOR_PROMPT.format(
        questions=state.get("questions", ""),
        user_answers=state.get("user_message", "")
    )

    response = await llm.ainvoke(prompt)

    return {"feedback": response.content}


async def roadmap_node(state: LearningState):

    prompt = ROADMAP_PROMPT.format(
        topic=state["topic"],
        skill_level=state["skill_level"]
    )

    response = await llm.ainvoke(prompt)

    return {"suggested_path": response.content}


async def chat_node(state: LearningState):

    prompt = CHAT_PROMPT.format(
        message=state["user_message"]
    )

    response = await llm.ainvoke(prompt)

    return {
        "response": response.content,
        "explanation": response.content
    }