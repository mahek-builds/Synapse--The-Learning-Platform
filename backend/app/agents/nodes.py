from app.agents.state import LearningState


def planner_node(state: LearningState):

    message = state["user_message"]

    state["intent"] = "learn"

    state["topic"] = message

    return state


def teacher_node(state: LearningState):

    topic = state["topic"]

    state["explanation"] = (
        f"Explanation for {topic}"
    )

    return state


def research_node(state: LearningState):

    state["resources"] = [
        "Official Documentation",
        "Practice Problems"
    ]

    return state


def quiz_node(state: LearningState):

    topic = state["topic"]

    state["questions"] = [

        {
            "question": f"What is {topic}?",
            "type": "mcq"
        }

    ]

    return state


def evaluator_node(state: LearningState):

    state["feedback"] = "Good Job"

    state["xp_earned"] = 10

    return state


def roadmap_node(state: LearningState):

    state["suggested_path"] = [
        "Next Topic 1",
        "Next Topic 2"
    ]

    return state