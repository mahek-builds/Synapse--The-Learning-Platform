from typing import Annotated, TypedDict
import operator


class LearningState(TypedDict):
    # Inputs
    user_message: str
    user_id: str
    skill_level: int
    topic: str
    learning_history: list

    # Routing
    intent: str
    suggested_difficulty: int

    # Agent outputs
    explanation: str
    code_examples: str
    diagram: str
    questions: list
    resources: list
    feedback: str
    xp_earned: int
    suggested_path: list

    # Streaming
    response_chunks: Annotated[list, operator.add]