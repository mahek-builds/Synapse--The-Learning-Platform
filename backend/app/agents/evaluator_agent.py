def evaluator_agent(state):
    return {
        "final_response": f"""
        Explanation:
        {state['explanation']}

         Quiz:
        {state.get('quiz', [])}
        """
    }