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
def route(state: LearningState) -> str:
    """
    Decide next node based on Planner output.
    """

    intent = state.get("intent", "").lower()

    if intent == "chat":
        return "chat"

    if intent == "quiz":
        return "quiz"

    if intent == "learn":
        return "teacher"

    if intent == "review":
        return "teacher"

    # Default
    return "teacher"


# Conditional Routing
builder.add_conditional_edges(
    "planner",
    route,
    {
        "teacher": "teacher",
        "quiz": "quiz",
        "chat": "chat",
    },
)


# Chat Flow
builder.add_edge("chat", END)


# Learning Flow
builder.add_edge("teacher", "research")
builder.add_edge("research", "evaluator")


# Quiz Flow
builder.add_edge("quiz", "evaluator")


# Common Flow
builder.add_edge("evaluator", "roadmap")
builder.add_edge("roadmap", END)


# Compile Graph
graph = builder.compile()