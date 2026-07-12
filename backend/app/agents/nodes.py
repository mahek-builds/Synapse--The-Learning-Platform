from app.agents.state import LearningState
import json
from app.prompts.planner import PLANNER_PROMPT
from app.prompts.teacher import TEACHER_PROMPT
from app.prompts.research import RESEARCH_PROMPT
from app.prompts.quiz import QUIZ_PROMPT
from app.prompts.evaluator import EVALUATOR_PROMPT
from app.prompts.roadmap import ROADMAP_PROMPT
from app.prompts.chat import CHAT_PROMPT

from app.services.cohere_service import llm


def planner_node(state: LearningState):

    prompt = PLANNER_PROMPT.format(
        message=state["user_message"]
    )

    response = llm.invoke(prompt)
    
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
            "suggested_difficulty": 0
        }

    state["intent"] = data.get("intent", "chat")
    state["topic"] = data.get("topic", "")
    state["skill_level"] = data.get("skill_level", "beginner")
    state["suggested_difficulty"] = data.get("suggested_difficulty", 0)

    return state


def teacher_node(state: LearningState):

    prompt = TEACHER_PROMPT.format(
        topic=state["topic"],
        skill_level=state["skill_level"]
    )

    response = llm.invoke(prompt)

    state["explanation"] = response.content

    return state


def research_node(state: LearningState):

    prompt = RESEARCH_PROMPT.format(
        topic=state["topic"]
    )

    response = llm.invoke(prompt)

    state["resources"] = response.content

    return state


def quiz_node(state: LearningState):

    prompt = QUIZ_PROMPT.format(
        topic=state["topic"],
        difficulty=state["suggested_difficulty"]
    )

    response = llm.invoke(prompt)

    state["questions"] = response.content

    return state


def evaluator_node(state: LearningState):

    prompt = EVALUATOR_PROMPT.format(
        answers=state["questions"]
    )

    response = llm.invoke(prompt)

    state["feedback"] = response.content

    return state


def roadmap_node(state: LearningState):

    prompt = ROADMAP_PROMPT.format(
        topic=state["topic"],
        skill_level=state["skill_level"]
    )

    response = llm.invoke(prompt)

    state["suggested_path"] = response.content

    return state


def chat_node(state: LearningState):

    prompt = CHAT_PROMPT.format(
        message=state["user_message"]
    )

    response = llm.invoke(prompt)

    state["response"] = response.content
    state["explanation"] = response.content

    return state