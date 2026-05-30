def planner_agent(state):
    query=state["user_query"]
    if "quiz" in query.lower():
        return {
            "next_step":"quiz"
        }
    return {"next_step":"teach"}
