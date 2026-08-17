from langchain_cohere import ChatCohere
from app.core.config import settings

# Full model for content-heavy nodes (teacher, research, quiz, etc.)
llm = ChatCohere(
    cohere_api_key=settings.COHERE_API_KEY,
    model="command-r-08-2024",
    temperature=0.3,
    max_tokens=2048,
)

# Fast model for planner (only outputs small JSON)
llm_fast = ChatCohere(
    cohere_api_key=settings.COHERE_API_KEY,
    model="command-r-08-2024",
    temperature=0.1,
    max_tokens=256,
)

