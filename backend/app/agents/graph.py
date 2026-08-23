from langgraph.graph import StateGraph, START, END

from app.agents.state import LearningState
from app.agents.nodes import (
    planner_node,
    teacher_node,
    research_node,
    quiz_node,
    evaluator_node,
    roadmap_node,
    chat_node,
)


# Create Graph
builder = StateGraph(LearningState)


# Register Nodes
builder.add_node("planner", planner_node)
builder.add_node("teacher", teacher_node)
builder.add_node("research", research_node)
builder.add_node("quiz", quiz_node)
builder.add_node("evaluator", evaluator_node)
builder.add_node("roadmap", roadmap_node)
builder.add_node("chat", chat_node)


# Entry Point
builder.add_edge(START, "planner")


# Router Function
def route(state: LearningState) -> list[str] | str:
    """
    Decide next node based on Planner output.
    """

    intent = state.get("intent", "").lower()
    needs_research = state.get("needs_research", False)

    if intent == "chat":
        return "chat"

    if intent == "evaluate":
        return "evaluator"

    if intent == "quiz":
        return ["quiz", "roadmap"]

    if intent == "teacher":
        if needs_research:
            return "research"
        return ["teacher", "quiz", "roadmap"]

    if intent == "research":
        return "research"

    if intent == "roadmap":
        return "roadmap"

    # Default fallbacks
    return "chat"


# Conditional Routing
builder.add_conditional_edges(
    "planner",
    route,
    {
        "teacher": "teacher",
        "research": "research",
        "quiz": "quiz",
        "chat": "chat",
        "roadmap": "roadmap",
        "evaluate": "evaluator",
    },
)


# Chat Flow
builder.add_edge("chat", END)


# Parallel Branch Endpoints transition to END (Fan-In)
builder.add_edge("teacher", END)
builder.add_edge("quiz", END)
builder.add_edge("roadmap", END)
builder.add_edge("evaluator", END)


def route_after_research(state: LearningState) -> list[str] | str:
    intent = state.get("intent", "").lower()
    if intent == "teacher":
        return ["teacher", "quiz", "roadmap"]
    if intent == "quiz":
        return ["quiz", "roadmap"]
    return ["quiz", "roadmap"]

# Conditional routing after research
builder.add_conditional_edges(
    "research",
    route_after_research,
    {
        "teacher": "teacher",
        "quiz": "quiz",
        "roadmap": "roadmap"
    }
)


# Compile Graph
graph = builder.compile()