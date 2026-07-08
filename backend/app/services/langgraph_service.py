from app.agents.graph import graph
from app.agents.state import LearningState
class Langgraph:
    def __init__(self):
        self.graph=graph
    
    async def invoke(
        self,
        state: LearningState
    ):

        return await self.graph.ainvoke(state)

    async def stream(
        self,
        state: LearningState
    ):

        async for event in self.graph.astream(state):

            yield event

