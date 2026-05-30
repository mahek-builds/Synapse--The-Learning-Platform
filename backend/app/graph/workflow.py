from langgraph.graph import START,END,StateGraph
from app.graph.state import AgentState
from app.agents.planner_agent  import planner_agent
from app.agents.teacher_agent import teacher_agent
from app.agents.quiz_agent import quiz_agent
from app.agents.evaluator_agent import evaluator_agent
graph=StateGraph(AgentState)
graph.add_node("planner",planner_agent)
graph.add_node("teacher", teacher_agent)
graph.add_node("quiz", quiz_agent)
graph.add_node("evaluator", evaluator_agent)
def route(state):
    return state.get("next_step", "teacher")
graph.add_edge(START, "planner")

graph.add_conditional_edges(
    "planner",
    route,
    {
        "teacher": "teacher",
        "quiz": "quiz"
    }
)

graph.add_edge("teacher", "evaluator")
graph.add_edge("quiz", "evaluator")
graph.add_edge("evaluator", END)
app_graph=graph.compile()


