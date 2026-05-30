def teacher_agent(state):
    query=state["user_query"]
    explaination=f"""
    Teaching Topic: {query}
    1. Concept explaination
    2.Real-world analogy
    3.key points
    """
    return {"explaination":explaination}