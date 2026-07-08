from langchain_cohere import ChatCohere
from app.core.config import settings
llm=ChatCohere(
    cohere_api_key=settings.COHERE_API_KEY,
    model="command-r-plus",
    temperature=0.3,
    max_tokens=2048,
)

